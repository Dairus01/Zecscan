/* tslint:disable */
/* eslint-disable */
export function init_panic_hook(): void;
/**
 * Scan recent blocks for transactions to a viewing key
 */
export function scan_for_transactions(viewing_key: string, blocks_to_scan: number): string;
/**
 * Decrypt a memo from a shielded Zcash transaction
 *
 * This implementation demonstrates the complete decryption workflow.
 * For full production decryption, this would need:
 * 1. Full zcash_primitives library (doesn't compile to WASM easily)
 * 2. Access to Zcash node or light wallet server for blockchain data
 * 3. Implementation of trial decryption algorithms
 *
 * # Arguments
 * * `viewing_key` - Unified Full Viewing Key (mainnet starts with "uview1")
 * * `tx_hex` - Raw transaction in hexadecimal format
 *
 * # Returns
 * JSON string containing DecryptResult
 */
export function decrypt_memo(viewing_key: string, tx_hex: string): string;
export function greet(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly decrypt_memo: (a: number, b: number, c: number, d: number) => [number, number];
  readonly greet: () => [number, number];
  readonly init_panic_hook: () => void;
  readonly scan_for_transactions: (a: number, b: number, c: number) => [number, number];
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
