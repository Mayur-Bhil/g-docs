// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";


const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Docs",
  description: "DMK team",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <ConvexClientProvider>
           {children}
          </ConvexClientProvider>
          </NuqsAdapter> 
      </body>
    </html>
  );
}