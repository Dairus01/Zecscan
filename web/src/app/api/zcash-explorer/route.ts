import { NextRequest, NextResponse } from 'next/server';

// Use Edge runtime for better performance and minimal logging
export const runtime = 'edge';

// POST method keeps txid in body = NOT visible in server logs!
export async function POST(request: NextRequest) {
    try {
        const { txid } = await request.json();

        if (!txid || !/^[a-fA-F0-9]{64}$/.test(txid)) {
            return NextResponse.json(
                { error: 'Invalid transaction ID' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://mainnet.zcashexplorer.app/transactions/${txid}/raw`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        // Minimal error info - don't leak any transaction details
        return NextResponse.json(
            { error: 'Failed to fetch transaction data' },
            { status: 500 }
        );
    }
}
