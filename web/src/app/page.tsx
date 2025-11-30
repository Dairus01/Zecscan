import Link from "next/link";
import { Shield, BarChart3, Database, ArrowRight, Lock } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { StatsCard } from "@/components/StatsCard";
import { MarketCapCard } from "@/components/MarketCapCard";
import { LiveRecentBlocks } from "@/components/LiveRecentBlocks";
import { LiveRecentTxs } from "@/components/LiveRecentTxs";
import { getNetworkStats, getPrivacyScore } from "@/lib/api";

export default async function Home() {
  const stats = await getNetworkStats();
  const privacyScore = await getPrivacyScore();

  return (
    <div className="flex flex-col gap-12 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-muted">
          Zcash Blockchain Explorer
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Decode the blockchain. <span className="group relative inline-block">
            <span className="text-primary font-bold border-b-2 border-primary/50 cursor-help">Privacy</span>
            <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[400px] px-6 py-4 bg-[#11141d] border border-[#2d3748] rounded-xl shadow-2xl text-sm text-white font-normal z-50">
              <span className="block text-center italic mb-2">&quot;The right to privacy is the most cherished of freedoms because it is the freedom that allows all others.&quot;</span>
              <span className="block text-center text-primary text-xs">— Edward Snowden, 2016</span>
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#2d3748]"></span>
            </span>
          </span> is <span className="text-secondary font-bold border-b-2 border-secondary/50">normal</span>.
        </p>
        <div className="pt-4">
          <SearchBar />

          {/* Decrypt Memo Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/decrypt"
              className="inline-flex items-center gap-3 px-12 py-6 bg-[#00e7ff] hover:bg-[#00d4eb] text-[#0b0e14] font-bold text-xl rounded-xl transition-all shadow-2xl shadow-[#00e7ff]/30 hover:shadow-[#00e7ff]/50 hover:scale-105 border-2 border-[#00e7ff]"
            >
              <Lock className="w-7 h-7" />
              Decrypt Memo
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="PRIVACY SCORE"
          value={privacyScore.toString()}
          subValue="/100"
          icon={Shield}
          color="secondary"
        />
        <MarketCapCard />
        <StatsCard
          label="TXS (24H)"
          value={stats ? stats.transactions_24h.toLocaleString() : "..."}
          icon={BarChart3}
          color="primary"
        />
        <StatsCard
          label="TOTAL TXS"
          value={stats ? (stats.transactions / 1000000).toFixed(2) + "M" : "..."}
          icon={Database}
          color="success"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted uppercase tracking-wider border-y border-border py-4">
        <span className="font-bold">Zcash Privacy Metrics</span>
        <Link
          href="/privacy"
          className="flex items-center gap-2 hover:text-primary transition-colors group font-bold"
        >
          View Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
        </Link>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LiveRecentBlocks />
        <LiveRecentTxs />
      </div>
    </div>
  );
}
