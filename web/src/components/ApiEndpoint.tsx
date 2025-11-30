"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ApiParam {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

interface ApiEndpointProps {
    method: "GET" | "POST";
    path: string;
    description: string;
    params?: ApiParam[];
    exampleRequest?: string;
    exampleResponse?: string;
}

export function ApiEndpoint({
    method,
    path,
    description,
    params,
    exampleRequest,
    exampleResponse
}: ApiEndpointProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!exampleRequest) return;
        try {
            await navigator.clipboard.writeText(exampleRequest);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="space-y-4 p-6 rounded-xl bg-surface border border-border">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-lg border",
                        method === "GET"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                    )}>
                        {method}
                    </span>
                    <code className="text-sm font-mono text-foreground bg-black/20 px-2 py-1 rounded">
                        {path}
                    </code>
                </div>
            </div>

            <p className="text-muted text-sm leading-relaxed">
                {description}
            </p>

            {params && params.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Parameters</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="pb-2 font-medium text-muted">Name</th>
                                    <th className="pb-2 font-medium text-muted">Type</th>
                                    <th className="pb-2 font-medium text-muted">Required</th>
                                    <th className="pb-2 font-medium text-muted">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {params.map((param) => (
                                    <tr key={param.name}>
                                        <td className="py-2 font-mono text-primary">{param.name}</td>
                                        <td className="py-2 text-muted">{param.type}</td>
                                        <td className="py-2">
                                            {param.required ? (
                                                <span className="text-error text-xs">Yes</span>
                                            ) : (
                                                <span className="text-muted text-xs">No</span>
                                            )}
                                        </td>
                                        <td className="py-2 text-muted">{param.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {exampleRequest && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Example Request</h4>
                        <button
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <div className="p-4 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-muted overflow-x-auto">
                        {exampleRequest}
                    </div>
                </div>
            )}

            {exampleResponse && (
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Example Response</h4>
                    <pre className="p-4 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-muted overflow-x-auto">
                        {exampleResponse}
                    </pre>
                </div>
            )}
        </div>
    );
}
