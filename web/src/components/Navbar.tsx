"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useMarketData } from "@/contexts/MarketDataContext";

interface ZecPriceData {
    price: number;
    change24h: number;
}

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: marketData } = useMarketData();

    // Map market data to price data format
    const zecPrice: ZecPriceData | null = marketData
        ? {
            price: marketData.price,
            change24h: marketData.change24h,
        }
        : null;

    return (
        <nav className="border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-warning/30 group-hover:border-warning transition-colors">
                                <Image
                                    src="/zcash-logo.jpg"
                                    alt="Zcash"
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    ZECSCAN
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                                    [ MAINNET ]
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-muted hover:text-white transition-colors py-2">
                                Tools
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-[9999]">
                                <div className="bg-[#11141d] border border-[#2d3748] rounded-xl shadow-2xl overflow-hidden p-2 opacity-100" style={{ backgroundColor: '#11141d', backdropFilter: 'none' }}>
                                    <Link href="/privacy" className="flex items-center gap-2 px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        Privacy Dashboard
                                    </Link>
                                    <Link href="/mempool" className="flex items-center gap-2 px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        Mempool Viewer
                                    </Link>
                                    <Link href="/decrypt" className="flex items-center gap-2 px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        Decrypt Memo
                                    </Link>
                                    <div className="h-px bg-[#2d3748] my-1 mx-2" />
                                    <Link href="/api-docs" className="flex items-center gap-2 px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        API Docs
                                    </Link>
                                    <Link href="/learn" className="flex items-center gap-2 px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        Learn About Zcash
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <ThemeSwitcher />

                        <div className="h-4 w-px bg-border" />

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted font-medium">ZEC:</span>
                            <span className="font-bold text-foreground">
                                ${zecPrice?.price.toFixed(2) || "---"}
                            </span>
                            {zecPrice && (
                                <span
                                    className={cn(
                                        "text-xs font-bold",
                                        zecPrice.change24h >= 0 ? "text-success" : "text-error"
                                    )}
                                >
                                    {zecPrice.change24h >= 0 ? "+" : ""}
                                    {zecPrice.change24h.toFixed(2)}%
                                </span>
                            )}
                        </div>

                        <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-sm">
                            MAINNET
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-muted hover:text-white p-2"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-surface">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <div className="py-2 border-b border-border mb-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted font-medium">
                                    ZEC Price
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    ${zecPrice?.price.toFixed(2) || "---"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted">Network</span>
                                <span className="px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary border border-primary/20">
                                    MAINNET
                                </span>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
                        >
                            Network Stats
                        </Link>
                        <Link
                            href="/privacy"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
                        >
                            Privacy Dashboard
                        </Link>
                        <Link
                            href="/mempool"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
                        >
                            Mempool Viewer
                        </Link>
                        <Link
                            href="/decrypt"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
                        >
                            Decrypt Memo
                        </Link>
                        <Link
                            href="/api-docs"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
                        >
                            API Docs
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
