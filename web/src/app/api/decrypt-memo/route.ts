import { NextRequest, NextResponse } from 'next/server';
import { validateUFVK } from '@/lib/zcash-utils';

/**
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
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
        rateLimit: '10 requests per minute per IP',
    });
}
