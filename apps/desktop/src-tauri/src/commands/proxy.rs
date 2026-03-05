use crate::proxy::capture::{CapturedRequest, ProxyCaptureManager, ProxyStatus};

#[tauri::command]
pub async fn proxy_start(
    port: u16,
    app: tauri::AppHandle,
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<ProxyStatus, String> {
    state.start(port, app).await?;
    Ok(state.status())
}

#[tauri::command]
pub async fn proxy_stop(
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<ProxyStatus, String> {
    state.stop();
    Ok(state.status())
}

#[tauri::command]
pub async fn proxy_status(
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<ProxyStatus, String> {
    Ok(state.status())
}

#[tauri::command]
pub async fn proxy_get_captures(
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<Vec<CapturedRequest>, String> {
    Ok(state.get_captures())
}

#[tauri::command]
pub async fn proxy_clear_captures(
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<(), String> {
    state.clear_captures();
    Ok(())
}

#[tauri::command]
pub async fn proxy_set_passthrough(
    domains: Vec<String>,
    state: tauri::State<'_, ProxyCaptureManager>,
) -> Result<(), String> {
    state.set_passthrough_domains(domains);
    Ok(())
}
