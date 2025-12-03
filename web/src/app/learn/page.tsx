import Link from "next/link";
import { ArrowLeft, ExternalLink, Lock, Shield, Eye, Code, Users, BookOpen } from "lucide-react";

export default function LearnPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Learn Zcash</h1>
                        <p className="text-lg text-muted mt-1">Privacy-preserving cryptocurrency. Built on zero-knowledge proofs.</p>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                    href="https://forum.zcashcommunity.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all group"
                >
                    <span className="font-bold text-foreground">Join Zcash Forum</span>
                    <ExternalLink className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </a>
                <a
                    href="https://testnet.zecfaucet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                >
                    <span className="font-bold text-foreground">Get Testnet ZEC</span>
                    <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                </a>
                <a
                    href="https://discord.gg/THspb5PM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-warning/50 hover:bg-surface-hover transition-all group"
                >
                    <span className="font-bold text-foreground">Join Discord</span>
                    <ExternalLink className="w-5 h-5 text-muted group-hover:text-warning transition-colors" />
                </a>
            </div>

            {/* Address Types Section */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground border-b border-border pb-4">Address Types</h2>

                {/* Unified Address */}
                <div className="bg-surface border border-primary/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary mb-2">Unified Address (u...)</h3>
                            <p className="text-muted mb-4">
                                Modern standard containing Orchard, Sapling, and Transparent receivers in one address.
                            </p>
                            <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-x-auto">
                                u1a7l33nnr9qnhekptmjacyj95a565tcns09xvyxmt777xnk2q6c6s0jrthgme6dkeevc24zue9yqlmspdla5fw5mjws9...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sapling Address */}
                <div className="bg-surface border border-secondary/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-secondary mb-2">Sapling Address (zs...)</h3>
                            <p className="text-muted mb-4">
                                Legacy shielded address. Fully private with encrypted memos up to 512 bytes.
                            </p>
                            <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-x-auto">
                                zs1a7l33nnr9qnhekptmjacyj95a565tcns09xvyxmt777xnk2q6c6s0jrthgme6dkeevc24zue9yq...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transparent Address */}
                <div className="bg-surface border border-warning/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-center flex-shrink-0">
                            <Eye className="w-5 h-5 text-warning" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-warning mb-2">Transparent Address (t...)</h3>
                            <p className="text-muted mb-4">
                                Public like Bitcoin. Use only for exchanges, then shield immediately.
                            </p>
                            <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm text-foreground overflow-x-auto">
                                t1a7l33nnr9qnhekptmjacyj95a565tcns09
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ZecScan Tools Section */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground border-b border-border pb-4">
                    <span className="flex items-center gap-2">
                        <Code className="w-7 h-7" />
                        ZecScan Tools
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/decrypt"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">Decrypt Shielded Memos</span>
                        <Lock className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">Network Statistics</span>
                        <Shield className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                        href="/privacy"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">Privacy Dashboard</span>
                        <Shield className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                        href="/mempool"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-primary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">Mempool Viewer</span>
                        <Eye className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Community Section */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground border-b border-border pb-4">
                    <span className="flex items-center gap-2">
                        <Users className="w-7 h-7" />
                        Community
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="https://testnet.zecfaucet.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors">Testnet Faucet</span>
                        <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                    </a>
                    <a
                        href="https://forum.zcashcommunity.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors">Community Forum</span>
                        <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                    </a>
                    <a
                        href="https://discord.gg/THspb5PM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors">Developer Discord</span>
                        <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                    </a>
                    <a
                        href="https://www.scifi.money/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors">SciFi Money (Guides)</span>
                        <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                    </a>
                    <a
                        href="https://z.cash/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 bg-surface border border-border rounded-xl hover:border-secondary/50 hover:bg-surface-hover transition-all group"
                    >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors">Z.cash (Official)</span>
                        <ExternalLink className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
                    </a>
                </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-2">Privacy is Normal</h3>
                        <p className="text-muted text-sm">
                            Zcash provides users with the option to shield their transaction data using advanced zero-knowledge cryptography.
                            Shielded transactions protect sender, receiver, and amount information while maintaining a decentralized network
                            secured by zero-knowledge proofs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
