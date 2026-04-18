// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";


const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Docs",
  description: "DMK grp",
};

import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">  
      <body className={inter.className}>
        <NuqsAdapter>
          <ConvexClientProvider>
            {children}
           <Toaster className="select:none"
                position="top-right"
                toastOptions={{
                  className: "select-none",
                  duration: 3500,
                  style: {
                    background: "#FFFDF5",
                    color: "#1a1a1a",
                    border: "1.5px solid #1a1a1a",
                    borderRadius: "2px",
                    fontSize: "13px",
                    fontFamily: "'Courier New', Courier, monospace",
                    fontWeight: "500",
                    padding: "12px 16px",
                    boxShadow: "4px 4px 0px #1a1a1a",
                    maxWidth: "320px",
                    letterSpacing: "0.01em",
      
                  },
                  classNames: {
                    success: "toast-success",
                    error: "toast-error",
                  },
                }}
              />
          </ConvexClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}