import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    try {
        const res = await fetch(
            `https://api.blockchair.com/zcash/blocks?limit=${limit}&offset=${offset}&sort=id&direction=desc`
        );
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch blocks" }, { status: res.status });
        }
        const data = await res.json();

        // Transform to match documentation
        return NextResponse.json({
            blocks: data.data,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: data.context.total_rows,
                hasMore: parseInt(offset) + parseInt(limit) < data.context.total_rows
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
