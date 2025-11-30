"use client";

import { useEffect, useState } from "react";
import { RecentTxs } from "./RecentTxs";
import { Transaction } from "@/lib/api";

const API_BASE = "https://api.blockchair.com/zcash";

export function LiveRecentTxs() {
    const [txs, setTxs] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTxs = async () => {
            try {
                const res = await fetch(`${API_BASE}/transactions?limit=5&sort=id&direction=desc`);
                if (res.ok) {
                    const data = await res.json();
                    setTxs(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };

        // Fetch immediately
        fetchTxs();

        // Auto-refresh every 15 seconds for real-time updates
        const interval = setInterval(fetchTxs, 15000);

        return () => clearInterval(interval);
    }, []);

    return <RecentTxs txs={txs} />;
}
