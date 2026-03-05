use crate::plugins::manager::{PluginInfo, PluginManager};

#[tauri::command]
pub async fn list_plugins(
    state: tauri::State<'_, PluginManager>,
) -> Result<Vec<PluginInfo>, String> {
    Ok(state.list())
}

#[tauri::command]
pub async fn toggle_plugin(
    name: String,
    state: tauri::State<'_, PluginManager>,
) -> Result<bool, String> {
    state.toggle(&name)
}

#[tauri::command]
pub async fn uninstall_plugin(
    name: String,
    state: tauri::State<'_, PluginManager>,
) -> Result<(), String> {
    state.uninstall(&name)
}

#[tauri::command]
pub async fn install_plugin(
    path: String,
    state: tauri::State<'_, PluginManager>,
) -> Result<PluginInfo, String> {
    state.install_from_dir(std::path::Path::new(&path))
}
