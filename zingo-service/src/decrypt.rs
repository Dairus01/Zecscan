use anyhow::{anyhow, Result};
use zingolib::{
    config::ZingoConfig,
    wallet::LightWallet,
};
use std::sync::Arc;

/// Decrypt a memo from a specific transaction using zingolib
pub async fn decrypt_memo(
    ufvk: &str,
    txid: &str,
    lightwalletd_url: &str,
) -> Result<(String, i64)> {
    // Create Zingo configuration
    let config = ZingoConfig::create_unconnected(
        zingolib::config::ChainType::Mainnet,
        Some(lightwalletd_url.to_string()),
    );

    // Create wallet from viewing key
    let wallet = LightWallet::new(config, ufvk, 0)
        .map_err(|e| anyhow!("Failed to create wallet from UFVK: {}", e))?;

    // Sync wallet to get transaction data
    // Note: This may take time depending on wallet age
    wallet.do_sync(true)
        .await
        .map_err(|e| anyhow!("Failed to sync wallet: {}", e))?;

    // Get transaction list and find our txid
    let txns = wallet.transactions();
    
    for tx in txns.read().await.iter() {
        if tx.txid.to_string() == txid {
            // Found the transaction, extract memo and amount
            let memo = tx.memo.clone().unwrap_or_else(|| "No memo".to_string());
            let amount = tx.value as i64;
            
            return Ok((memo, amount));
        }
    }

    Err(anyhow!("Transaction {} not found or not decryptable with provided UFVK", txid))
}
