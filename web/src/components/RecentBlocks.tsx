import Link from "next/link";
import { Box, Clock } from "lucide-react";
import { Block } from "@/lib/api";

export function RecentBlocks({ blocks }: { blocks: Block[] }) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
            <div className="p-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-surface to-surface-hover">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Box className="w-5 h-5 text-primary" />
                    Recent_Blocks
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
                    <span className="text-xs text-success font-bold uppercase tracking-wider">🟢 Live</span>
                </div>
            </div>
            <div className="divide-y divide-border">
                {blocks.map((block) => (
                    <div
                        key={block.id}
                        className="p-4 hover:bg-primary/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                                    <Box className="w-4 h-4 text-warning" />
                                </div>
                                <Link
                                    href={`/block/${block.id}`}
                                    className="text-warning font-mono font-bold text-lg hover:text-warning/80 transition-colors"
                                >
                                    #{block.id}
                                </Link>
                                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                    {block.transaction_count} TX
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pl-12">
                                <span className="text-xs text-muted font-medium">Hash:</span>
                                <span className="text-xs text-foreground/70 font-mono truncate max-w-[300px] group-hover:text-primary transition-colors">
                                    {block.hash}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-muted">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                    {new Date(block.time).toLocaleTimeString()}
                                </span>
                            </div>
                            <span className="text-xs text-muted/70">
                                {new Date(block.time).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 text-center border-t border-border bg-surface-hover">
                <Link
                    href="/blocks"
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                    View All Blocks →
                </Link>
            </div>
        </div>
    );
}
