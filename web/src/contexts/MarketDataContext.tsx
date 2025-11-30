"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ZecMarketData {
    price: number;
    marketCap: number;
    change24h: number;
}

interface MarketDataContextType {
    data: ZecMarketData | null;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ZecMarketData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"
                );
                const json = await response.json();

                if (json.zcash) {
                    setData({
                        price: json.zcash.usd,
                        marketCap: json.zcash.usd_market_cap,
                        change24h: json.zcash.usd_24h_change,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch market data from CoinGecko:", error);
            }
        };

        // Fetch immediately
        fetchData();

        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <MarketDataContext.Provider value={{ data }}>
            {children}
        </MarketDataContext.Provider>
    );
}

export function useMarketData() {
    const context = useContext(MarketDataContext);
    if (!context) {
        throw new Error("useMarketData must be used within MarketDataProvider");
    }
    return context;
}
