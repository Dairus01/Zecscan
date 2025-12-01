import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { txid: string } }
) {
    const txid = params.txid;
    try {
        const res = await fetch(`https://api.blockchair.com/zcash/dashboards/transaction/${txid}`);
        if (!res.ok) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }
        const data = await res.json();
        // Blockchair returns data in data[txid]
        const txData = data.data[txid];
        return NextResponse.json(txData);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
