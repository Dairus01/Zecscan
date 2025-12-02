use anyhow::{anyhow, Result};
use crate::{Transaction, Balance};
use zingolib::{
    config::ZingoConfig,
    wallet::LightWallet,
};

/// Scan blockchain for transactions belonging to a viewing key
pub async fn scan_transactions(
    ufvk: &str,
    start_height: u64,
    end_height: u64,
    lightwalletd_url: &str,
) -> Result<(Vec<Transaction>, Balance)> {
    // Create Zingo configuration
    let config = ZingoConfig::create_unconnected(
        zingolib::config::ChainType::Mainnet,
        Some(lightwalletd_url.to_string()),
    );

    // Create wallet from viewing key with birthday at start_height
    let wallet = LightWallet::new(config, ufvk, start_height)
        .map_err(|e| anyhow!("Failed to create wallet from UFVK: {}", e))?;

    // Sync wallet from start to end height
    wallet.do_sync(true)
        .await
        .map_err(|e| anyhow!("Failed to sync wallet: {}", e))?;

    // Get all transactions
    let txns = wallet.transactions();
    let mut transactions = Vec::new();
    let mut total_balance: i64 = 0;

    for tx in txns.read().await.iter() {
        // Filter transactions within specified height range
        if let Some(height) = tx.block_height {
            if height >= start_height && height <= end_height {
                transactions.push(Transaction {
                    txid: tx.txid.to_string(),
                    height,
                    amount: tx.value as i64,
                    memo: tx.memo.clone(),
                    timestamp: tx.datetime.map(|dt| dt.timestamp()),
                });
                
                total_balance += tx.value as i64;
            }
        }
    }

    let balance = Balance {
        confirmed: total_balance,
        unconfirmed: 0,
        total: total_balance,
    };

    Ok((transactions, balance))
}
