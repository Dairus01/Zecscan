import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Fetch last 100 transactions
        const res = await fetch(
            "https://api.blockchair.com/zcash/transactions?limit=100&sort=id&direction=desc"
        );
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch transactions" }, { status: res.status });
        }
        const data = await res.json();
        const txs = data.data || [];

        let shieldedCount = 0;
        txs.forEach((tx: any) => {
            const hasShieldedInputs = (tx.shielded_input_raw && tx.shielded_input_raw.length > 0);
            const hasShieldedOutputs = (tx.shielded_output_raw && tx.shielded_output_raw.length > 0);
            if (hasShieldedInputs || hasShieldedOutputs) shieldedCount++;
        });

        const privacyScore = txs.length > 0 ? Math.round((shieldedCount / txs.length) * 100) : 0;

        return NextResponse.json({
            metrics: {
                privacyScore: privacyScore,
                shieldedTxCount: shieldedCount,
                transparentTxCount: txs.length - shieldedCount,
                fullyShieldedPercentage: privacyScore
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
