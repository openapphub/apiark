use tauri::{AppHandle, State};

use crate::watcher::collection_watcher::CollectionWatcher;

#[tauri::command]
pub async fn watch_collection(
    collection_path: String,
    watcher: State<'_, CollectionWatcher>,
    app: AppHandle,
) -> Result<(), String> {
    watcher.watch(&collection_path, app)
}

#[tauri::command]
pub async fn unwatch_collection(
    collection_path: String,
    watcher: State<'_, CollectionWatcher>,
) -> Result<(), String> {
    watcher.unwatch(&collection_path)
}
