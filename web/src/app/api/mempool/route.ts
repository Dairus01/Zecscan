import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const res = await fetch("https://api.blockchair.com/zcash/mempool/transactions");
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch mempool" }, { status: res.status });
        }
        const data = await res.json();
        const transactions = data.data || [];

        return NextResponse.json({
            count: transactions.length,
            transactions: transactions,
            stats: {
                total: transactions.length,
                shielded: 0, // Placeholder as Blockchair mempool endpoint might not give full details
                transparent: transactions.length
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
