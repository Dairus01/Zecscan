import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const res = await fetch("https://api.blockchair.com/zcash/stats");
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch stats" }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data.data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
