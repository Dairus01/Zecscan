/**
 * Zcash Type Definitions for Shielded Transaction Decryption
 */

export interface ZcashTransaction {
    txid: string;
    height: number;
    timestamp: number;
    amount: number; // in ZAT (1 ZEC = 100,000,000 ZAT)
    memo: string;
    type: 'received' | 'sent';
}

export interface ShieldedBalance {
    confirmed: number; // in ZAT
    unconfirmed: number; // in ZAT
    total: number; // in ZAT
}

export interface WalletSyncProgress {
    currentHeight: number;
    targetHeight: number;
    percentComplete: number;
    status: 'connecting' | 'syncing' | 'complete' | 'error' | 'cancelled';
    message: string;
    transactionsFound: number;
}

export interface LightwalletdConfig {
    url: string;
    network: 'mainnet' | 'testnet';
}

export interface CompactBlock {
    height: number;
    hash: Uint8Array;
    prevHash: Uint8Array;
    time: number;
    vtx: CompactTx[];
}

export interface CompactTx {
    index: number;
    hash: Uint8Array;
    outputs: CompactOutput[];
}

export interface CompactOutput {
    cmu: Uint8Array;
    epk: Uint8Array;
    ciphertext: Uint8Array;
}

export interface DecryptionResult {
    success: boolean;
    amount?: number;
    memo?: string;
    error?: string;
}

export interface UFVKValidation {
    isValid: boolean;
    network?: 'mainnet' | 'testnet';
    error?: string;
}
