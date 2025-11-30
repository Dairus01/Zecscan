"use client";

import { useEffect, useState } from "react";
import { RecentBlocks } from "./RecentBlocks";
import { Block } from "@/lib/api";

const API_BASE = "https://api.blockchair.com/zcash";

export function LiveRecentBlocks() {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await fetch(`${API_BASE}/blocks?limit=5&sort=id&direction=desc`);
                if (res.ok) {
                    const data = await res.json();
                    setBlocks(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch blocks:", error);
            }
        };

        // Fetch immediately
        fetchBlocks();

        // Auto-refresh every 15 seconds for real-time updates
        const interval = setInterval(fetchBlocks, 15000);

        return () => clearInterval(interval);
    }, []);

    return <RecentBlocks blocks={blocks} />;
}
