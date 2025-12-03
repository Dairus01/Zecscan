"use client";

import { Heart, Github } from "lucide-react";
import { useState } from "react";
import { SupportModal } from "./SupportModal";

export function Footer() {
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

    return (
        <>
            <footer className="border-t border-white/5 bg-background py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Left: Branding */}
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-foreground">ZECSCAN</span>
                            </div>
                            <p className="text-sm text-muted">
                                Zcash Blockchain Explorer
                                <br />
                                Privacy is Normal
                            </p>
                        </div>

                        {/* Center: Support Button */}
                        <div className="flex-1 flex justify-center">
                            <button
                                onClick={() => setIsSupportModalOpen(true)}
                                className="flex items-center gap-3 px-8 py-4 bg-[#00e7ff] hover:bg-[#00d4eb] text-[#0b0e14] font-bold text-lg rounded-xl transition-all shadow-2xl shadow-[#00e7ff]/30 hover:shadow-[#00e7ff]/50 hover:scale-105 border-2 border-[#00e7ff] group"
                            >
                                <Heart className="w-6 h-6 text-[#0b0e14] fill-transparent group-hover:fill-[#0b0e14] transition-colors" />
                                <span>Support Us</span>
                            </button>
                        </div>

                        {/* Right: Credits */}
                        <div className="flex flex-col items-center md:items-end gap-2 flex-1">
                            <div className="flex flex-col items-center md:items-end text-xs text-muted mt-2">
                                <div className="flex items-center gap-4 mb-2">
                                    <a
                                        href="https://x.com/DairusOkoh"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted hover:text-foreground transition-colors"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="w-5 h-5 fill-current"
                                        >
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://github.com/Dairus01/Zecscan"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted hover:text-foreground transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                </div>
                                <p>Powered by Blockchair and Nighthawk</p>
                                <p className="flex items-center gap-1">
                                    Built with <span className="text-warning">💜</span> for the
                                    community
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-muted/50">
                        © 2025 ZecScan. Open source blockchain explorer.
                    </div>
                </div>
            </footer>
            <SupportModal
                isOpen={isSupportModalOpen}
                onClose={() => setIsSupportModalOpen(false)}
            />
        </>
    );
}
