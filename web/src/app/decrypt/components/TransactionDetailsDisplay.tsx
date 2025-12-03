"use client";

import { useState } from "react";
import { Copy, CheckCircle, Download, ChevronDown, ChevronUp, Info } from "lucide-react";
import { ZcashExplorerTransaction, ZcashExplorerRawTransaction } from "@/lib/api";

interface TransactionDetailsDisplayProps {
    transaction: ZcashExplorerTransaction;
    rawTransaction: ZcashExplorerRawTransaction | null;
}

export default function TransactionDetailsDisplay({
    transaction,
    rawTransaction,
}: TransactionDetailsDisplayProps) {
    const [showRawData, setShowRawData] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const downloadJSON = () => {
        if (!rawTransaction) return;

        const dataStr = JSON.stringify(rawTransaction, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `transaction_${transaction.hash.substring(0, 8)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const DetailRow = ({ label, value, copiable = false }: { label: string; value: string | number; copiable?: boolean }) => (
        <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-foreground">{value}</span>
                {copiable && (
                    <button
                        onClick={() => copyToClipboard(value.toString(), label)}
                        className="p-1 hover:bg-surface rounded transition-colors"
                    >
                        {copiedField === label ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                            <Copy className="w-4 h-4 text-muted" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" }) => {
        const colors = {
            default: "bg-surface text-foreground",
            success: "bg-success/20 text-success",
            warning: "bg-secondary/20 text-secondary",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[variant]}`}>
                {children}
            </span>
        );
    };

    const isShielded = transaction.shieldedInputs > 0 || transaction.shieldedOutputs > 0;
    const hasOrchard = transaction.orchardActions > 0;
    const hasJoinSplits = transaction.joinsplits > 0;

    return (
        <div className="space-y-4">
            {/* Success Banner */}
            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-success mb-1">Transaction Decrypted Successfully!</h3>
                        <p className="text-sm text-foreground/80">
                            Transaction details retrieved and verified. All shielded data has been decrypted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction Type Badges */}
            <div className="flex flex-wrap gap-2">
                {isShielded && <Badge variant="success">🔒 Shielded Transaction</Badge>}
                {hasOrchard && <Badge variant="success">🌳 Orchard Protocol</Badge>}
                {hasJoinSplits && <Badge variant="warning">🔀 JoinSplit</Badge>}
                {transaction.publicInputs > 0 && <Badge>📤 Transparent Inputs</Badge>}
                <Badge>✓ {transaction.confirmations} Confirmations</Badge>
            </div>

            {/* Main Transaction Details */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-1">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Transaction Summary
                </h3>

                <DetailRow label="Transaction ID" value={transaction.hash.substring(0, 16) + "..." + transaction.hash.substring(48)} copiable />
                <DetailRow label="Confirmations" value={transaction.confirmations} />
                <DetailRow label="Block Height" value={transaction.blockId} />
                <DetailRow label="Timestamp" value={transaction.time} />
                <DetailRow label="Size" value={`${transaction.size} bytes`} />
                <DetailRow label="Version" value={transaction.version} />
                <DetailRow label="Locktime" value={transaction.locktime} />
            </div>

            {/* Input/Output Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-6">
                    <h4 className="font-bold text-foreground mb-3">Inputs</h4>
                    <div className="space-y-2">
                        <DetailRow label="Public Inputs" value={transaction.publicInputs} />
                        <DetailRow label="Shielded Inputs" value={transaction.shieldedInputs} />
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-xl p-6">
                    <h4 className="font-bold text-foreground mb-3">Outputs</h4>
                    <div className="space-y-2">
                        <DetailRow label="Public Outputs" value={transaction.publicOutputs} />
                        <DetailRow label="Shielded Outputs" value={transaction.shieldedOutputs} />
                    </div>
                </div>
            </div>

            {/* Advanced Details */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-3">Advanced Protocol Details</h4>
                <div className="space-y-1">
                    <DetailRow label="JoinSplits" value={transaction.joinsplits} />
                    <DetailRow label="Orchard Actions" value={transaction.orchardActions} />
                    <DetailRow label="Overwintered" value={transaction.overwintered ? "Yes" : "No"} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    {showRawData ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    {showRawData ? "Hide" : "View"} Raw Transaction Data
                </button>

                {rawTransaction && (
                    <button
                        onClick={downloadJSON}
                        className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-background font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Download JSON
                    </button>
                )}
            </div>

            {/* Raw Data Section */}
            {showRawData && rawTransaction && (
                <div className="bg-background border border-primary/30 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-primary">Raw Transaction Data</h4>
                        <button
                            onClick={() => copyToClipboard(JSON.stringify(rawTransaction, null, 2), "raw-json")}
                            className="px-3 py-1.5 bg-surface hover:bg-surface/80 text-foreground rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            {copiedField === "raw-json" ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy JSON
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-surface border border-border rounded-lg p-4 max-h-96 overflow-auto">
                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-all">
                            {JSON.stringify(rawTransaction, null, 2)}
                        </pre>
                    </div>

                    {/* Key Fields Highlight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                            <h5 className="text-sm font-bold text-muted mb-2">Shielded Spends</h5>
                            <p className="text-xs font-mono text-foreground">
                                {rawTransaction.vShieldedSpend?.length || 0} entries
                            </p>
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-muted mb-2">Shielded Outputs</h5>
                            <p className="text-xs font-mono text-foreground">
                                {rawTransaction.vShieldedOutput?.length || 0} entries
                            </p>
                        </div>
                        {rawTransaction.orchardActions && rawTransaction.orchardActions.length > 0 && (
                            <div>
                                <h5 className="text-sm font-bold text-muted mb-2">Orchard Actions</h5>
                                <p className="text-xs font-mono text-foreground">
                                    {rawTransaction.orchardActions.length} actions
                                </p>
                            </div>
                        )}
                        {rawTransaction.vJoinSplit && rawTransaction.vJoinSplit.length > 0 && (
                            <div>
                                <h5 className="text-sm font-bold text-muted mb-2">JoinSplits</h5>
                                <p className="text-xs font-mono text-foreground">
                                    {rawTransaction.vJoinSplit.length} joinsplits
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
