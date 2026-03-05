pub mod monitor;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorConfig {
    pub name: String,
    pub collection_path: String,
    pub folder_path: Option<String>,
    pub environment_name: Option<String>,
    pub cron_expression: String,
    pub notify_on_failure: bool,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorStatus {
    pub id: String,
    pub name: String,
    pub collection_path: String,
    pub cron_expression: String,
    pub enabled: bool,
    pub last_run: Option<String>,
    pub last_status: Option<String>, // "pass" | "fail"
    pub run_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorResult {
    pub id: i64,
    pub monitor_id: String,
    pub timestamp: String,
    pub total_requests: usize,
    pub total_passed: usize,
    pub total_failed: usize,
    pub total_time_ms: u64,
    pub status: String, // "pass" | "fail"
    pub error: Option<String>,
}
