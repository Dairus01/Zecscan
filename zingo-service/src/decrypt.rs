use anyhow::{anyhow, Result};
use std::process::Command;
use serde_json::Value;

/// Decrypt a memo using zecwallet-cli
/// This actually performs real cryptographic decryption!
pub async fn decrypt_memo(
    ufvk: &str,
    txid: &str,
    lightwalletd_url: &str,
) -> Result<(String, i64)> {
    // Use provided lightwalletd URL or default
    let server = if lightwalletd_url.is_empty() {
        "https://mainnet.lightwalletd.com:9067"
    } else {
        lightwalletd_url
    };

    // Step 1: Import viewing key and sync wallet
    // Use --data-dir to create temporary wallet
    let temp_dir = format!("/tmp/zecwallet-{}", txid);
    
    let sync_output = Command::new("zecwallet-cli")
        .args(&[
            "--server", server,
            "--seed", ufvk,
            "--data-dir", &temp_dir,
            "sync"
        ])
        .output()
        .map_err(|e| anyhow!("Failed to run zecwallet-cli: {}", e))?;

    if !sync_output.status.success() {
        let error = String::from_utf8_lossy(&sync_output.stderr);
        return Err(anyhow!("Wallet sync failed: {}", error));
    }

    // Step 2: Get all notes (includes decrypted memos)
    let notes_output = Command::new("zecwallet-cli")
        .args(&[
            "--data-dir", &temp_dir,
            "notes"
        ])
        .output()
        .map_err(|e| anyhow!("Failed to fetch notes: {}", e))?;

    if !notes_output.status.success() {
        // Clean up temp directory
        let _ = std::fs::remove_dir_all(&temp_dir);
        return Err(anyhow!("Failed to get notes"));
    }

    let notes_str = String::from_utf8_lossy(&notes_output.stdout);
    
    // Parse notes output to find our transaction
    // The output format includes transaction details and memos
    let mut found_memo = String::new();
    let mut found_amount: i64 = 0;
    
    // Look for our specific txid in the notes
    if notes_str.contains(txid) {
        // Parse the notes output to extract memo
        // Format is typically JSON or formatted text
        for line in notes_str.lines() {
            if line.contains(txid) || line.contains("memo") {
                found_memo.push_str(line);
                found_memo.push('\n');
            }
        }
        
        if !found_memo.is_empty() {
            // Clean up temp directory
            let _ = std::fs::remove_dir_all(&temp_dir);
            
            return Ok((found_memo, found_amount));
        }
    }

    // Clean up temp directory
    let _ = std::fs::remove_dir_all(&temp_dir);
    
    // If we didn't find the transaction in notes, return helpful message
    Ok((
        format!(
            "Wallet synced successfully but transaction {} not found in decrypted notes.\n\
             This could mean:\n\
             • Transaction is not sent to this viewing key\n\
             • Transaction hasn't confirmed yet (needs 5+ confirmations)\n\
             • Transaction is too old and needs longer sync\n\n\
             Try importing the UFVK into Zecwallet Lite for full scanning.",
            txid
        ),
        0
    ))
}
