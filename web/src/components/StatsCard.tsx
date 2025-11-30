import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    label: string;
    value: string;
    subValue?: string;
    icon: LucideIcon;
    trend?: string;
    color?: "primary" | "secondary" | "success" | "warning";
}

export function StatsCard({
    label,
    value,
    subValue,
    icon: Icon,
    trend,
    color = "primary",
}: StatsCardProps) {
    const colorClasses = {
        primary: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-secondary/10 text-secondary border-secondary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
    };

    return (
        <div className="bg-surface border border-border rounded-xl p-6 flex items-start justify-between hover:border-primary/30 transition-all group hover:shadow-lg hover:shadow-primary/5">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                    {label}
                </span>
                <div className="flex items-baseline gap-2">
                    <span className={cn("text-3xl font-bold", color === "primary" && "text-primary", color === "secondary" && "text-secondary", color === "success" && "text-success", color === "warning" && "text-warning")}>
                        {value}
                    </span>
                    {subValue && <span className="text-sm text-muted font-medium">{subValue}</span>}
                </div>
                {trend && (
                    <span className="text-xs text-success font-bold flex items-center gap-1">
                        <span className="text-success">↗</span> {trend}
                    </span>
                )}
            </div>
            <div className={cn("p-4 rounded-xl border-2 transition-all group-hover:scale-110", colorClasses[color])}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    );
}
