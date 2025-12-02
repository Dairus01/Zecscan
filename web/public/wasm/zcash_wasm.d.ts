declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	
	export function decrypt_memo(viewing_key: string, tx_hex: string): string;
	
	export function init_panic_hook(): void;
	
	export function scan_transactions(viewing_key: string, tx_hexes_json: string): string;
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly decrypt_memo: (a: number, b: number, c: number, d: number) => [number, number];
  readonly init_panic_hook: () => void;
  readonly scan_transactions: (a: number, b: number, c: number, d: number) => [number, number];
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
