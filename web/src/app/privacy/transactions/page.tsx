"use client";

import { useEffect, useState } from "react";
import { Shield, ArrowLeft, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { scanForShieldedTxs, Transaction } from "@/lib/api";

export default function AllShieldedTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        async function fetchAll() {
            try {
                // Scan deeper for the full list (e.g., 500 batches)
                const txs = await scanForShieldedTxs(500, 500);
                setTransactions(txs);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const currentTransactions = transactions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/privacy"
                    className="p-2 hover:bg-surface rounded-lg transition-colors text-muted hover:text-foreground"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-secondary" />
                        Shielded Transactions
                    </h1>
                    <p className="text-sm text-muted">
                        Deep scan results of recent shielded activity
                    </p>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface-hover text-muted uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Transaction Hash</th>
                                <th className="px-6 py-4">Block</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(10)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-background rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-background rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-background rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-background rounded w-20"></div></td>
                                    </tr>
                                ))
                            ) : currentTransactions.length > 0 ? (
                                currentTransactions.map((tx) => (
                                    <tr key={tx.hash} className="hover:bg-background transition-colors group">
                                        <td className="px-6 py-4 font-mono text-primary group-hover:underline">
                                            <Link href={`/tx/${tx.hash}`}>
                                                {tx.hash.substring(0, 20)}...
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            <Link href={`/block/${tx.block_id}`} className="hover:text-foreground">
                                                #{tx.block_id}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            {new Date(tx.time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${tx.shielded_input_raw && tx.shielded_input_raw.length > 0 && tx.shielded_output_raw && tx.shielded_output_raw.length > 0
                                                ? "bg-secondary/10 text-secondary"
                                                : "bg-primary/10 text-primary"
                                                }`}>
                                                <Lock className="w-3 h-3" />
                                                {tx.shielded_input_raw && tx.shielded_input_raw.length > 0 && tx.shielded_output_raw && tx.shielded_output_raw.length > 0
                                                    ? "Fully Shielded"
                                                    : "Mixed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted">
                                        No shielded transactions found in recent blocks.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && transactions.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface-hover">
                        <div className="text-sm text-muted">
                            Showing <span className="font-bold">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(page * itemsPerPage, transactions.length)}</span> of <span className="font-bold">{transactions.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-bold px-4">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
