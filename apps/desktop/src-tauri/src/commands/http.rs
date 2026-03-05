use std::collections::HashMap;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::commands::history::AppState;
use crate::http::client::HttpEngine;
use crate::http::interpolation;
use crate::models::auth::AuthConfig;
use crate::models::error::HttpError;
use crate::models::request::{KeyValuePair, SendRequestParams};
use crate::models::response::ResponseData;
use crate::oauth::OAuthTokenStore;
use crate::scripting::assertions::evaluate_assertions_from_yaml;
use crate::scripting::engine::execute_script;
use crate::scripting::{
    AssertionResult, ConsoleEntry, RequestSnapshot, ResponseSnapshot, ScriptContext, ScriptPhase,
    TestResult,
};
use crate::storage::history::HistoryEntry;

/// Extended response that includes scripting results
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScriptedResponseData {
    // Base response fields (flattened)
    pub status: u16,
    pub status_text: String,
    pub headers: Vec<KeyValuePair>,
    pub cookies: Vec<crate::models::response::CookieData>,
    pub body: String,
    pub time_ms: u64,
    pub size_bytes: u64,

    // Scripting results
    pub test_results: Vec<TestResult>,
    pub assertion_results: Vec<AssertionResult>,
    pub console_output: Vec<ConsoleEntry>,
    pub env_mutations: HashMap<String, Option<String>>,
}

#[tauri::command]
pub async fn send_request(
    state: State<'_, AppState>,
    oauth_store: State<'_, OAuthTokenStore>,
    params: SendRequestParams,
    variables: Option<HashMap<String, String>>,
    collection_path: Option<String>,
    request_name: Option<String>,
) -> Result<ResponseData, String> {
    let vars = variables.unwrap_or_default();
    let mut interpolated = interpolate_params(&params, &vars);
    resolve_oauth_token(&mut interpolated, &oauth_store)?;

    tracing::info!(method = ?interpolated.method, url = %interpolated.url, "Sending request");

    let result = HttpEngine::send(interpolated.clone()).await;

    record_history(&state, &interpolated, &params, &result, collection_path, request_name);

    result.map_err(|e| {
        let http_error: HttpError = e.into();
        serde_json::to_string(&http_error).unwrap_or(http_error.message)
    })
}

#[allow(clippy::too_many_arguments)]
#[tauri::command]
pub async fn send_request_with_scripts(
    state: State<'_, AppState>,
    oauth_store: State<'_, OAuthTokenStore>,
    params: SendRequestParams,
    variables: Option<HashMap<String, String>>,
    collection_path: Option<String>,
    request_name: Option<String>,
    pre_request_script: Option<String>,
    post_response_script: Option<String>,
    test_script: Option<String>,
    assertions_yaml: Option<String>,
) -> Result<ScriptedResponseData, String> {
    let mut vars = variables.unwrap_or_default();
    let mut interpolated = interpolate_params(&params, &vars);
    resolve_oauth_token(&mut interpolated, &oauth_store)?;

    let mut all_console: Vec<ConsoleEntry> = Vec::new();
    let mut all_tests: Vec<TestResult> = Vec::new();

    // 1. Execute pre-request script (if any)
    if let Some(ref script) = pre_request_script {
        if !script.trim().is_empty() {
            let snapshot = request_snapshot_from_params(&interpolated);
            let ctx = ScriptContext {
                request: snapshot,
                response: None,
                env: vars.clone(),
                globals: HashMap::new(),
                variables: HashMap::new(),
            };

            let result = execute_script(script, ctx, ScriptPhase::PreRequest)
                .map_err(|e| format!("Pre-request script error: {e}"))?;

            // Apply request mutations from pre-request script
            interpolated.url = result.request.url;
            interpolated.method = match result.request.method.as_str() {
                "GET" => crate::models::request::HttpMethod::GET,
                "POST" => crate::models::request::HttpMethod::POST,
                "PUT" => crate::models::request::HttpMethod::PUT,
                "PATCH" => crate::models::request::HttpMethod::PATCH,
                "DELETE" => crate::models::request::HttpMethod::DELETE,
                "HEAD" => crate::models::request::HttpMethod::HEAD,
                "OPTIONS" => crate::models::request::HttpMethod::OPTIONS,
                _ => interpolated.method,
            };
            // Apply header mutations
            interpolated.headers = result
                .request
                .headers
                .iter()
                .map(|(k, v)| KeyValuePair {
                    key: k.clone(),
                    value: v.clone(),
                    enabled: true,
                })
                .collect();
            // Apply body mutation
            if let Some(body_str) = result.request.body {
                if let Some(ref mut body) = interpolated.body {
                    body.content = body_str;
                }
            }

            // Apply env mutations
            apply_env_mutations(&mut vars, &result.env_mutations);
            all_console.extend(result.console_output);
            all_tests.extend(result.test_results);
        }
    }

    tracing::info!(method = ?interpolated.method, url = %interpolated.url, "Sending request (scripted)");

    // 2. Send the HTTP request
    let response = HttpEngine::send(interpolated.clone()).await.map_err(|e| {
        let http_error: HttpError = e.into();
        serde_json::to_string(&http_error).unwrap_or(http_error.message)
    })?;

    // Record history
    record_history(
        &state,
        &interpolated,
        &params,
        &Ok(response.clone()),
        collection_path,
        request_name,
    );

    // Build response snapshot for scripts
    let resp_snapshot = response_snapshot_from_data(&response);

    // Collect env mutations from all post-response scripts
    let mut env_mutations: HashMap<String, Option<String>> = HashMap::new();

    // 3. Execute post-response script (if any)
    if let Some(ref script) = post_response_script {
        if !script.trim().is_empty() {
            let snapshot = request_snapshot_from_params(&interpolated);
            let ctx = ScriptContext {
                request: snapshot,
                response: Some(resp_snapshot.clone()),
                env: vars.clone(),
                globals: HashMap::new(),
                variables: HashMap::new(),
            };

            let result = execute_script(script, ctx, ScriptPhase::PostResponse)
                .map_err(|e| format!("Post-response script error: {e}"))?;

            apply_env_mutations(&mut vars, &result.env_mutations);
            env_mutations.extend(result.env_mutations);
            all_console.extend(result.console_output);
            all_tests.extend(result.test_results);
        }
    }

    // 4. Evaluate declarative assertions (if any)
    let mut assertion_results = Vec::new();
    if let Some(ref yaml_str) = assertions_yaml {
        if !yaml_str.trim().is_empty() {
            match serde_yaml::from_str(yaml_str) {
                Ok(yaml_value) => {
                    assertion_results = evaluate_assertions_from_yaml(&yaml_value, &resp_snapshot);
                }
                Err(e) => {
                    all_console.push(ConsoleEntry {
                        level: "error".to_string(),
                        message: format!("Failed to parse assertions YAML: {e}"),
                    });
                }
            }
        }
    }

    // 5. Execute test script (if any)
    if let Some(ref script) = test_script {
        if !script.trim().is_empty() {
            let snapshot = request_snapshot_from_params(&interpolated);
            let ctx = ScriptContext {
                request: snapshot,
                response: Some(resp_snapshot.clone()),
                env: vars.clone(),
                globals: HashMap::new(),
                variables: HashMap::new(),
            };

            let result = execute_script(script, ctx, ScriptPhase::PostResponse)
                .map_err(|e| format!("Test script error: {e}"))?;

            apply_env_mutations(&mut vars, &result.env_mutations);
            env_mutations.extend(result.env_mutations);
            all_console.extend(result.console_output);
            all_tests.extend(result.test_results);
        }
    }

    Ok(ScriptedResponseData {
        status: response.status,
        status_text: response.status_text,
        headers: response.headers,
        cookies: response.cookies,
        body: response.body,
        time_ms: response.time_ms,
        size_bytes: response.size_bytes,
        test_results: all_tests,
        assertion_results,
        console_output: all_console,
        env_mutations,
    })
}

// ── Helpers ──

fn interpolate_params(params: &SendRequestParams, vars: &HashMap<String, String>) -> SendRequestParams {
    let mut interpolated = params.clone();
    interpolated.url = interpolation::interpolate(&params.url, vars);

    interpolated.headers = params
        .headers
        .iter()
        .map(|h| KeyValuePair {
            key: interpolation::interpolate(&h.key, vars),
            value: interpolation::interpolate(&h.value, vars),
            enabled: h.enabled,
        })
        .collect();

    interpolated.params = params
        .params
        .iter()
        .map(|p| KeyValuePair {
            key: interpolation::interpolate(&p.key, vars),
            value: interpolation::interpolate(&p.value, vars),
            enabled: p.enabled,
        })
        .collect();

    if let Some(ref body) = params.body {
        let mut new_body = body.clone();
        new_body.content = interpolation::interpolate(&body.content, vars);
        new_body.form_data = body
            .form_data
            .iter()
            .map(|fd| KeyValuePair {
                key: interpolation::interpolate(&fd.key, vars),
                value: interpolation::interpolate(&fd.value, vars),
                enabled: fd.enabled,
            })
            .collect();
        interpolated.body = Some(new_body);
    }

    if let Some(ref auth) = params.auth {
        interpolated.auth = Some(interpolate_auth(auth, vars));
    }

    interpolated
}

fn request_snapshot_from_params(params: &SendRequestParams) -> RequestSnapshot {
    RequestSnapshot {
        method: format!("{:?}", params.method),
        url: params.url.clone(),
        headers: params
            .headers
            .iter()
            .filter(|h| h.enabled)
            .map(|h| (h.key.clone(), h.value.clone()))
            .collect(),
        body: params.body.as_ref().map(|b| b.content.clone()),
    }
}

fn response_snapshot_from_data(response: &ResponseData) -> ResponseSnapshot {
    ResponseSnapshot {
        status: response.status,
        status_text: response.status_text.clone(),
        headers: response
            .headers
            .iter()
            .map(|h| (h.key.clone(), h.value.clone()))
            .collect(),
        body: response.body.clone(),
        time_ms: response.time_ms,
        size_bytes: response.size_bytes,
    }
}

fn apply_env_mutations(vars: &mut HashMap<String, String>, mutations: &HashMap<String, Option<String>>) {
    for (key, value) in mutations {
        match value {
            Some(v) => { vars.insert(key.clone(), v.clone()); }
            None => { vars.remove(key); }
        }
    }
}

fn record_history(
    state: &State<'_, AppState>,
    interpolated: &SendRequestParams,
    original_params: &SendRequestParams,
    result: &Result<ResponseData, crate::models::error::HttpEngineError>,
    collection_path: Option<String>,
    request_name: Option<String>,
) {
    let history_db = Arc::clone(&state.history_db);
    let method_str = format!("{:?}", interpolated.method);
    let url_str = interpolated.url.clone();
    let request_json = serde_json::to_string(original_params).unwrap_or_default();

    match result {
        Ok(response) => {
            let entry = HistoryEntry {
                id: 0,
                method: method_str,
                url: url_str,
                status: Some(response.status as i32),
                status_text: Some(response.status_text.clone()),
                time_ms: Some(response.time_ms as i64),
                size_bytes: Some(response.size_bytes as i64),
                timestamp: chrono::Utc::now().to_rfc3339(),
                collection_path,
                request_name,
                request_json,
            };
            tokio::spawn(async move {
                if let Err(e) = history_db.insert(&entry) {
                    tracing::warn!("Failed to record history: {e}");
                }
            });
        }
        Err(_) => {
            let entry = HistoryEntry {
                id: 0,
                method: method_str,
                url: url_str,
                status: None,
                status_text: None,
                time_ms: None,
                size_bytes: None,
                timestamp: chrono::Utc::now().to_rfc3339(),
                collection_path,
                request_name,
                request_json,
            };
            tokio::spawn(async move {
                if let Err(e) = history_db.insert(&entry) {
                    tracing::warn!("Failed to record history: {e}");
                }
            });
        }
    }
}

fn interpolate_auth(auth: &AuthConfig, vars: &HashMap<String, String>) -> AuthConfig {
    match auth {
        AuthConfig::None => AuthConfig::None,
        AuthConfig::Bearer { token } => AuthConfig::Bearer {
            token: interpolation::interpolate(token, vars),
        },
        AuthConfig::Basic { username, password } => AuthConfig::Basic {
            username: interpolation::interpolate(username, vars),
            password: interpolation::interpolate(password, vars),
        },
        AuthConfig::ApiKey {
            key,
            value,
            add_to,
        } => AuthConfig::ApiKey {
            key: interpolation::interpolate(key, vars),
            value: interpolation::interpolate(value, vars),
            add_to: add_to.clone(),
        },
        AuthConfig::Oauth2 {
            grant_type,
            auth_url,
            token_url,
            client_id,
            client_secret,
            scope,
            callback_url,
            username,
            password,
            use_pkce,
        } => AuthConfig::Oauth2 {
            grant_type: grant_type.clone(),
            auth_url: interpolation::interpolate(auth_url, vars),
            token_url: interpolation::interpolate(token_url, vars),
            client_id: interpolation::interpolate(client_id, vars),
            client_secret: interpolation::interpolate(client_secret, vars),
            scope: interpolation::interpolate(scope, vars),
            callback_url: interpolation::interpolate(callback_url, vars),
            username: interpolation::interpolate(username, vars),
            password: interpolation::interpolate(password, vars),
            use_pkce: *use_pkce,
        },
        AuthConfig::Digest { username, password } => AuthConfig::Digest {
            username: interpolation::interpolate(username, vars),
            password: interpolation::interpolate(password, vars),
        },
        AuthConfig::AwsV4 { access_key, secret_key, region, service, session_token } => AuthConfig::AwsV4 {
            access_key: interpolation::interpolate(access_key, vars),
            secret_key: interpolation::interpolate(secret_key, vars),
            region: interpolation::interpolate(region, vars),
            service: interpolation::interpolate(service, vars),
            session_token: interpolation::interpolate(session_token, vars),
        },
        AuthConfig::JwtBearer { secret, algorithm, payload, header_prefix } => AuthConfig::JwtBearer {
            secret: interpolation::interpolate(secret, vars),
            algorithm: algorithm.clone(),
            payload: interpolation::interpolate(payload, vars),
            header_prefix: header_prefix.clone(),
        },
    }
}

/// If the auth is OAuth2, look up the cached token and convert to Bearer.
fn resolve_oauth_token(
    params: &mut SendRequestParams,
    store: &OAuthTokenStore,
) -> Result<(), String> {
    if let Some(AuthConfig::Oauth2 {
        client_id,
        auth_url,
        ..
    }) = &params.auth
    {
        let key = OAuthTokenStore::cache_key(client_id, auth_url);
        match store.get(&key) {
            Some(token) if !token.is_expired() => {
                params.auth = Some(AuthConfig::Bearer {
                    token: token.access_token,
                });
                Ok(())
            }
            Some(_) => Err(
                "OAuth token has expired. Please click \"Get Token\" to re-authenticate."
                    .to_string(),
            ),
            None => Err(
                "No OAuth token found. Please click \"Get Token\" to authenticate first."
                    .to_string(),
            ),
        }
    } else {
        Ok(())
    }
}
