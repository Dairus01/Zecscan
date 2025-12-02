/**
 * Zcash WebAssembly Decryption Module
 * Provides client-side memo decryption using WebAssembly
 */

let wasmModule: any = null;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the Zcash WebAssembly module
 * NOTE: Currently using server-side Zingo service instead of client-side WASM
 */
export async function initWasm(): Promise<void> {
    if (wasmModule) return;

    if (initPromise) {
        await initPromise;
        return;
    }

    initPromise = (async () => {
        try {
            // WASM import disabled - using server-side Zingo service instead
            // Uncomment when client-side WASM is ready for production
            // const wasm = await import('../../public/wasm/zcash_wasm');
            // await wasm.default(); // Initialize
            // wasm.init_panic_hook(); // Set up panic hook for better errors
            // wasmModule = wasm;
            // console.log('✅ Zcash WASM initialized:', wasmModule.greet());

            console.log('ℹ️ WASM module disabled - using server-side Zingo service');
            wasmModule = null; // Explicitly null to indicate server-side mode
        } catch (error) {
            console.error('❌ Failed to initialize Zcash WASM:', error);
            throw new Error('Failed to load decryption module');
        }
    })();

    await initPromise;
}

export interface DecryptResult {
    success: boolean;
    memo: string;
    error?: string;
}

/**
 * Decrypt a memo from a shielded Zcash transaction
 * @param viewingKey - Unified Full Viewing Key (UFVK)
 * @param txHex - Raw transaction in hexadecimal format
 * @returns Decryption result
 */
export async function decryptMemo(
    viewingKey: string,
    txHex: string
): Promise<DecryptResult> {
    await initWasm();

    if (!wasmModule) {
        return {
            success: false,
            memo: '',
            error: 'WebAssembly module not initialized',
        };
    }

    try {
        const result = wasmModule.decrypt_memo(viewingKey, txHex);
        return {
            success: result.success,
            memo: result.memo,
            error: result.error || undefined,
        };
    } catch (error: any) {
        return {
            success: false,
            memo: '',
            error: error.message || 'Decryption failed',
        };
    }
}

/**
 * Scan blockchain for transactions sent to a viewing key
 * @param viewingKey - Unified Full Viewing Key (UFVK)
 * @param blocksToScan - Number of blocks to scan backwards
 * @returns Scan results as JSON
 */
export async function scanForTransactions(
    viewingKey: string,
    blocksToScan: number
): Promise<any> {
    await initWasm();

    if (!wasmModule) {
        throw new Error('WebAssembly module not initialized');
    }

    try {
        const resultJson = wasmModule.scan_for_transactions(viewingKey, blocksToScan);
        return JSON.parse(resultJson);
    } catch (error: any) {
        throw new Error(`Scan failed: ${error.message}`);
    }
}

/**
 * Fetch raw transaction hex from Blockchair API
 * @param txid - Transaction ID
 * @returns Raw transaction hex
 */
export async function fetchTransactionHex(txid: string): Promise<string> {
    try {
        const response = await fetch(
            `https://api.blockchair.com/zcash/raw/transaction/${txid}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch transaction: ${response.statusText}`);
        }

        const data = await response.json();

        // Blockchair returns the raw hex in data.data[txid].raw_transaction
        if (data?.data?.[txid]?.raw_transaction) {
            return data.data[txid].raw_transaction;
        }

        throw new Error('Transaction hex not found in API response');
    } catch (error: any) {
        throw new Error(`Failed to fetch transaction: ${error.message}`);
    }
}

/**
 * Get block height from scan period selection
 * @param scanPeriod - Selected scan period
 * @param currentHeight - Current blockchain height
 * @returns Number of blocks to scan
 */
export function getBlocksToScan(
    scanPeriod: string,
    currentHeight?: number
): number {
    const blocksPerHour = 48; // ~75 second block time

    switch (scanPeriod) {
        case 'last-1-hour':
            return blocksPerHour;
        case 'last-6-hours':
            return blocksPerHour * 6;
        case 'last-24-hours':
            return blocksPerHour * 24;
        case 'last-7-days':
            return blocksPerHour * 24 * 7;
        case 'since-birthday':
            // This would need to be provided by the user
            // For now, default to 30 days
            return blocksPerHour * 24 * 30;
        default:
            return blocksPerHour;
    }
}
