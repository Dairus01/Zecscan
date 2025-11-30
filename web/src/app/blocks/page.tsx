import Link from "next/link";
import { ArrowLeft, Box, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getRecentBlocks } from "@/lib/api";

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const BLOCKS_PER_PAGE = 50;

export default async function BlocksPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1");

    // Calculate offset for pagination
    const offset = (currentPage - 1) * BLOCKS_PER_PAGE;

    // Fetch blocks with offset
    const blocks = await getRecentBlocks(BLOCKS_PER_PAGE, offset);

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
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Box className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm text-muted font-medium">Blockchain</div>
                            <h1 className="text-3xl font-bold text-foreground">All Blocks</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
                    <span className="text-xs text-success font-bold uppercase tracking-wider">🟢 Live</span>
                </div>
            </div>

            {/* Blocks Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background border-b border-border">
                            <tr>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Height</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Hash</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Transactions</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Size</th>
                                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-6 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {blocks.map((block: any) => {
                                const blockTime = new Date(block.time);

                                return (
                                    <tr key={block.id} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/block/${block.id}`}
                                                className="text-warning hover:text-warning/80 font-mono font-bold text-lg"
                                            >
                                                #{block.id.toLocaleString()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm text-primary truncate max-w-[300px]">
                                                {block.hash}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                                {block.transaction_count} TX
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground font-mono">
                                            {block.size ? (block.size / 1024).toFixed(2) + " KB" : "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-foreground">
                                                    <Clock className="w-3 h-3 text-muted" />
                                                    <span className="text-xs font-medium">
                                                        {blockTime.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted">
                                                    {blockTime.toLocaleDateString()}
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
                        Showing blocks {((currentPage - 1) * BLOCKS_PER_PAGE) + 1} - {currentPage * BLOCKS_PER_PAGE}
                    </div>

                    <div className="flex items-center gap-2">
                        {currentPage > 1 ? (
                            <Link
                                href={`/blocks?page=${currentPage - 1}`}
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
                            href={`/blocks?page=${currentPage + 1}`}
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
