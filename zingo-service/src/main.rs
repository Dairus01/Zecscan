use axum::{
    extract::State,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::{info, error};

mod decrypt;
mod scan;

use decrypt::decrypt_memo;
use scan::scan_transactions;

#[derive(Clone)]
struct AppState {
    // Add any shared state here (e.g., connection pools)
}

#[derive(Deserialize)]
struct DecryptMemoRequest {
    ufvk: String,
    txid: String,
    #[serde(default = "default_lightwalletd_url")]
    lightwalletd_url: String,
}

#[derive(Serialize)]
struct DecryptMemoResponse {
    success: bool,
    memo: Option<String>,
    amount: Option<i64>,
    txid: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

#[derive(Deserialize)]
struct ScanTransactionsRequest {
    ufvk: String,
    start_height: u64,
    end_height: u64,
    #[serde(default = "default_lightwalletd_url")]
    lightwalletd_url: String,
}

#[derive(Serialize)]
struct ScanTransactionsResponse {
    success: bool,
    transactions: Vec<Transaction>,
    balance: Balance,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

#[derive(Serialize)]
struct Transaction {
    txid: String,
    height: u64,
    amount: i64,
    memo: Option<String>,
    timestamp: Option<i64>,
}

#[derive(Serialize)]
struct Balance {
    confirmed: i64,
    unconfirmed: i64,
    total: i64,
}

fn default_lightwalletd_url() -> String {
    "https://zec.rocks:443".to_string()
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "zingo-decryption-service",
        "version": env!("CARGO_PKG_VERSION")
    }))
}

async fn decrypt_memo_handler(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<DecryptMemoRequest>,
) -> Result<Json<DecryptMemoResponse>, StatusCode> {
    info!("Decrypt memo request for txid: {}", req.txid);

    match decrypt_memo(&req.ufvk, &req.txid, &req.lightwalletd_url).await {
        Ok((memo, amount)) => Ok(Json(DecryptMemoResponse {
            success: true,
            memo: Some(memo),
            amount: Some(amount),
            txid: req.txid,
            error: None,
        })),
        Err(e) => {
            error!("Decryption error: {}", e);
            Ok(Json(DecryptMemoResponse {
                success: false,
                memo: None,
                amount: None,
                txid: req.txid,
                error: Some(e.to_string()),
            }))
        }
    }
}

async fn scan_transactions_handler(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<ScanTransactionsRequest>,
) -> Result<Json<ScanTransactionsResponse>, StatusCode> {
    info!(
        "Scan transactions request from height {} to {}",
        req.start_height, req.end_height
    );

    match scan_transactions(&req.ufvk, req.start_height, req.end_height, &req.lightwalletd_url).await {
        Ok((transactions, balance)) => Ok(Json(ScanTransactionsResponse {
            success: true,
            transactions,
            balance,
            error: None,
        })),
        Err(e) => {
            error!("Scan error: {}", e);
            Ok(Json(ScanTransactionsResponse {
                success: false,
                transactions: vec![],
                balance: Balance {
                    confirmed: 0,
                    unconfirmed: 0,
                    total: 0,
                },
                error: Some(e.to_string()),
            }))
        }
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "zingo_service=info,tower_http=debug".into()),
        )
        .init();

    let state = Arc::new(AppState {});

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any) // In production, restrict to your Vercel domain
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/decrypt-memo", post(decrypt_memo_handler))
        .route("/api/scan-transactions", post(scan_transactions_handler))
        .layer(cors)
        .with_state(state);

    // Start server
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    info!("Starting Zingo decryption service on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
