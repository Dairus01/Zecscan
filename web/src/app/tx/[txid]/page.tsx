import { Shield, CheckCircle2, Clock, Coins, ArrowRight, Unlock, Lock, ArrowLeft, Hash, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTransaction } from "@/lib/api";

interface PageProps {
    params: Promise<{ txid: string }>;
}

export default async function TransactionPage({ params }: PageProps) {
    const { txid } = await params;
    const txData = await getTransaction(txid);

    if (!txData || !txData.transaction) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="bg-surface border border-border rounded-xl p-12 text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Transaction Not Found</h1>
                    <p className="text-muted">Transaction could not be found or API error.</p>
                </div>
            </div>
        );
    }

    const tx = txData.transaction;
    const inputs = txData.inputs || [];
    const outputs = txData.outputs || [];
    const txTime = new Date(tx.time);

    // Infer privacy type - check if transaction has shielded components
    const hasShieldedInputs = tx.input_count_approximate > 0;
    const hasShieldedOutputs = tx.output_count_approximate > 0;
    const isFullyShielded = hasShieldedInputs && hasShieldedOutputs;
    const isMixed = hasShieldedInputs || hasShieldedOutputs;
    const isPublic = !hasShieldedInputs && !hasShieldedOutputs;

    const type = isFullyShielded ? "FULLY SHIELDED" : isMixed ? "MIXED" : "PUBLIC";
    const typeColor = isFullyShielded ? "secondary" : isMixed ? "warning" : "muted";

    // Only show decrypt for shielded/mixed transactions
    const showDecryptPrompt = !isPublic;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Back button */}
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Hash className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <div className="text-sm text-muted font-medium">Transaction</div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-foreground">Details</h1>
                            <span className={cn(
                                "px-3 py-1 rounded-lg text-xs font-bold border",
                                typeColor === "secondary" && "bg-secondary/10 text-secondary border-secondary/20",
                                typeColor === "warning" && "bg-warning/10 text-warning border-warning/20",
                                typeColor === "muted" && "bg-muted/10 text-muted border-muted/20"
                            )}>
                                {type}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-foreground">
                        <strong>Status:</strong> {tx.block_id ? "Confirmed" : "Pending"}
                    </span>
                </div>
            </div>

            {/* Decryption Prompt - Only for shielded/mixed transactions */}
            {showDecryptPrompt && (
                <div className="bg-gradient-to-r from-secondary/10 to-primary/5 border border-secondary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground">Is this your transaction?</h3>
                            <p className="text-sm text-muted">
                                Use your viewing key to decrypt shielded amounts and memos client-side.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/decrypt?txid=${txid}`}
                        className="whitespace-nowrap px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg transition-colors shadow-lg shadow-secondary/20 flex items-center gap-2"
                    >
                        <Unlock className="w-4 h-4" />
                        Decrypt This TX
                    </Link>
                </div>
            )}

            {/* Transaction Details */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Transaction Information</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Transaction Hash</span>
                        <div className="font-mono text-sm break-all text-primary bg-background rounded-lg p-3 border border-border">
                            {tx.hash}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Status</span>
                            <div className="flex items-center gap-2 text-success font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                Success
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Block</span>
                            <Link href={`/block/${tx.block_id}`} className="text-warning hover:text-warning/80 font-bold flex items-center gap-1">
                                #{tx.block_id.toLocaleString()}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Timestamp</span>
                            <div className="flex items-center gap-2 text-foreground">
                                <Clock className="w-4 h-4 text-muted" />
                                <span>{txTime.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Transaction Fee</span>
                            <div className="flex items-center gap-2 text-foreground font-mono">
                                <Coins className="w-4 h-4 text-muted" />
                                <span>{(tx.fee / 100000000).toFixed(8)} ZEC</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Size</span>
                            <div className="text-foreground font-mono">
                                {(tx.size / 1024).toFixed(2)} KB
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Amount</span>
                            <div className="text-foreground font-mono font-bold">
                                {(tx.output_total / 100000000).toFixed(8)} ZEC
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inputs/Outputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <ArrowDownRight className="w-5 h-5 text-error" />
                            Inputs ({inputs.length})
                        </h3>
                    </div>
                    <div className="p-4">
                        {inputs.length > 0 ? (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {inputs.map((input: any, i: number) => (
                                    <div key={i} className="p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted uppercase">Address</span>
                                                <span className="text-xs font-mono text-foreground font-bold">
                                                    {(input.value / 100000000).toFixed(8)} ZEC
                                                </span>
                                            </div>
                                            {input.recipient ? (
                                                <Link
                                                    href={`/address/${input.recipient}`}
                                                    className="font-mono text-sm text-primary hover:text-primary/80 break-all"
                                                >
                                                    {input.recipient}
                                                </Link>
                                            ) : (
                                                <span className="font-mono text-sm text-secondary flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    Shielded Input
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted text-sm">
                                <p>Coinbase transaction</p>
                                <p className="text-xs mt-1">(Block reward - no inputs)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outputs */}
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <ArrowUpRight className="w-5 h-5 text-success" />
                            Outputs ({outputs.length})
                        </h3>
                    </div>
                    <div className="p-4">
                        {outputs.length > 0 ? (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {outputs.map((output: any, i: number) => (
                                    <div key={i} className="p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted uppercase">Address</span>
                                                <span className="text-xs font-mono text-foreground font-bold">
                                                    {(output.value / 100000000).toFixed(8)} ZEC
                                                </span>
                                            </div>
                                            {output.recipient ? (
                                                <Link
                                                    href={`/address/${output.recipient}`}
                                                    className="font-mono text-sm text-primary hover:text-primary/80 break-all"
                                                >
                                                    {output.recipient}
                                                </Link>
                                            ) : (
                                                <span className="font-mono text-sm text-secondary flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    Shielded Output
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted text-sm">
                                No outputs found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
