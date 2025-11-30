import { ArrowLeft, User, ArrowUpRight, ArrowDownLeft, ExternalLink, Shield, Check, Lock } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { getZcashAddressDetails } from "@/lib/zcash-explorer";

interface PageProps {
    params: Promise<{ address: string }>;
}

export default async function AddressPage({ params }: PageProps) {
    const { address } = await params;
    const isShielded = address.startsWith("zs") || address.startsWith("u1");

    // Only fetch details if NOT shielded to avoid unnecessary API calls or errors
    const details = isShielded ? null : await getZcashAddressDetails(address);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="flex items-center gap-3">
                {isShielded ? (
                    <Shield className="w-8 h-8 text-secondary" />
                ) : (
                    <User className="w-8 h-8 text-primary" />
                )}
                <h1 className="text-3xl font-bold text-foreground">Address</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* QR Code and Address */}
                <div className="md:col-span-1 bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-white p-2 rounded-lg">
                        <QRCodeSVG value={address} size={150} />
                    </div>
                    <div className="w-full">
                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1 text-center">Address</div>
                        <div className="text-foreground font-mono text-sm break-all text-center bg-muted/10 p-2 rounded border border-border">
                            {address}
                        </div>
                    </div>
                </div>

                {/* Stats or Shielded Info */}
                {isShielded ? (
                    <div className="md:col-span-2 bg-surface border border-border rounded-xl p-8 flex flex-col justify-center space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-secondary" />
                                Shielded Address Detected
                            </h2>
                            <p className="text-muted">
                                This is a shielded address. Balance and transaction history are private by design.
                            </p>
                        </div>

                        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                            <p className="text-sm text-foreground mb-4">
                                Zcash shielded addresses use zero-knowledge proofs to encrypt transaction data on the blockchain.
                                This means that while transactions are verified, the sender, receiver, and amount remain private.
                            </p>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">Privacy Features:</h3>
                                <ul className="space-y-1">
                                    {[
                                        "Balance is encrypted",
                                        "Transaction amounts are hidden",
                                        "Sender and receiver are private",
                                        "Optional encrypted memos"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-muted">
                                            <Check className="w-4 h-4 text-secondary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="text-sm text-muted">
                            To view transactions sent to this address, you'll need to use the <Link href="/decrypt" className="text-primary hover:underline">Decryption Tool</Link> with your viewing key.
                        </p>
                    </div>
                ) : (
                    <div className="md:col-span-2 bg-surface border border-border rounded-xl p-6">
                        <h2 className="text-lg font-bold text-foreground mb-6">Details</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-border pb-4">
                                <span className="text-muted">Balance</span>
                                <span className="text-2xl font-mono font-bold text-primary">{details?.balance}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border pb-4">
                                <span className="text-muted">Total Received</span>
                                <span className="text-lg font-mono text-success">{details?.totalReceived}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted">Total Spent</span>
                                <span className="text-lg font-mono text-foreground">{details?.totalSpent}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transactions - Only show for transparent addresses */}
            {!isShielded && details && (
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-bold text-foreground">Transactions</h2>
                    </div>

                    {details.transactions.length > 0 ? (
                        <div className="divide-y divide-border">
                            {details.transactions.map((tx) => (
                                <div key={tx.txId} className="p-4 hover:bg-surface-hover transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${tx.type === 'Received' ? 'bg-success/10 text-success' : 'bg-muted/10 text-foreground'}`}>
                                            {tx.type === 'Received' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground flex items-center gap-2">
                                                {tx.type}
                                                <span className="text-xs font-normal text-muted bg-muted/10 px-2 py-0.5 rounded">
                                                    {tx.amount}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted font-mono mt-1 truncate max-w-[200px] sm:max-w-md">
                                                {tx.txId}
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://mainnet.zcashexplorer.app/transactions/${tx.txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                                    >
                                        View transaction
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-muted">
                            No transactions found or unable to fetch transaction history.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
