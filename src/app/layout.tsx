import type { Metadata } from "next";
import "./globals.css";

import { Inter, Instrument_Serif } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  display: 'swap',
  preload: true,
});
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Genesis | The Agentic dApp Foundry",
  description: "Build decentralized applications with AI agents in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
