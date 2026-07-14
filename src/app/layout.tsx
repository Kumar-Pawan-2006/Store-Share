import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Store & Share | Solar Revenue Optimization Platform",
  description: "Leverage shared solar battery storage to optimize energy bills and distribute revenue for Indian housing societies.",
  keywords: ["Solar Battery Share", "Housing Society Solar", "Indian Microgrid", "Energy Optimization", "Green Fintech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full flex flex-col`}
      >
        <Providers>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
