"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subValue?: string;
    description: string;
    icon: LucideIcon;
}

export function MetricCard({ label, value, subValue, description, icon: Icon }: MetricCardProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-secondary/50 transition-colors group">
            <div className="flex items-center gap-2 text-muted text-sm font-bold uppercase tracking-wider">
                <Icon className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                {label}
            </div>
            <div className="text-3xl font-bold text-foreground">
                {value} {subValue && <span className="text-sm text-success font-normal ml-1">{subValue}</span>}
            </div>
            <p className="text-xs text-muted">{description}</p>
        </div>
    );
}
