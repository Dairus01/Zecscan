import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ZecScan | Zcash Block Explorer",
  description: "Advanced Zcash block explorer with client-side decryption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "min-h-screen flex flex-col bg-background font-sans antialiased")}>
        <ClientProviders>
          <Navbar />
          <main className="flex-1 w-full relative z-10">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
