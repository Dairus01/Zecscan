"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { MarketDataProvider } from "@/contexts/MarketDataContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <MarketDataProvider>
                {children}
            </MarketDataProvider>
        </ThemeProvider>
    );
}
