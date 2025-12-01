import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { height: string } }
) {
    const height = params.height;
    try {
        const res = await fetch(`https://api.blockchair.com/zcash/dashboards/block/${height}`);
        if (!res.ok) {
            return NextResponse.json({ error: "Block not found" }, { status: 404 });
        }
        const data = await res.json();
        // Blockchair returns data in data[height]
        const blockData = data.data[height];
        return NextResponse.json(blockData);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
