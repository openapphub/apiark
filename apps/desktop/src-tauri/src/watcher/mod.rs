pub mod collection_watcher;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileChangeEvent {
    pub path: String,
    pub change_type: FileChangeType,
    pub collection_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FileChangeType {
    Created,
    Modified,
    Deleted,
    Renamed,
}
