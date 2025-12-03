"use client";

import { useEffect, useState } from "react";

interface TerminalStep {
    message: string;
    status: "pending" | "loading" | "complete";
}

interface TerminalOutputProps {
    isActive: boolean;
    onComplete: () => void;
}

export default function TerminalOutput({ isActive, onComplete }: TerminalOutputProps) {
    const [steps, setSteps] = useState<TerminalStep[]>([
        { message: "Initializing WASM cryptographic engine...", status: "pending" },
        { message: "Parsing unified viewing key...", status: "pending" },
        { message: "Deriving zero-knowledge proof keys...", status: "pending" },
        { message: "Fetching shielded transaction data...", status: "pending" },
        { message: "Decrypting memo with Nighthawk . . .", status: "pending" },
    ]);

    const [currentStep, setCurrentStep] = useState(-1);

    useEffect(() => {
        if (!isActive) {
            setCurrentStep(-1);
            setSteps(prev => prev.map(step => ({ ...step, status: "pending" })));
            return;
        }

        // Start the animation sequence
        const stepDurations = [800, 700, 900, 1000, 1200]; // milliseconds for each step
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const progressToNextStep = () => {
            if (currentIndex < steps.length) {
                setCurrentStep(currentIndex);

                // Set current step to loading
                setSteps(prev => prev.map((step, idx) => ({
                    ...step,
                    status: idx === currentIndex ? "loading" : idx < currentIndex ? "complete" : "pending"
                })));

                timeoutId = setTimeout(() => {
                    // Mark current step as complete
                    setSteps(prev => prev.map((step, idx) => ({
                        ...step,
                        status: idx <= currentIndex ? "complete" : "pending"
                    })));

                    currentIndex++;
                    if (currentIndex < steps.length) {
                        progressToNextStep();
                    } else {
                        // All steps complete, call onComplete after a short delay
                        setTimeout(() => {
                            onComplete();
                        }, 300);
                    }
                }, stepDurations[currentIndex] || 800);
            }
        };

        progressToNextStep();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="bg-background border border-primary/30 rounded-xl overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-surface border-b border-border px-4 py-2 flex items-center justify-between">
                <span className="text-primary text-sm font-mono font-bold">DECRYPTING.log</span>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-background p-6 font-mono text-sm space-y-3 min-h-[300px]">
                {/* Command Line */}
                <div className="text-primary">
                    <span className="text-success">$</span> ./decrypt --wasm --zero-knowledge
                </div>

                {/* Progress Steps */}
                <div className="space-y-2 pt-2">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                            {step.status === "complete" ? (
                                <span className="text-success">[✓]</span>
                            ) : step.status === "loading" ? (
                                <span className="text-secondary animate-pulse">[~]</span>
                            ) : (
                                <span className="text-muted">[ ]</span>
                            )}
                            <span className={`${step.status === "complete"
                                ? "text-success"
                                : step.status === "loading"
                                    ? "text-secondary"
                                    : "text-muted"
                                }`}>
                                {step.message}
                                {step.status === "loading" && (
                                    <span className="inline-block animate-pulse ml-1">
                                        <span className="inline-block w-1 h-3 bg-secondary"></span>
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Blinking Cursor when all complete */}
                {currentStep >= steps.length - 1 && steps.every(s => s.status === "complete") && (
                    <div className="pt-2">
                        <span className="text-primary">$</span>
                        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
