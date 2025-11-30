import Link from "next/link";
import { Shield, Lock, Unlock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/api";

export function RecentTxs({ txs }: { txs: Transaction[] }) {
    // Filter for shielded transactions
    const shieldedTxs = txs.filter((tx: any) => {
        const hasShieldedInputs = (tx.input_count_approximate || 0) > 0;
        const hasShieldedOutputs = (tx.output_count_approximate || 0) > 0;
        return hasShieldedInputs || hasShieldedOutputs;
    });

    // If no shielded transactions, show all recent transactions with classification
    const displayTxs = shieldedTxs.length > 0 ? shieldedTxs : txs.slice(0, 5);

    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-secondary/30 transition-colors">
            <div className="p-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-surface to-surface-hover">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Shield className="w-5 h-5 text-secondary" />
                    Recent_Transactions
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/50" />
                    <span className="text-xs text-secondary font-bold uppercase tracking-wider">🟢 Live</span>
                </div>
            </div>
            <div className="divide-y divide-border">
                {displayTxs.length > 0 ? (
                    displayTxs.map((tx: any) => {
                        // Classify each transaction
                        const hasShieldedInputs = (tx.input_count_approximate || 0) > 0;
                        const hasShieldedOutputs = (tx.output_count_approximate || 0) > 0;
                        const hasTransparentInputs = (tx.input_count || 0) > 0;
                        const hasTransparentOutputs = (tx.output_count || 0) > 0;

                        let isFullyShielded = false;
                        let isMixed = false;
                        let isPublic = false;

                        if (hasShieldedInputs && hasShieldedOutputs && !hasTransparentInputs && !hasTransparentOutputs) {
                            isFullyShielded = true;
                        } else if (hasShieldedInputs || hasShieldedOutputs) {
                            isMixed = true;
                        } else {
                            isPublic = true;
                        }

                        return (
                            <div
                                key={tx.hash}
                                className="p-4 hover:bg-secondary/5 transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        {isFullyShielded ? (
                                            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                                                <Lock className="w-4 h-4 text-secondary" />
                                            </div>
                                        ) : isMixed ? (
                                            <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                                                <Unlock className="w-4 h-4 text-warning" />
                                            </div>
                                        ) : (
                                            <div className="p-2 rounded-lg bg-muted/10 border border-muted/20">
                                                <Shield className="w-4 h-4 text-muted" />
                                            </div>
                                        )}
                                        <Link
                                            href={`/tx/${tx.hash}`}
                                            className="text-foreground font-mono font-medium hover:text-primary transition-colors truncate max-w-[200px] text-sm group-hover:text-primary"
                                        >
                                            {tx.hash.slice(0, 16)}...
                                        </Link>
                                        <span
                                            className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide",
                                                isFullyShielded && "bg-secondary/10 text-secondary border-secondary/30",
                                                isMixed && "bg-warning/10 text-warning border-warning/30",
                                                isPublic && "bg-muted/10 text-muted border-muted/30"
                                            )}
                                        >
                                            {isFullyShielded ? "Fully Shielded" : isMixed ? "Mixed" : "Public"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pl-12">
                                        <span className="text-xs text-muted font-medium">Block:</span>
                                        <Link
                                            href={`/block/${tx.block_id}`}
                                            className="text-xs text-warning font-mono font-bold hover:text-warning/80 transition-colors"
                                        >
                                            #{tx.block_id}
                                        </Link>
                                        <span className="text-xs text-muted/50">•</span>
                                        <span className="text-xs text-muted/70">
                                            {(tx.input_count || 0) + (tx.input_count_approximate || 0)} inputs
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5 text-muted">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs font-medium">
                                            {new Date(tx.time).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted/70">
                                        {new Date(tx.time).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center">
                        <Shield className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                        <p className="text-muted">No recent transactions found</p>
                    </div>
                )}
            </div>
            {shieldedTxs.length === 0 && displayTxs.length > 0 && (
                <div className="px-4 py-2 bg-warning/5 border-t border-warning/20 text-center">
                    <p className="text-xs text-warning">
                        <Lock className="w-3 h-3 inline mr-1" />
                        No shielded transactions in recent blocks. Showing recent public transactions.
                    </p>
                </div>
            )}
            <div className="p-4 text-center border-t border-border bg-surface-hover">
                <Link
                    href="/transactions"
                    className="text-xs font-bold text-secondary hover:text-secondary/80 transition-colors uppercase tracking-wider"
                >
                    View All Transactions →
                </Link>
            </div>
        </div>
    );
}
