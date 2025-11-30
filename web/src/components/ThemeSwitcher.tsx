"use client";

import { Sun, Cloud, Moon, Sparkles } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const themes = [
    { value: "light" as Theme, icon: Sun, label: "Light", color: "text-amber-500" },
    { value: "dim" as Theme, icon: Cloud, label: "Dim", color: "text-sky-400" },
    { value: "midnight" as Theme, icon: Moon, label: "Midnight", color: "text-indigo-400" },
    { value: "dark" as Theme, icon: Sparkles, label: "Dark", color: "text-cyan-400" },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-white/5">
            {themes.map((t) => {
                const Icon = t.icon;
                return (
                    <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                            "p-2 rounded-md transition-all relative group",
                            theme === t.value
                                ? "bg-primary/10 shadow-lg"
                                : "hover:bg-surface-hover"
                        )}
                        title={t.label}
                    >
                        <Icon
                            className={cn(
                                "w-4 h-4 transition-colors",
                                theme === t.value ? t.color : "text-muted"
                            )}
                        />
                        {theme === t.value && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
