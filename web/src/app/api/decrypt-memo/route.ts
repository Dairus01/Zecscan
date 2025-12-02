import { NextRequest, NextResponse } from 'next/server';
import { validateUFVK } from '@/lib/zcash-utils';

/**
 * Server-side memo decryption API
 * 
 * WARNING: This sends viewing keys to the server, compromising privacy.
 * Use only for demonstration or testing purposes.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { txId, viewingKey } = body;

        // Validate inputs
        if (!txId || !viewingKey) {
            return NextResponse.json(
                { error: 'Transaction ID and viewing key are required' },
                { status: 400 }
            );
        }

        // Validate UFVK format
        const validation = validateUFVK(viewingKey);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error || 'Invalid viewing key format' },
                { status: 400 }
            );
        }

        // If Zingo service URL is configured, use external service
        const zingoServiceUrl = process.env.ZINGO_SERVICE_URL;

        if (zingoServiceUrl) {
            try {
                const response = await fetch(`${zingoServiceUrl}/api/decrypt-memo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ufvk: viewingKey,
                        txid: txId,
                    }),
                    signal: AbortSignal.timeout(30000), // 30 second timeout
                });

                if (!response.ok) {
                    throw new Error(`Zingo service returned ${response.status}`);
                }

                const zingoData = await response.json();

                return NextResponse.json({
                    success: zingoData.success,
                    txId: zingoData.txid,
                    memo: zingoData.memo,
                    amount: zingoData.amount,
                    viewingKeyNetwork: validation.network,
                    source: 'zingo-service',
                    note: zingoData.error || 'Decrypted via Zingo microservice',
                });
            } catch (serviceError: any) {
                console.error('Zingo service error:', serviceError);
                // Fall through to Blockchair API if Zingo service fails
            }
        }

        // Fallback: Fetch transaction data from Blockchair
        const response = await fetch(
            `https://api.blockchair.com/zcash/raw/transaction/${txId}`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        const data = await response.json();
        const txData = data?.data?.[txId];

        if (!txData) {
            return NextResponse.json(
                { error: 'Could not retrieve transaction data' },
                { status: 404 }
            );
        }

        const result = {
            success: true,
            txId: txId,
            found: true,
            transaction: {
                size: txData.size || 0,
                version: txData.version,
                locktime: txData.lock_time,
                timestamp: txData.time,
            },
            memo: null,
            note: zingoServiceUrl
                ? 'Zingo service unavailable, showing transaction metadata only. Configure ZINGO_SERVICE_URL for decryption.'
                : 'Server-side memo decryption requires Zingo microservice. Set ZINGO_SERVICE_URL environment variable.',
            viewingKeyNetwork: validation.network,
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Decryption API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/decrypt-memo',
        method: 'POST',
        description: 'Decrypt encrypted memos from Zcash shielded transactions',
        warning: 'This endpoint sends viewing keys to the server. Use only for demonstration purposes.',
        parameters: {
            txId: 'string (required) - Transaction ID',
            viewingKey: 'string (required) - Unified Full Viewing Key (uview1...)',
        },
        zingoService: process.env.ZINGO_SERVICE_URL || 'Not configured',
    });
}
