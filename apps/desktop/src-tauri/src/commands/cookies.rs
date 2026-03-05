use tauri::State;

use crate::http::cookies::{CookieEntry, CookieJarManager};

#[tauri::command]
pub async fn get_cookie_jar(
    collection_path: String,
    cookie_jar: State<'_, CookieJarManager>,
) -> Result<Vec<CookieEntry>, String> {
    cookie_jar.get_cookies(&collection_path)
}

#[tauri::command]
pub async fn delete_cookie(
    collection_path: String,
    name: String,
    domain: String,
    cookie_jar: State<'_, CookieJarManager>,
) -> Result<(), String> {
    cookie_jar.delete_cookie(&collection_path, &name, &domain)
}

#[tauri::command]
pub async fn clear_cookie_jar(
    collection_path: String,
    cookie_jar: State<'_, CookieJarManager>,
) -> Result<(), String> {
    cookie_jar.clear_jar(&collection_path)
}
