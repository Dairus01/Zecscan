/**
 * UFVK Validation Utilities
 */

import { UFVKValidation } from '@/types/zcash';

/**
 * Validates a Unified Full Viewing Key format
 */
export function validateUFVK(ufvk: string): UFVKValidation {
    if (!ufvk || typeof ufvk !== 'string') {
        return {
            isValid: false,
            error: 'Viewing key is required',
        };
    }

    const trimmed = ufvk.trim();

    // Check mainnet UFVK format (starts with uview1)
    if (trimmed.startsWith('uview1')) {
        // Basic length check (UFVKs are typically 300+ characters)
        if (trimmed.length < 100) {
            return {
                isValid: false,
                error: 'Viewing key appears too short',
            };
        }

        return {
            isValid: true,
            network: 'mainnet',
        };
    }

    // Check testnet UFVK format (starts with uviewtest1)
    else if (trimmed.startsWith('uviewtest1')) {
        if (trimmed.length < 100) {
            return {
                isValid: false,
                error: 'Viewing key appears too short',
            };
        }

        return {
            isValid: true,
            network: 'testnet',
        };
    }

    // Check if it looks like an older Sapling viewing key
    if (trimmed.startsWith('zxviews') || trimmed.startsWith('zxviewtestsapling')) {
        return {
            isValid: false,
            error: 'This appears to be a Sapling viewing key. Please use a Unified Full Viewing Key (starts with uview1)',
        };
    }

    return {
        isValid: false,
        error: 'Invalid viewing key format. Mainnet UFVKs start with "uview1", testnet with "uviewtest1"',
    };
}

/**
 * Formats ZAT (Zatoshi) to ZEC
 */
export function zatToZEC(zat: number): string {
    const zec = zat / 100000000;
    return zec.toFixed(8);
}

/**
 * Formats ZEC display with proper decimal places
 */
export function formatZEC(zat: number): string {
    const zec = zatToZEC(zat);
    // Remove trailing zeros but keep at least 2 decimal places
    return parseFloat(zec).toFixed(Math.max(2, 8 - zec.split('.')[1]?.replace(/0+$/, '').length || 0));
}

/**
 * Truncates a transaction ID for display
 */
export function truncateTxId(txid: string, startChars: number = 8, endChars: number = 8): string {
    if (txid.length <= startChars + endChars + 3) {
        return txid;
    }
    return `${txid.slice(0, startChars)}...${txid.slice(-endChars)}`;
}

/**
 * Decodes a memo field (removes null bytes and non-printable characters)
 */
export function decodeMemo(memoHex: string): string {
    try {
        // Convert hex to bytes
        const bytes = new Uint8Array(memoHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

        // Find the first null byte (memos are null-padded)
        let endIndex = bytes.indexOf(0);
        if (endIndex === -1) endIndex = bytes.length;

        // Decode as UTF-8
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const text = decoder.decode(bytes.slice(0, endIndex));

        // Filter out non-printable characters
        return text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
    } catch (error) {
        console.error('Error decoding memo:', error);
        return '[Failed to decode memo]';
    }
}
