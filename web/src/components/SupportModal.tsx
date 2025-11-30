"use client";

import { X, Copy, Heart, Check } from "lucide-react";
import { useState } from "react";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const [copied, setCopied] = useState(false);
    const address = "u19tp2rt225wum8m40xr7un5ewv8grspghkulwwjx0a05m5c4dpz9ec4wlg82nj6g2qjltdvqhnxhs4kssntrx0fwfxqapgw7r9gmn9m92";

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="relative w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-success fill-success" />
                        <h2 className="text-2xl font-bold text-primary">Support ZecScan</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-hover"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="px-6 text-muted">
                    Help us keep this explorer free and open-source
                </p>

                <div className="p-6 space-y-6">
                    {/* Address Card */}
                    <div className="p-6 rounded-xl bg-background border border-border space-y-4">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 text-xs font-bold text-success bg-success/10 rounded border border-success/20 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-success" />
                                SHIELDED
                            </span>
                            <span className="px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded border border-primary/20">
                                UNIFIED ADDRESS
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted uppercase tracking-wider">
                                Donation Address (Zcash)
                            </label>
                            <div className="p-4 rounded-lg bg-surface border border-border font-mono text-sm text-primary break-all leading-relaxed">
                                {address}
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00e7ff] hover:bg-[#00d4eb] text-[#0b0e14] font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-[#00e7ff]/20"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Address
                                </>
                            )}
                        </button>
                    </div>

                    {/* Bio Section */}
                    <div className="p-4 rounded-lg bg-success/5 border border-success/10 flex gap-3">
                        <Heart className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                                <span className="text-success font-medium">Your donation is private and encrypted.</span>{" "}
                                Thank you for supporting open-source blockchain tools! 🙏
                            </p>
                            <div className="pt-2 text-muted-foreground border-t border-success/10 mt-2">
                                <p>
                                    I am Dairus, a Blockchain Data Scientist. If you want to contact me or see my work,
                                    you can find me on X at{" "}
                                    <a
                                        href="https://x.com/DairusOkoh"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-accent hover:underline transition-colors"
                                    >
                                        x.com/DairusOkoh
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
