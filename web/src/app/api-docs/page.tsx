"use client";

import { ApiEndpoint } from "@/components/ApiEndpoint";
import { Book, Shield, Box, Activity, Network, Code } from "lucide-react";
import Link from "next/link";

export default function ApiDocs() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen max-w-7xl mx-auto">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 border-r border-white/5 bg-background/50 backdrop-blur-sm md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <Book className="w-5 h-5 text-primary" />
                        <h1 className="font-bold text-lg">API Docs</h1>
                    </div>

                    <nav className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-wider px-3">Getting Started</h3>
                            <Link href="#introduction" className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                Introduction
                            </Link>
                            <Link href="#privacy-limitations" className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                Privacy & Limitations
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-wider px-3">Endpoints</h3>
                            <Link href="#blocks" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                <Box className="w-4 h-4" />
                                Blocks
                            </Link>
                            <Link href="#transactions" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                <Activity className="w-4 h-4" />
                                Transactions
                            </Link>
                            <Link href="#privacy-stats" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                <Shield className="w-4 h-4" />
                                Privacy & Analytics
                            </Link>
                            <Link href="#network" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                <Network className="w-4 h-4" />
                                Network
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-wider px-3">Resources</h3>
                            <Link href="#code-examples" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                                <Code className="w-4 h-4" />
                                Code Examples
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 space-y-16">
                {/* Introduction */}
                <section id="introduction" className="space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">ZecScan API</h1>
                        <p className="text-lg text-muted leading-relaxed">
                            Welcome to the ZecScan API documentation. Our API provides access to Zcash blockchain data,
                            including blocks, transactions, network statistics, and privacy metrics.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                        <h3 className="font-bold text-primary mb-2">Base URL</h3>
                        <code className="text-sm font-mono bg-black/20 px-3 py-2 rounded block w-fit">
                            https://zescan.vercel.app/api
                        </code>
                    </div>
                </section>

                {/* Privacy & Limitations */}
                <section id="privacy-limitations" className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Shield className="w-6 h-6 text-secondary" />
                        <h2 className="text-2xl font-bold">Privacy & Limitations</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 rounded-xl bg-surface border border-border">
                            <h3 className="font-bold mb-2 text-foreground">Shielded Addresses</h3>
                            <p className="text-sm text-muted leading-relaxed">
                                Due to Zcash&apos;s privacy features, shielded addresses (z-addresses) and their balances cannot be queried.
                                Only transparent addresses (t-addresses) and unified addresses with transparent receivers are supported.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-surface border border-border">
                            <h3 className="font-bold mb-2 text-foreground">Rate Limiting</h3>
                            <p className="text-sm text-muted leading-relaxed mb-4">
                                If you exceed 100 requests per minute, you&apos;ll receive a 429 Too Many Requests response.
                            </p>
                            <code className="text-xs font-mono bg-black/20 px-2 py-1 rounded text-error">
                                429 Too Many Requests
                            </code>
                        </div>
                    </div>
                </section>

                {/* Blocks */}
                <section id="blocks" className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Box className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Blocks</h2>
                    </div>

                    <ApiEndpoint
                        method="GET"
                        path="/block/:height"
                        description="Get detailed information about a specific block by height."
                        params={[
                            { name: "height", type: "number", required: true, description: "The block height to query" }
                        ]}
                        exampleRequest="curl https://zescan.vercel.app/api/block/3667080"
                        exampleResponse={`{
  "height": 3667080,
  "hash": "0000000...",
  "timestamp": 1699123456,
  "transactions": [],
  "transactionCount": 2,
  "size": 1234,
  "difficulty": 1,
  "confirmations": 5
}`}
                    />

                    <ApiEndpoint
                        method="GET"
                        path="/blocks"
                        description="Get a list of recent blocks with pagination."
                        params={[
                            { name: "limit", type: "number", required: false, description: "Number of blocks to return (default: 10)" },
                            { name: "offset", type: "number", required: false, description: "Offset for pagination" }
                        ]}
                        exampleRequest="curl 'https://zescan.vercel.app/api/blocks?limit=10&offset=0'"
                        exampleResponse={`{
  "blocks": [
    {
      "height": 3667080,
      "hash": "0000000...",
      "timestamp": 1699123456,
      "transaction_count": 2,
      "size": 1234
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 3667080,
    "hasMore": true
  }
}`}
                    />
                </section>

                {/* Transactions */}
                <section id="transactions" className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Activity className="w-6 h-6 text-success" />
                        <h2 className="text-2xl font-bold">Transactions</h2>
                    </div>

                    <ApiEndpoint
                        method="GET"
                        path="/tx/:txid"
                        description="Get detailed information about a specific transaction."
                        params={[
                            { name: "txid", type: "string", required: true, description: "The transaction ID (hash)" }
                        ]}
                        exampleRequest="curl https://zescan.vercel.app/api/tx/abc123..."
                        exampleResponse={`{
  "txid": "abc123...",
  "blockHeight": 3667080,
  "timestamp": 1699123456,
  "confirmations": 5,
  "fee": 0,
  "size": 250,
  "shieldedSpends": 0,
  "shieldedOutputs": 0,
  "hasShieldedData": false
}`}
                    />

                    <ApiEndpoint
                        method="GET"
                        path="/mempool"
                        description="Get current mempool status and pending transactions."
                        exampleRequest="curl https://zescan.vercel.app/api/mempool"
                        exampleResponse={`{
  "count": 5,
  "transactions": [
    {
      "txid": "abc...",
      "type": "shielded",
      "size": 2500,
      "time": 1699123456
    }
  ],
  "stats": {
    "total": 5,
    "shielded": 2,
    "transparent": 3
  }
}`}
                    />
                </section>

                {/* Privacy & Analytics */}
                <section id="privacy-stats" className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Shield className="w-6 h-6 text-secondary" />
                        <h2 className="text-2xl font-bold">Privacy & Analytics</h2>
                    </div>

                    <ApiEndpoint
                        method="GET"
                        path="/privacy-stats"
                        description="Get current privacy metrics for the network."
                        exampleRequest="curl https://zescan.vercel.app/api/privacy-stats"
                        exampleResponse={`{
  "metrics": {
    "privacyScore": 85,
    "shieldedTxCount": 1234,
    "transparentTxCount": 567,
    "fullyShieldedPercentage": 68.5
  }
}`}
                    />
                </section>

                {/* Network */}
                <section id="network" className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Network className="w-6 h-6 text-warning" />
                        <h2 className="text-2xl font-bold">Network</h2>
                    </div>

                    <ApiEndpoint
                        method="GET"
                        path="/network/stats"
                        description="Get general network statistics."
                        exampleRequest="curl https://zescan.vercel.app/api/network/stats"
                        exampleResponse={`{
  "height": 3667080,
  "difficulty": 123456.78,
  "hashrate": "10.5 GSol/s",
  "peers": 24
}`}
                    />
                </section>

                {/* Code Examples */}
                <section id="code-examples" className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                        <Code className="w-6 h-6 text-muted" />
                        <h2 className="text-2xl font-bold">Code Examples</h2>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">JavaScript / Node.js</h3>
                            <pre className="p-4 rounded-xl bg-[#0d1117] border border-white/10 overflow-x-auto text-sm font-mono text-muted">
                                {`// Fetch block data
const response = await fetch('https://zescan.vercel.app/api/block/3667080');
const data = await response.json();
console.log(data);

// Fetch privacy stats
const stats = await fetch('https://zescan.vercel.app/api/privacy-stats');
const privacyData = await stats.json();
console.log(privacyData.metrics.privacyScore);`}
                            </pre>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Python</h3>
                            <pre className="p-4 rounded-xl bg-[#0d1117] border border-white/10 overflow-x-auto text-sm font-mono text-muted">
                                {`import requests

# Fetch block data
response = requests.get('https://zescan.vercel.app/api/block/3667080')
data = response.json()
print(data)

# Fetch mempool
mempool = requests.get('https://zescan.vercel.app/api/mempool')
print(f"Pending transactions: {mempool.json()['count']}")`}
                            </pre>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
