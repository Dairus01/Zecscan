use anyhow::{anyhow, Result};
use crate::{Transaction, Balance};

/// Scan blockchain for transactions belonging to a viewing key
/// NOTE: Zingolib integration temporarily disabled due to build issues
pub async fn scan_transactions(
    ufvk: &str,
    start_height: u64,
    end_height: u64,
    lightwalletd_url: &str,
) -> Result<(Vec<Transaction>, Balance)> {
    // Zingolib integration coming soon
    Err(anyhow!(
        "Zingo service HTTP server is running! \n\
         Wallet scanning temporarily unavailable due to zingolib dependency conflicts. \n\
         Working to resolve orchard/rand crate version issues. \n\
         \n\
         Requested scan: heights {} to {} \n\
         UFVK: {} \n\
         Lightwalletd: {}",
        start_height, end_height, &ufvk[..20], lightwalletd_url
    ))
}
