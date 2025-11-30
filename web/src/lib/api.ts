const API_BASE = "https://api.blockchair.com/zcash";

export interface Block {
    id: number;
    hash: string;
    time: string;
    transaction_count: number;
    size?: number;
}

export interface Transaction {
    hash: string;
    time: string;
    block_id: number;
    is_shielded?: boolean;
    fee: number;
    inputs: any[];
    outputs: any[];
    input_count?: number;
    output_count?: number;
    input_count_approximate?: number;
    output_count_approximate?: number;
    size?: number;
    // Shielded fields from Blockchair
    shielded_value_delta?: number;
    join_split_raw?: any[];
    shielded_input_raw?: any[];
    shielded_output_raw?: any[];
}

export async function getNetworkStats() {
    try {
        const res = await fetch(`${API_BASE}/stats`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getPrivacyScore() {
    try {
        // Fetch last 100 transactions to calculate score
        const txs = await getRecentTxs(100);
        if (!txs || txs.length === 0) return 0;

        let shieldedCount = 0;

        txs.forEach((tx: Transaction) => {
            // Only check for actual shielded inputs/outputs
            const hasShieldedInputs = (tx.shielded_input_raw && tx.shielded_input_raw.length > 0);
            const hasShieldedOutputs = (tx.shielded_output_raw && tx.shielded_output_raw.length > 0);
            const isShielded = hasShieldedInputs || hasShieldedOutputs;

            if (isShielded) shieldedCount++;
        });

        // Calculate percentage
        return Math.round((shieldedCount / txs.length) * 100);
    } catch (e) {
        console.error("Error calculating privacy score:", e);
        return 0;
    }
}

export async function getRecentTxs(limit = 5, offset = 0) {
    try {
        const res = await fetch(
            `${API_BASE}/transactions?limit=${limit}&offset=${offset}&sort=id&direction=desc`,
            { next: { revalidate: 15 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getRecentBlocks(limit = 10, offset = 0) {
    try {
        const res = await fetch(
            `${API_BASE}/blocks?limit=${limit}&offset=${offset}&sort=id&direction=desc`,
            { next: { revalidate: 15 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getTransaction(txid: string) {
    try {
        const res = await fetch(`${API_BASE}/dashboards/transaction/${txid}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data[txid];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getBlock(height: number) {
    try {
        const res = await fetch(`${API_BASE}/dashboards/block/${height}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data[height.toString()];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getBlockTransactions(height: number, limit = 100) {
    try {
        const res = await fetch(`${API_BASE}/transactions?q=block_id(${height})&limit=${limit}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function performSearch(query: string): Promise<string | null> {
    const q = query.trim();

    // Block Height (numbers)
    if (/^\d+$/.test(q)) {
        return `/block/${q}`;
    }

    // Transaction Hash (64 hex chars)
    if (/^[a-fA-F0-9]{64}$/.test(q)) {
        return `/tx/${q}`;
    }

    // Address (t-addr, z-addr)
    // Address (t-addr, z-addr)
    if (q.startsWith("t1") || q.startsWith("t3") || q.startsWith("zs") || q.startsWith("u1")) {
        return `/address/${q}`;
    }

    return null;
}

export async function getHistoricalStats(days = 7) {
    try {
        const stats = await getNetworkStats();
        if (!stats) return [];

        const currentHeight = stats.best_block_height;
        const blocksPerDay = 1152; // Approx 75 seconds per block
        const history = [];

        // We process days sequentially to avoid spamming the API with 80+ concurrent requests
        for (let i = 0; i < days; i++) {
            const dayEndHeight = currentHeight - (i * blocksPerDay);
            const dayStartHeight = dayEndHeight - blocksPerDay + 1;

            // 1. Fetch ALL block headers for this day in batches of 100
            // This gives us EXACT Total Txs and EXACT Volume
            const batchPromises = [];
            for (let h = dayStartHeight; h <= dayEndHeight; h += 100) {
                // Ensure we don't exceed the day's end
                const limit = Math.min(100, dayEndHeight - h + 1);
                batchPromises.push(getBlocksRange(h, limit));
            }

            // Wait for all batches for this day
            const batchResults = await Promise.all(batchPromises);
            const allDayBlocks = batchResults.flat();

            if (allDayBlocks.length === 0) continue;

            let totalTxs = 0;
            let totalVolume = 0;

            allDayBlocks.forEach((b: any) => {
                totalTxs += b.transaction_count;
                totalVolume += Math.abs(b.shielded_value_delta_total || 0);
            });

            // 2. Sample for Shielded Count Estimate
            // We still can't fetch tx details for 1152 blocks (would be ~10k requests/day)
            // So we sample 20 blocks (spread out) to estimate the shielded ratio
            const sampleSize = 20;
            const step = Math.floor(allDayBlocks.length / sampleSize);
            const sampleBlocks = [];
            for (let j = 0; j < allDayBlocks.length; j += step) {
                sampleBlocks.push(allDayBlocks[j]);
                if (sampleBlocks.length >= sampleSize) break;
            }

            let sampleTotalTxs = 0;
            let sampleShieldedTxs = 0;

            // Fetch details for sample blocks
            // We can do this in parallel
            const sampleDetailsPromises = sampleBlocks.map(b => getBlock(b.id));
            const sampleDetails = await Promise.all(sampleDetailsPromises);

            for (const blockDetail of sampleDetails) {
                if (!blockDetail) continue;
                const txIds = blockDetail.transactions || [];
                sampleTotalTxs += txIds.length;

                // Check first 10 txs of each sample block
                const txsToCheck = txIds.slice(0, 10);
                const txPromises = txsToCheck.map((txid: string) => getTransaction(txid));
                const txs = await Promise.all(txPromises);

                let blockShieldedCount = 0;
                txs.forEach(tx => {
                    if (!tx) return;
                    // Handle both flat (from getRecentTxs) and nested (from getTransaction) structures
                    const txData = tx.transaction || tx;

                    // Only check for actual shielded inputs/outputs
                    const hasShieldedInputs = (txData.shielded_input_raw && txData.shielded_input_raw.length > 0);
                    const hasShieldedOutputs = (txData.shielded_output_raw && txData.shielded_output_raw.length > 0);
                    const isShielded = hasShieldedInputs || hasShieldedOutputs;

                    if (isShielded) blockShieldedCount++;
                });

                // Extrapolate for this block
                if (txIds.length > 10) {
                    blockShieldedCount = Math.round(blockShieldedCount * (txIds.length / 10));
                }
                sampleShieldedTxs += blockShieldedCount;
            }

            // 3. Calculate Ratio & Final Stats
            const shieldedRatio = sampleTotalTxs > 0 ? (sampleShieldedTxs / sampleTotalTxs) : 0;
            const estimatedShieldedCount = Math.round(totalTxs * shieldedRatio);
            const avgVolume = totalVolume / 100000000; // Total volume for the day in ZEC

            history.push({
                date: new Date(allDayBlocks[0].time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                total: totalTxs, // Exact total for the day
                shielded: estimatedShieldedCount, // Estimated total shielded
                volume: avgVolume, // Exact total volume
                score: Math.round(shieldedRatio * 100)
            });
        }

        return history.reverse();
    } catch (e) {
        console.error("Failed to fetch history", e);
        return [];
    }
}

export async function getBlocksRange(startHeight: number, limit = 100) {
    try {
        const endHeight = startHeight + limit;
        const res = await fetch(`${API_BASE}/blocks?q=id(${startHeight}..${endHeight})&limit=${limit}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function scanForShieldedTxs(limit = 10, maxDepth = 100): Promise<Transaction[]> {
    const shieldedTxs: Transaction[] = [];
    let offset = 0;
    const batchSize = 100;
    const CONCURRENCY = 5; // Fetch 5 batches at a time

    try {
        while (shieldedTxs.length < limit && offset < maxDepth * batchSize) {
            // Create a batch of promises
            const promises = [];
            for (let i = 0; i < CONCURRENCY; i++) {
                const currentOffset = offset + (i * batchSize);
                if (currentOffset >= maxDepth * batchSize) break;
                promises.push(getRecentTxs(batchSize, currentOffset));
            }

            // Wait for all requests in this batch
            const results = await Promise.all(promises);

            // Process results in order
            for (const txs of results) {
                if (!txs || txs.length === 0) continue;

                for (const tx of txs) {
                    // Only check for actual shielded inputs/outputs
                    const hasShieldedInputs = (tx.shielded_input_raw && tx.shielded_input_raw.length > 0);
                    const hasShieldedOutputs = (tx.shielded_output_raw && tx.shielded_output_raw.length > 0);
                    const isShielded = hasShieldedInputs || hasShieldedOutputs;

                    if (isShielded) {
                        // Avoid duplicates if batches overlap or race conditions (though unlikely with strict offsets)
                        if (!shieldedTxs.some(t => t.hash === tx.hash)) {
                            shieldedTxs.push(tx);
                        }
                        if (shieldedTxs.length >= limit) break;
                    }
                }
                if (shieldedTxs.length >= limit) break;
            }

            if (results.every(r => !r || r.length === 0)) break; // Stop if all requests return empty

            offset += batchSize * CONCURRENCY;
        }
    } catch (e) {
        console.error("Error scanning for shielded txs:", e);
    }

    return shieldedTxs;
}

export async function getMempoolTransactions() {
    try {
        // Fetch actual pending transactions from Blockchair's mempool endpoint
        const res = await fetch(
            `${API_BASE}/mempool/transactions`,
            { cache: 'no-store' } // Don't cache to get fresh mempool data
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error('Error fetching mempool transactions:', e);
        return [];
    }
}

