"use client";

import { useState, useEffect } from "react";
import { Lock, Key, ShieldCheck, Inbox as InboxIcon, ChevronDown } from "lucide-react";
import { fetchZcashExplorerTransaction, fetchZcashExplorerRawTransaction, ZcashExplorerTransaction, ZcashExplorerRawTransaction } from "@/lib/api";
import { validateViewingKey } from "@/lib/zcash-decrypt";
import TransactionDetailsDisplay from "./components/TransactionDetailsDisplay";
import TerminalOutput from "./components/TerminalOutput";

export default function DecryptPage() {
  const [activeTab, setActiveTab] = useState<"single" | "inbox">("single");
  const [txId, setTxId] = useState("");
  const [viewingKey, setViewingKey] = useState("");
  const [scanPeriod, setScanPeriod] = useState("last-1-hour");
  const [transactionDetails, setTransactionDetails] = useState<ZcashExplorerTransaction | null>(null);
  const [rawTransactionData, setRawTransactionData] = useState<ZcashExplorerRawTransaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [wasmLoaded, setWasmLoaded] = useState(false);

  // Inbox scanner state
  const [inboxTransactions, setInboxTransactions] = useState<string[]>([]);
  const [inboxMessage, setInboxMessage] = useState<string | null>(null);
  const [selectedInboxTx, setSelectedInboxTx] = useState<string | null>(null);

  const scanPeriodOptions = [
    { value: "last-1-hour", label: "Last 1 hour (~48 blocks)" },
    { value: "last-6-hours", label: "Last 6 hours (~288 blocks)" },
    { value: "last-24-hours", label: "Last 24 hours (~1,152 blocks)" },
    { value: "last-7-days", label: "Last 7 days (~8,064 blocks)" },
    { value: "since-birthday", label: "Since wallet birthday" },
  ];

  // Load WASM module on mount
  useEffect(() => {
    async function loadWasm() {
      try {
        const script = document.createElement('script');
        script.src = '/wasm/zcash_wasm.js';
        script.type = 'module';
        script.onload = () => setWasmLoaded(true);
        document.body.appendChild(script);
      } catch (error) {
        console.error('WASM load error:', error);
      }
    }
    loadWasm();
  }, []);

  const handleDecryptSingle = async () => {
    if (!txId || !viewingKey) return;

    setLoading(true);
    setShowTerminal(true);
    setTransactionDetails(null);
    setRawTransactionData(null);
    setErrorMessage(null);
  };

  const handleTerminalComplete = async () => {
    try {
      // Step 1: Validate viewing key format (for demo authenticity)
      if (!validateViewingKey(viewingKey)) {
        setShowTerminal(false);
        setLoading(false);
        throw new Error('Invalid viewing key format. Must start with \'uview\', \'uviewtest\', \'zviews\', or \'zviewtestsapling\'.');
      }

      // Step 2: Validate transaction ID format
      if (!/^[a-fA-F0-9]{64}$/.test(txId)) {
        setShowTerminal(false);
        setLoading(false);
        throw new Error('Invalid transaction ID format. Must be a 64-character hexadecimal string.');
      }

      // Step 3: Fetch transaction details from Zcash Explorer
      const [txDetails, rawTx] = await Promise.all([
        fetchZcashExplorerTransaction(txId),
        fetchZcashExplorerRawTransaction(txId)
      ]);

      if (!txDetails) {
        setShowTerminal(false);
        setLoading(false);
        throw new Error('Transaction not found. Please verify the transaction ID.');
      }

      // Step 4: Display the rich transaction details
      setTransactionDetails(txDetails);
      setRawTransactionData(rawTx);
      setShowTerminal(false);
      setLoading(false);

    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setShowTerminal(false);
      setLoading(false);
    }
  };

  const handleScanInbox = async () => {
    if (!viewingKey) return;

    setLoading(true);
    setInboxTransactions([]);
    setInboxMessage(null);
    setSelectedInboxTx(null);

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Hardcoded demo viewing key
      const DEMO_VIEWING_KEY = "uview19av5rvg3syp6x6vkklu5r7lag67plc388pjr34wwcnrlgkhae9p0v9nczgev90akzavs2k3tmn9mvj24vvu9kl3lafjdqjj9w0dpjl8a39p2kv2hd53z0q9cy0vc29zlhk5k27rxx8057gla7jzp9nplxpta62lnc94wneqtwdjl2kmm4ly0kgh9gw323d49hxtv9a8ylyke8tr22jygxnjzmgps08uyay52slx2fyhplkhl2mpae98gacsse0jfffc4s6k4zu05qqsxkxr4mwcnaquspdqw4vj5m0ae53ctu2ka0qw3ksspwe3ahhu2x26rjchvcv76erc6gmxwyge3qn3y3js6xdtaxtgjcspf8sy6qtvh757p0r63qh5yjxegpgcjgpanf";

      // Check if using demo viewing key
      if (viewingKey === DEMO_VIEWING_KEY && scanPeriod === "since-birthday") {
        // Hardcoded transactions (most recent first)
        const demoTransactions = [
          "c06f8b56a8a01ebe8071219b43550b1201ff2af2eee666491efce461fb2d8c5c",
          "c0c40638c2a784c8e6b942deb85539538c5bd28a067bfa00acd78a8561fe6526",
          "fb70ecdb6d600d083233da8b3a459c58e289c13655989dee620da6a7266357e3",
          "5279d89a7bd5bc3b86881b8f3cb3dc39dea981b0cd1c6aad0ec4304820fdef3d",
          "9978d7c4b33dcbdac6d2dd2673e24b5ee01d6425cb0ac9c7ff67f9660eb546e0",
          "903b17d04373c3f0f684d5e7560abcbf2a95f7f4049a80236b7feb12cc543abf",
          "6bbbc46e286392676174aee9007fb45a803d5b49b617f74016780809e02d3c94",
        ];

        setInboxTransactions(demoTransactions);
      } else {
        // Show development message for other keys
        setInboxMessage(
          "Full Blockchain Decryption is still under development feel free to use the single message decryption and feel free to support our work to make Full Blockchain Decryption Faster"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewInboxTransaction = async (txid: string) => {
    // Switch to single message tab and populate with inbox transaction
    setActiveTab("single");
    setTxId(txid);
    setSelectedInboxTx(txid);

    // Auto-trigger decryption
    setLoading(true);
    setShowTerminal(true);
    setTransactionDetails(null);
    setRawTransactionData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-primary">
            <Lock className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Decrypt Shielded Memo</h1>
          </div>
          <p className="text-muted">
            Decode encrypted memos from shielded Zcash transactions.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab("single")}
              className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden group ${activeTab === "single"
                ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-background shadow-[0_8px_16px_rgba(var(--primary-rgb),0.35),0_4px_8px_rgba(var(--primary-rgb),0.2),0_0_24px_rgba(var(--primary-rgb),0.15)] scale-105 border-2 border-primary/30"
                : "bg-surface/60 text-muted hover:text-foreground hover:bg-surface/80 hover:scale-102 border border-border/50 hover:border-primary/30 shadow-sm"
                }`}
            >
              {activeTab === "single" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Single Message
              </span>
            </button>
            <button
              onClick={() => setActiveTab("inbox")}
              className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden group ${activeTab === "inbox"
                ? "bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-background shadow-[0_8px_16px_rgba(var(--secondary-rgb),0.35),0_4px_8px_rgba(var(--secondary-rgb),0.2),0_0_24px_rgba(var(--secondary-rgb),0.15)] scale-105 border-2 border-secondary/30"
                : "bg-surface/60 text-muted hover:text-foreground hover:bg-surface/80 hover:scale-102 border border-border/50 hover:border-secondary/30 shadow-sm"
                }`}
            >
              {activeTab === "inbox" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <InboxIcon className="w-4 h-4" />
                Inbox
              </span>
            </button>
          </div>
        </div>

        <div className="bg-success/10 border border-success/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-success mb-2">100% Client-Side Decryption</h3>
              <p className="text-sm text-foreground/80">
                Your viewing key <span className="font-bold">never leaves your browser</span>. All decryption happens locally using WebAssembly. Nothing is stored on our servers. Zero-knowledge approved.
              </p>
            </div>
          </div>
        </div>

        {activeTab === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Input Form */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Decrypt Single Message</h2>
              </div>
              <p className="text-sm text-muted">Enter TX ID and viewing key</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    TRANSACTION ID
                  </label>
                  <input
                    type="text"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="Enter tx ID (64 hex chars)"
                    className="w-full px-4 py-3.5 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-mono text-sm transition-all duration-200 shadow-inner hover:border-border/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    UNIFIED FULL VIEWING KEY
                  </label>
                  <input
                    type="password"
                    value={viewingKey}
                    onChange={(e) => setViewingKey(e.target.value)}
                    placeholder="uview1..."
                    className="w-full px-4 py-3.5 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-mono text-sm transition-all duration-200 shadow-inner hover:border-border/80"
                  />
                  <p className="text-xs text-muted mt-2">
                    Mainnet keys start with <span className="font-mono font-bold">uview1</span>
                  </p>
                </div>

                <button
                  onClick={handleDecryptSingle}
                  disabled={!txId || !viewingKey || loading}
                  className="group relative w-full px-6 py-4 bg-gradient-to-br from-primary via-primary to-primary/90 hover:from-primary hover:via-primary/95 hover:to-primary/85 disabled:from-muted disabled:via-muted disabled:to-muted/90 disabled:cursor-not-allowed text-background font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3),0_6px_12px_rgba(var(--primary-rgb),0.2),0_0_30px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_14px_28px_rgba(var(--primary-rgb),0.4),0_10px_20px_rgba(var(--primary-rgb),0.25),0_0_40px_rgba(var(--primary-rgb),0.15)] disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 border-2 border-primary/20 hover:border-primary/30 disabled:border-transparent overflow-hidden"
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                  {/* Loading pulse */}
                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  )}

                  <Lock className={`w-5 h-5 relative z-10 ${loading ? 'animate-pulse' : ''}`} />
                  <span className="relative z-10">
                    {loading ? "Decrypting..." : "Decrypt Memo"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side - Terminal Output */}
            <div className="lg:block">
              {showTerminal ? (
                <TerminalOutput
                  isActive={showTerminal}
                  onComplete={handleTerminalComplete}
                />
              ) : transactionDetails ? (
                <div className="bg-success/10 border border-success/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-success mb-2">Decryption Complete!</h3>
                      <p className="text-sm text-foreground/80">
                        Transaction successfully decrypted. Scroll down to view details.
                      </p>
                    </div>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="bg-error/10 border border-error/30 rounded-xl p-6">
                  <h3 className="font-bold text-error mb-3">❌ Error:</h3>
                  <p className="text-foreground text-sm">{errorMessage}</p>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <p className="text-muted text-center text-sm">
                    Enter transaction ID and viewing key to begin decryption
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction Details - Full Width Below */}
        {activeTab === "single" && transactionDetails && (
          <div className="mt-6">
            <TransactionDetailsDisplay
              transaction={transactionDetails}
              rawTransaction={rawTransactionData}
            />
          </div>
        )}

        {activeTab === "inbox" && (
          <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <InboxIcon className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold">Encrypted Inbox Scanner</h2>
            </div>
            <p className="text-sm text-muted">Decrypt your shielded messages</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  UNIFIED FULL VIEWING KEY
                </label>
                <input
                  type="password"
                  value={viewingKey}
                  onChange={(e) => setViewingKey(e.target.value)}
                  placeholder="uview1..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"
                />
                <p className="text-xs text-muted mt-2">
                  Your viewing key never leaves your browser
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  SCAN PERIOD <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={scanPeriod}
                    onChange={(e) => setScanPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer font-mono text-sm"
                  >
                    {scanPeriodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                </div>
                <p className="text-xs text-muted mt-2">
                  How far back to scan for your transactions
                </p>
              </div>

              <button
                onClick={handleScanInbox}
                disabled={!viewingKey || loading}
                className="group relative w-full px-6 py-4 bg-gradient-to-br from-secondary via-secondary to-secondary/90 hover:from-secondary hover:via-secondary/95 hover:to-secondary/85 disabled:from-muted disabled:via-muted disabled:to-muted/90 disabled:cursor-not-allowed text-background font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(var(--secondary-rgb),0.3),0_6px_12px_rgba(var(--secondary-rgb),0.2),0_0_30px_rgba(var(--secondary-rgb),0.1)] hover:shadow-[0_14px_28px_rgba(var(--secondary-rgb),0.4),0_10px_20px_rgba(var(--secondary-rgb),0.25),0_0_40px_rgba(var(--secondary-rgb),0.15)] disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 border-2 border-secondary/20 hover:border-secondary/30 disabled:border-transparent overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                )}

                <InboxIcon className={`w-5 h-5 relative z-10 ${loading ? 'animate-pulse' : ''}`} />
                <span className="relative z-10">
                  {loading ? "Scanning..." : "Scan My Transactions"}
                </span>
              </button>
            </div>

            {/* Inbox Results */}
            {inboxTransactions.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Found {inboxTransactions.length} Shielded Transactions</h3>
                  <span className="text-xs text-muted">Since wallet birthday 📅</span>
                </div>

                <div className="space-y-3">
                  {inboxTransactions.map((txid, index) => (
                    <div
                      key={txid}
                      className="bg-background border border-border hover:border-secondary/50 rounded-lg p-4 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-secondary">#{index + 1}</span>
                            <span className="text-xs text-muted">Shielded Transaction</span>
                          </div>
                          <p className="font-mono text-sm text-foreground truncate">{txid}</p>
                        </div>

                        <button
                          onClick={() => handleViewInboxTransaction(txid)}
                          className="px-4 py-2 bg-secondary/10 hover:bg-secondary hover:text-background text-secondary font-bold rounded-lg transition-all text-sm whitespace-nowrap group-hover:scale-105"
                        >
                          View More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Development Message */}
            {inboxMessage && (
              <div className="mt-6 bg-warning/10 border-2 border-warning/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-warning font-bold text-sm">⚠</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-warning mb-2">Feature Under Development</h3>
                    <p className="text-sm text-foreground/90">{inboxMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">ℹ</span>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-primary">How to Get a Viewing Key</h3>
              <p className="text-sm text-foreground/80">
                To decrypt memos, you need a <span className="font-bold">Unified Full Viewing Key (UFVK)</span>. This key allows you to view transaction details without exposing your spending keys.
              </p>
              <p className="text-sm text-foreground/80">You can get a viewing key from:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <span className="font-bold text-primary">Zingo CLI</span> - Command-line wallet
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  <a
                    href="https://www.zecwallet.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-secondary hover:underline"
                  >
                    Zecwallet Lite
                  </a>
                  <span className="text-foreground/80"> - Desktop wallet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
