import Link from "next/link";
import { ArrowLeft, Hash, Clock, ChevronLeft, ChevronRight, Lock, Shield } from "lucide-react";
import { getRecentTxs } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const TXS_PER_PAGE = 50;

export default async function TransactionsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1");

    // Calculate offset for pagination
    const offset = (currentPage - 1) * TXS_PER_PAGE;

    // Fetch transactions with offset
    const txs = await getRecentTxs(TXS_PER_PAGE, offset);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                            <Hash className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <div className="text-sm text-muted font-medium">Blockchain</div>
                            <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
                    <span className="text-xs text-success font-bold uppercase tracking-wider">🟢 Live</span>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background border-b border-border">
                            <tr>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Type</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Transaction Hash</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Block</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Inputs/Outputs</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Size</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {txs.map((tx: any) => {
                                const txTime = new Date(tx.time);

                                // Classify transaction
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
                                    <tr key={tx.hash} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide inline-flex items-center gap-1",
                                                    isFullyShielded && "bg-secondary/10 text-secondary border-secondary/30",
                                                    isMixed && "bg-warning/10 text-warning border-warning/30",
                                                    isPublic && "bg-muted/10 text-muted border-muted/30"
                                                )}
                                            >
                                                {isFullyShielded && <Lock className="w-3 h-3" />}
                                                {isMixed && <Shield className="w-3 h-3" />}
                                                {isFullyShielded ? "Shielded" : isMixed ? "Mixed" : "Public"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/tx/${tx.hash}`}
                                                className="font-mono text-sm text-primary hover:text-primary/80 truncate max-w-[300px] block"
                                            >
                                                {tx.hash}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/block/${tx.block_id}`}
                                                className="text-warning hover:text-warning/80 font-mono font-bold"
                                            >
                                                #{tx.block_id.toLocaleString()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground font-mono">
                                            {(tx.input_count || 0) + (tx.input_count_approximate || 0)} / {(tx.output_count || 0) + (tx.output_count_approximate || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground font-mono">
                                            {tx.size ? (tx.size / 1024).toFixed(2) + " KB" : "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-foreground">
                                                    <Clock className="w-3 h-3 text-muted" />
                                                    <span className="text-xs font-medium">
                                                        {txTime.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted">
                                                    {txTime.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-between">
                    <div className="text-sm text-muted">
                        Showing transactions {((currentPage - 1) * TXS_PER_PAGE) + 1} - {currentPage * TXS_PER_PAGE}
                    </div>

                    <div className="flex items-center gap-2">
                        {currentPage > 1 ? (
                            <Link
                                href={`/transactions?page=${currentPage - 1}`}
                                className="px-4 py-2 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Link>
                        ) : (
                            <div className="px-4 py-2 rounded-lg border border-border bg-surface text-muted font-medium text-sm cursor-not-allowed flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </div>
                        )}

                        <div className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-mono">
                            Page {currentPage}
                        </div>

                        <Link
                            href={`/transactions?page=${currentPage + 1}`}
                            className="px-4 py-2 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 font-medium text-sm transition-colors flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
