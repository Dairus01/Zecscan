import * as cheerio from 'cheerio';

export interface ZcashTransaction {
    txId: string;
    type: 'Received' | 'Sent';
    amount: string;
    time?: string;
}

export interface ZcashAddressDetails {
    address: string;
    balance: string;
    totalReceived: string;
    totalSpent: string;
    transactions: ZcashTransaction[];
}

export async function getZcashAddressDetails(address: string): Promise<ZcashAddressDetails> {
    try {
        const response = await fetch(`https://mainnet.zcashexplorer.app/address/${address}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch address details: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let balance = "0.00 ZEC";
        let totalReceived = "0.00 ZEC";
        let totalSpent = "0.00 ZEC";

        // Helper to find value associated with a label
        const findValue = (label: string) => {
            let val = "";
            // Look for the label text
            $(`*:contains("${label}")`).each((_, el) => {
                // Skip if element has children (we want the leaf text node container)
                if ($(el).children().length > 0) return;

                // Check exact text match or close to it to avoid false positives
                if ($(el).text().trim() !== label) return;

                // Strategy 1: Sibling div/span
                const next = $(el).next();
                if (next.text().includes('ZEC')) {
                    val = next.text().trim();
                    return false;
                }

                // Strategy 2: Parent's next sibling (common in grid/flex layouts)
                const parentNext = $(el).parent().next();
                if (parentNext.text().includes('ZEC')) {
                    val = parentNext.text().trim();
                    return false;
                }

                // Strategy 3: Look for value in the same container (e.g. "Balance: 10 ZEC")
                const parentText = $(el).parent().text();
                const match = parentText.match(new RegExp(`${label}\\s*([\\d\\.,]+\\s*ZEC)`));
                if (match) {
                    val = match[1];
                    return false;
                }
            });
            return val;
        };

        balance = findValue('Balance') || balance;
        totalReceived = findValue('Received') || totalReceived;
        totalSpent = findValue('Spent') || totalSpent;

        // Transactions
        const transactions: ZcashTransaction[] = [];

        // Find all transaction links
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (!href || !href.includes('/transactions/')) return;

            const txId = href.split('/').pop() || '';

            if (!txId || transactions.some(t => t.txId === txId)) return;

            // Try to find the container row for this transaction
            // We look up a few levels to find a container that might be a row
            const container = $(el).closest('div.row, tr, li, div[class*="flex"]');

            if (container.length) {
                const text = container.text();
                const type = text.includes('Sent') ? 'Sent' : 'Received';

                // Extract amount
                // Look for ZEC amount in the container
                const amountMatch = text.match(/([\d\.,]+\s*ZEC)/);
                const amount = amountMatch ? amountMatch[1] : 'Unknown';

                transactions.push({
                    txId,
                    type,
                    amount
                });
            }
        });

        // Fallback for transactions if the above strict container search failed
        if (transactions.length === 0) {
            // Look for "Received" or "Sent" links specifically
            $('a').each((_, el) => {
                const text = $(el).text().trim();
                if (text === 'Received' || text === 'Sent') {
                    const href = $(el).attr('href');
                    if (href && href.includes('/transactions/')) {
                        const txId = href.split('/').pop() || '';
                        if (!transactions.some(t => t.txId === txId)) {
                            // Try to find amount in siblings
                            const container = $(el).closest('div'); // Adjust as needed
                            const amountMatch = container.text().match(/([\d\.,]+\s*ZEC)/);
                            transactions.push({
                                txId,
                                type: text as 'Received' | 'Sent',
                                amount: amountMatch ? amountMatch[1] : 'Unknown'
                            });
                        }
                    }
                }
            });
        }

        return {
            address,
            balance,
            totalReceived,
            totalSpent,
            transactions
        };

    } catch (error) {
        console.error('Error fetching Zcash address details:', error);
        return {
            address,
            balance: "Error",
            totalReceived: "Error",
            totalSpent: "Error",
            transactions: []
        };
    }
}
