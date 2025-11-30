"use client";

import { Lock, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/lib/api";

interface ShieldedActivityListProps {
    transactions: Transaction[];
    loading: boolean;
}

export function ShieldedActivityList({ transactions, loading }: ShieldedActivityListProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4 h-full min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-secondary" />
                    Recent Shielded Activity
                </h3>
                <div className="flex items-center gap-2 text-xs text-secondary animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    LIVE
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {loading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 bg-background rounded-lg animate-pulse border border-border/50"></div>
                    ))
                ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <Link
                            href={`/tx/${tx.hash}`}
                            key={tx.hash}
                            className="block group"
                        >
                            <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:border-secondary/50 transition-all hover:bg-secondary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                                        <Lock className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <div className="font-mono text-sm text-foreground group-hover:text-secondary transition-colors">
                                            {tx.hash.substring(0, 16)}...
                                        </div>
                                        <div className="text-xs text-muted flex items-center gap-2 mt-1">
                                            <span>Block #{tx.block_id}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted"></span>
                                            <span>{tx.shielded_value_delta ? `${tx.shielded_value_delta} ZEC` : 'Confidential Value'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-secondary uppercase px-2 py-1 bg-secondary/10 rounded inline-block mb-1">
                                        {tx.shielded_input_raw && tx.shielded_input_raw.length > 0 && tx.shielded_output_raw && tx.shielded_output_raw.length > 0
                                            ? "Fully Shielded"
                                            : "Mixed"}
                                    </div>
                                    <div className="text-xs text-muted">
                                        {new Date(tx.time).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted flex flex-col items-center gap-2">
                        <Shield className="w-8 h-8 text-muted/20" />
                        <p>No recent shielded transactions found</p>
                        <p className="text-xs">Scanning deeper into the blockchain...</p>
                    </div>
                )}
            </div>

            <div className="pt-2 border-t border-border">
                <Link
                    href="/privacy/transactions"
                    className="flex items-center justify-center gap-2 text-sm font-bold text-muted hover:text-secondary transition-colors py-2 w-full hover:bg-secondary/5 rounded-lg"
                >
                    View All Shielded Transactions
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
