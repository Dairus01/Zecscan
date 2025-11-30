// This is a mock of the Wasm module for environments where Rust compilation is not possible.
// It simulates the behavior of the zcash_client_backend.

export async function greet(): Promise<string> {
    return "Hello from Zcash Wasm (Mock)!";
}

export async function decrypt_memo(viewing_key: string, tx_hex: string): Promise<string> {
    // Simulate async Wasm operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (viewing_key.startsWith("uview") && tx_hex.length > 0) {
        return "Decrypted Memo: Thanks for the ZEC! This is a private transaction.";
    } else {
        throw new Error("Invalid viewing key or transaction data");
    }
}
