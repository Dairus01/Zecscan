"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dim" | "midnight" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load theme from localStorage
        const saved = localStorage.getItem("zecscan-theme") as Theme;
        if (saved && ["light", "dim", "midnight", "dark"].includes(saved)) {
            setThemeState(saved);
            document.documentElement.setAttribute("data-theme", saved);
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            // Apply theme to document
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("zecscan-theme", theme);
            console.log("Theme changed to:", theme);
        }
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        console.log("Setting theme:", newTheme);
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
