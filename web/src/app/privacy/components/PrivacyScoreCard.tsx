"use client";

import { Shield, Info } from "lucide-react";

interface PrivacyScoreCardProps {
    score: number | null;
    loading: boolean;
}

export function PrivacyScoreCard({ score, loading }: PrivacyScoreCardProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-lg shadow-secondary/5 relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    Privacy Score
                    <Info className="w-4 h-4 text-muted cursor-help" />
                </h2>
                <div className="text-7xl font-bold text-secondary tracking-tighter">
                    {loading ? "..." : score}
                    <span className="text-3xl text-muted font-normal">/100</span>
                </div>
            </div>

            <div className="w-full max-w-md space-y-3">
                <div className="h-4 w-full bg-background rounded-full overflow-hidden border border-border">
                    <div
                        className="h-full bg-secondary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: `${score || 0}%` }}
                    ></div>
                </div>
                <p className="text-xs text-muted">
                    Based on shielded transaction volume and pool activity (24h)
                </p>
            </div>
        </div>
    );
}
