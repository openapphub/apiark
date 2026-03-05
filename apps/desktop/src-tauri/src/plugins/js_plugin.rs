use std::path::Path;

/// Execute a JS plugin's hook using rquickjs.
/// The plugin receives a context object and returns a modified context.
pub fn execute_js_hook(
    plugin_dir: &Path,
    entry: &str,
    hook: &str,
    context_json: &str,
) -> Result<String, String> {
    let entry_path = plugin_dir.join(entry);
    let plugin_code = std::fs::read_to_string(&entry_path)
        .map_err(|e| format!("Failed to read plugin entry: {e}"))?;

    let rt = rquickjs::Runtime::new().map_err(|e| format!("JS runtime error: {e}"))?;
    let ctx = rquickjs::Context::full(&rt).map_err(|e| format!("JS context error: {e}"))?;

    let result = ctx.with(|ctx| -> Result<String, String> {
        // Inject context
        let inject = format!(
            r#"globalThis.__pluginContext = {};
               globalThis.__hookResult = null;"#,
            context_json,
        );
        ctx.eval::<(), _>(inject.as_bytes())
            .map_err(|e| format!("Failed to inject context: {e}"))?;

        // Load plugin code
        ctx.eval::<(), _>(plugin_code.as_bytes())
            .map_err(|e| format!("Plugin execution error: {e}"))?;

        // Call the hook function
        let call = format!(
            r#"if (typeof exports !== 'undefined' && typeof exports.{hook} === 'function') {{
                 __hookResult = JSON.stringify(exports.{hook}(__pluginContext));
               }} else if (typeof {hook} === 'function') {{
                 __hookResult = JSON.stringify({hook}(__pluginContext));
               }}"#,
            hook = hook,
        );
        ctx.eval::<(), _>(call.as_bytes())
            .map_err(|e| format!("Hook call error: {e}"))?;

        // Extract result
        let result: String = ctx
            .eval("__hookResult || '{}'")
            .map_err(|e| format!("Failed to get hook result: {e}"))?;

        Ok(result)
    })?;

    Ok(result)
}
