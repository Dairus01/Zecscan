import { getBlock, getBlockTransactions } from "@/lib/api";
import { Hash, ArrowLeft, Clock, Layers, Database, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ height: string }>;
}

export default async function BlockPage({ params }: PageProps) {
    const { height } = await params;
    const blockHeight = parseInt(height);

    const [block, transactions] = await Promise.all([
        getBlock(blockHeight),
        getBlockTransactions(blockHeight)
    ]);

    if (!block || !block.block) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="bg-surface border border-border rounded-xl p-12 text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Block Not Found</h1>
                    <p className="text-muted">Block #{height} could not be found.</p>
                </div>
            </div>
        );
    }

    const blockData = block.block;
    const blockTime = new Date(blockData.time);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {/* Block Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-warning" />
                </div>
                <div>
                    <div className="text-sm text-muted font-medium">Block</div>
                    <h1 className="text-3xl font-bold text-foreground">#{blockHeight.toLocaleString()}</h1>
                </div>
            </div>

            {/* Block Details Grid */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Block Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Height</div>
                        <div className="text-foreground font-mono text-lg">{blockData.id.toLocaleString()}</div>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Timestamp</div>
                        <div className="text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted" />
                            <span>{blockTime.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Block Hash</div>
                        <div className="text-warning font-mono text-sm break-all bg-background rounded-lg p-3 border border-border">
                            {blockData.hash}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Transactions</div>
                        <div className="text-primary font-bold text-2xl">{blockData.transaction_count}</div>
                    </div>

                    {blockData.size && (
                        <div>
                            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Block Size</div>
                            <div className="text-foreground font-mono">{(blockData.size / 1024).toFixed(2)} KB</div>
                        </div>
                    )}

                    {blockData.difficulty && (
                        <div>
                            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Difficulty</div>
                            <div className="text-foreground font-mono">{blockData.difficulty.toLocaleString()}</div>
                        </div>
                    )}

                    {blockData.version && (
                        <div>
                            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Version</div>
                            <div className="text-foreground font-mono">{blockData.version}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Transactions
                        <span className="text-sm font-normal text-muted">({transactions.length})</span>
                    </h2>
                </div>

                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-background border-b border-border">
                                <tr>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">#</th>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Type</th>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Hash</th>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Ins</th>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Outs</th>
                                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Size</th>
                                    <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Amount (ZEC)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {transactions.map((tx: any, index: number) => {
                                    const isShielded = tx.input_count === 0 || tx.output_count === 0;
                                    const typeLabel = isShielded ? "Shielded" : "Regular";
                                    const typeColor = isShielded ? "text-secondary" : "text-muted";

                                    return (
                                        <tr key={tx.hash} className="hover:bg-surface-hover transition-colors">
                                            <td className="px-6 py-4 text-sm text-muted font-mono">#{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold ${typeColor} uppercase`}>
                                                    {typeLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/tx/${tx.hash}`}
                                                    className="text-primary hover:text-primary/80 font-mono text-sm flex items-center gap-1 group"
                                                >
                                                    <span className="truncate max-w-[200px]">{tx.hash}</span>
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground font-mono">{tx.input_count}</td>
                                            <td className="px-6 py-4 text-sm text-foreground font-mono">{tx.output_count}</td>
                                            <td className="px-6 py-4 text-sm text-muted font-mono">
                                                {(tx.size / 1024).toFixed(1)} KB
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground font-mono text-right font-bold">
                                                {(tx.output_total / 100000000).toFixed(4)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted">No transactions found in this block.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
