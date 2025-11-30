"use client";

import { useEffect, useState } from "react";
import { Shield, Activity, TrendingUp, Lock, Info, Coins } from "lucide-react";
import { getPrivacyScore, scanForShieldedTxs, getNetworkStats, Transaction } from "@/lib/api";
import { PrivacyScoreCard } from "./components/PrivacyScoreCard";
import { ShieldedActivityList } from "./components/ShieldedActivityList";
import { MetricCard } from "./components/MetricCard";

export default function PrivacyPage() {
    const [privacyScore, setPrivacyScore] = useState<number | null>(null);
    const [recentShieldedTxs, setRecentShieldedTxs] = useState<Transaction[]>([]);
    const [poolStats, setPoolStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [score, txs, netStats] = await Promise.all([
                    getPrivacyScore(),
                    scanForShieldedTxs(10, 200),
                    getNetworkStats()
                ]);

                setPrivacyScore(score);
                setRecentShieldedTxs(txs);
                setPoolStats(netStats);

            } catch (error) {
                console.error("Failed to fetch privacy data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-secondary">
                    <Shield className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Zcash Privacy Metrics</h1>
                </div>
                <p className="text-muted max-w-2xl mx-auto">
                    Live privacy statistics for the Zcash blockchain. Track shielded adoption, privacy score, and transparency trends.
                </p>
                <p className="text-xs text-muted">Last updated: {new Date().toLocaleString()}</p>
            </div>

            {/* Top Section: Score & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrivacyScoreCard score={privacyScore} loading={loading} />
                <ShieldedActivityList transactions={recentShieldedTxs} loading={loading} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Market Cap"
                    value={poolStats ? `$${(poolStats.market_cap_usd / 1000000000).toFixed(2)}B` : "..."}
                    subValue={poolStats ? `${poolStats.market_price_usd_change_24h_percentage > 0 ? '+' : ''}${poolStats.market_price_usd_change_24h_percentage}%` : ""}
                    description={`Price: $${poolStats?.market_price_usd}`}
                    icon={TrendingUp}
                />
                <MetricCard
                    label="Hashrate"
                    value={poolStats ? `${(Number(poolStats.hashrate_24h) / 1000000000).toFixed(2)} GH/s` : "..."}
                    subValue="24h Avg"
                    description="Network security"
                    icon={Activity}
                />
                <MetricCard
                    label="Difficulty"
                    value={poolStats ? `${(poolStats.difficulty / 1000000).toFixed(2)}M` : "..."}
                    subValue="Mining"
                    description="Mining difficulty"
                    icon={Lock}
                />
                <MetricCard
                    label="Nodes"
                    value={poolStats ? poolStats.nodes.toLocaleString() : "..."}
                    subValue="Active"
                    description="Network node count"
                    icon={Shield}
                />
                <MetricCard
                    label="Volume (24h)"
                    value={poolStats ? `$${(poolStats.volume_24h / 100000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "..."}
                    subValue="ZEC"
                    description="Total transaction volume"
                    icon={Activity}
                />
                <MetricCard
                    label="Transactions (24h)"
                    value={poolStats ? poolStats.transactions_24h.toLocaleString() : "..."}
                    subValue={`${poolStats ? (poolStats.transactions_24h / 86400).toFixed(2) : "..."} TPS`}
                    description="Daily transaction count"
                    icon={Activity}
                />
                <MetricCard
                    label="Blockchain Size"
                    value={poolStats ? `${(poolStats.blockchain_size / 1000000000).toFixed(2)} GB` : "..."}
                    subValue="Total"
                    description="Size on disk"
                    icon={Shield}
                />
                <MetricCard
                    label="Median Fee"
                    value={poolStats ? `$${poolStats.median_transaction_fee_usd_24h}` : "..."}
                    subValue="USD"
                    description="Cost to transact"
                    icon={Coins}
                />
            </div>

            {/* Transaction Types Progress Bar */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted" />
                        Transaction Types (24h)
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-secondary animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        LIVE
                    </div>
                </div>

                {poolStats && privacyScore !== null ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-secondary font-bold flex items-center gap-2">
                                <Lock className="w-3 h-3" /> Shielded ({Math.round((poolStats.transactions_24h || 6500) * (privacyScore / 100)).toLocaleString()})
                            </span>
                            <span className="text-secondary font-bold">{privacyScore}%</span>
                        </div>
                        <div className="h-3 w-full bg-background rounded-full overflow-hidden flex">
                            <div
                                className="h-full bg-secondary transition-all duration-1000"
                                style={{ width: `${privacyScore}%` }}
                            ></div>
                            <div className="h-full bg-muted/20 flex-1"></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Transparent ({Math.round((poolStats.transactions_24h || 6500) * (1 - privacyScore / 100)).toLocaleString()})
                            </span>
                            <span className="text-muted">{100 - privacyScore}%</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-20 animate-pulse bg-background rounded-lg"></div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Info className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">About Privacy Metrics</h3>
                        <p className="text-sm text-muted leading-relaxed">
                            The Privacy Score is a composite metric calculated based on the ratio of shielded transactions to total network activity.
                            Zcash offers optional privacy, meaning users can choose between transparent (t-addr) and shielded (z-addr) transactions.
                            A higher score indicates a healthier, more private network ecosystem.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div>
                                <h4 className="font-bold text-sm text-secondary mb-1">Shielded Pool</h4>
                                <p className="text-xs text-muted">The total amount of ZEC held in shielded addresses (Sapling + Orchard). A larger pool provides a larger anonymity set.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-secondary mb-1">Adoption Trend</h4>
                                <p className="text-xs text-muted">Compares the last 7 days of shielded activity to the previous 7 days. Growing if +10%, declining if -10%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
