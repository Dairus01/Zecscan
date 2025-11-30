"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { performSearch } from "@/lib/api";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = async (searchQuery?: string) => {
        const queryToSearch = searchQuery || query;
        if (!queryToSearch.trim()) return;

        // If a specific query is passed (from examples), update the input state too
        if (searchQuery) {
            setQuery(searchQuery);
        }

        setIsSearching(true);
        const result = await performSearch(queryToSearch);
        if (result) {
            router.push(result);
        } else {
            alert("Invalid search query or not found");
        }
        setIsSearching(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur-md opacity-40 group-hover:opacity-75 transition-all duration-500 animate-pulse" />
                <div className="relative flex items-center bg-surface rounded-xl p-1.5 sm:p-2 border-2 border-primary/20 group-hover:border-primary/50 transition-all shadow-lg">
                    <div className="pl-3 sm:pl-4">
                        <span className="font-mono text-primary text-lg font-bold">›</span>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search address, tx, block number..."
                        className="flex-1 bg-transparent border-none outline-none text-foreground px-2 sm:px-4 py-2 sm:py-3 placeholder:text-muted/60 font-mono text-xs sm:text-sm min-w-0"
                    />
                    <button
                        onClick={() => handleSearch()}
                        disabled={isSearching}
                        className="bg-primary hover:bg-primary/80 text-background font-black py-2 px-4 sm:py-3 sm:px-8 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 uppercase tracking-wide border-2 border-primary text-xs sm:text-base whitespace-nowrap"
                    >
                        {isSearching ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                <span className="hidden sm:inline">Searching</span>
                                <span className="sm:hidden">...</span>
                            </span>
                        ) : (
                            "Search"
                        )}
                    </button>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono">
                <span className="text-muted font-bold uppercase tracking-wider">Examples:</span>
                <button
                    onClick={() => handleSearch("3000000")}
                    className="text-warning font-bold cursor-pointer hover:text-warning/80 transition-colors"
                >
                    Block #3000000
                </button>
                <span className="text-border hidden sm:inline">|</span>
                <button
                    onClick={() => handleSearch("t1WMVnNxQEBnW75oSkWGF446ys92YgVo8RS")}
                    className="text-primary font-bold cursor-pointer hover:text-primary/80 transition-colors"
                >
                    t-address
                </button>
                <span className="text-border hidden sm:inline">|</span>
                <button
                    onClick={() => handleSearch("zs1z7re262z009489462777935538833444")}
                    className="text-success font-bold cursor-pointer hover:text-success/80 transition-colors flex items-center gap-1.5"
                >
                    z-address <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </button>
            </div>
        </div>
    );
}
