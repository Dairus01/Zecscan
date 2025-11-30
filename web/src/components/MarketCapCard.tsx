"use client";

import { Lock } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useMarketData } from "@/contexts/MarketDataContext";

export function MarketCapCard() {
    const { data } = useMarketData();

    const marketCapInBillions = data
        ? (data.marketCap / 1000000000).toFixed(2)
        : "---";

    const priceFormatted = data
        ? data.price.toFixed(2)
        : "---";

    return (
        <StatsCard
            label="MARKET CAP"
            value={`$${marketCapInBillions}B`}
            subValue={`$${priceFormatted}`}
            icon={Lock}
            color="warning"
        />
    );
}
