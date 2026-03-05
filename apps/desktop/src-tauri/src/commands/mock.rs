use tauri::{AppHandle, State};

use crate::mock::server::MockServerManager;
use crate::mock::{MockServerConfig, MockServerStatus};

#[tauri::command]
pub async fn start_mock_server(
    config: MockServerConfig,
    app: AppHandle,
    manager: State<'_, MockServerManager>,
) -> Result<MockServerStatus, String> {
    manager.start(config, app).await
}

#[tauri::command]
pub fn stop_mock_server(
    server_id: &str,
    manager: State<'_, MockServerManager>,
) -> Result<(), String> {
    manager.stop(server_id)
}

#[tauri::command]
pub fn list_mock_servers(
    manager: State<'_, MockServerManager>,
) -> Result<Vec<MockServerStatus>, String> {
    manager.list()
}
