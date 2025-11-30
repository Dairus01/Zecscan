"use client";

import { useEffect, useState } from "react";
import { Droplet, Shield, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMempoolTransactions, Transaction } from "@/lib/api";

interface MempoolStats {
    total: number;
    shielded: number;
    transparent: number;
    privacyScore: number;
}

export default function MempoolPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<MempoolStats>({ total: 0, shielded: 0, transparent: 0, privacyScore: 0 });
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchMempool = async () => {
        try {
            const txs = await getMempoolTransactions();
            setTransactions(txs);

            // Calculate stats
            let shieldedCount = 0;
            let transparentCount = 0;

            txs.forEach((tx: Transaction) => {
                // Use the same logic as getTransactionType
                const hasShieldedInputs = (tx.shielded_input_raw && tx.shielded_input_raw.length > 0);
                const hasShieldedOutputs = (tx.shielded_output_raw && tx.shielded_output_raw.length > 0);
                const isShielded = hasShieldedInputs || hasShieldedOutputs;

                if (isShielded) {
                    shieldedCount++;
                } else {
                    transparentCount++;
                }
            });

            const privacyScore = txs.length > 0 ? Math.round((shieldedCount / txs.length) * 100) : 0;

            setStats({
                total: txs.length,
                shielded: shieldedCount,
                transparent: transparentCount,
                privacyScore
            });
        } catch (error) {
            console.error("Failed to fetch mempool:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMempool();

        if (autoRefresh) {
            const interval = setInterval(fetchMempool, 10000); // Refresh every 10 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const getTransactionType = (tx: Transaction) => {
        const hasShieldedInputs = (tx.shielded_input_raw && tx.shielded_input_raw.length > 0);
        const hasShieldedOutputs = (tx.shielded_output_raw && tx.shielded_output_raw.length > 0);
        const hasTransparentInputs = (tx.input_count && tx.input_count > 0);
        const hasTransparentOutputs = (tx.output_count && tx.output_count > 0);

        const isShielded = hasShieldedInputs || hasShieldedOutputs;
        const isTransparent = hasTransparentInputs || hasTransparentOutputs;

        if (isShielded && isTransparent) return "MIXED";
        if (isShielded) return "SHIELDED";
        return "TRANSPARENT";
    };

    const getFormattedTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-3">
                        <Droplet className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Mempool Viewer</h1>
                            <p className="text-sm text-muted">Live view of pending transactions waiting to be mined</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${autoRefresh
                        ? "bg-[#10b981] text-white shadow-lg hover:bg-[#059669]"
                        : "bg-surface text-muted hover:text-foreground border border-border"
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-white animate-pulse" : "bg-muted"}`} />
                    Auto-refresh {autoRefresh ? "ON" : "OFF"}
                </button>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 text-sm text-success">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>🟢 Live • Updates every 10 seconds</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-xl p-6">
                    <div className="text-sm text-muted font-medium mb-2">Total Transactions</div>
                    <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                    <div className="text-sm text-secondary font-medium mb-2">Shielded</div>
                    <div className="text-3xl font-bold text-secondary">{stats.shielded}</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                    <div className="text-sm text-muted font-medium mb-2">Transparent</div>
                    <div className="text-3xl font-bold text-foreground">{stats.transparent}</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                    <div className="text-sm text-primary font-medium mb-2">Privacy Score</div>
                    <div className="text-3xl font-bold text-primary">{stats.privacyScore}%</div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-bold">Pending Transactions ({stats.total} of {stats.total})</h2>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-muted">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-muted">No transactions found</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-background/50">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Transaction Hash</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Inputs</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Outputs</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {transactions.map((tx, index) => {
                                    const type = getTransactionType(tx);
                                    return (
                                        <tr key={index} className="hover:bg-surface-hover transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {type === "TRANSPARENT" && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-muted/10 text-muted border border-muted/30">
                                                        <Eye className="w-3 h-3" />
                                                        Transparent
                                                    </span>
                                                )}
                                                {type === "SHIELDED" && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-secondary/10 text-secondary border border-secondary/30">
                                                        <Shield className="w-3 h-3" />
                                                        Shielded
                                                    </span>
                                                )}
                                                {type === "MIXED" && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-warning/10 text-warning border border-warning/30">
                                                        <Shield className="w-3 h-3" />
                                                        Mixed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/tx/${tx.hash}`}
                                                    className="text-primary hover:underline font-mono text-sm"
                                                >
                                                    {tx.hash.substring(0, 16)}...{tx.hash.substring(tx.hash.length - 8)}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-foreground">
                                                    <span>{(tx.input_count || 0) + (tx.shielded_input_raw?.length || 0)}</span>
                                                    <Eye className="w-3 h-3 text-muted" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-foreground">
                                                    <span>{(tx.output_count || 0) + (tx.shielded_output_raw?.length || 0)}</span>
                                                    <Eye className="w-3 h-3 text-muted" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground font-mono text-sm">
                                                {tx.size ? `${(tx.size / 1024).toFixed(2)} KB` : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-muted font-mono text-xs">
                                                {getFormattedTime(tx.time)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* About the Mempool */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">About the Mempool</h3>
                <div className="space-y-3 text-sm">
                    <p>
                        <strong className="text-foreground">Mempool</strong> – Memory Pool of unconfirmed transactions waiting to be included in the next block.
                    </p>
                    <p>
                        <strong className="text-secondary">Shielded transactions</strong> use zero-knowledge proofs to hide sender, receiver, and amount.
                    </p>
                    <p>
                        <strong className="text-warning">Mixed transactions</strong> are shielding (transparent → shielded) or deshielding (shielded → transparent).
                    </p>
                    <p>
                        <strong className="text-primary">Privacy Score</strong> = Percentage of transactions using shielded pools (higher = better privacy).
                    </p>
                </div>
            </div>
        </div>
    );
}
