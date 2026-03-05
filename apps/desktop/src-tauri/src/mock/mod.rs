pub mod server;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockServerConfig {
    pub collection_path: String,
    pub port: u16,
    pub latency_ms: u64,
    pub error_rate: f64, // 0.0 - 1.0
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockEndpoint {
    pub method: String,
    pub path: String,
    pub status: u16,
    pub body: String,
    pub content_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockServerStatus {
    pub id: String,
    pub collection_name: String,
    pub port: u16,
    pub endpoints: Vec<MockEndpoint>,
    pub running: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockRequestLog {
    pub method: String,
    pub path: String,
    pub status: u16,
    pub time_ms: u64,
    pub timestamp: String,
}
