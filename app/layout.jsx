import "./globals.css";
import { Playfair_Display, DM_Sans } from "next/font/google";

import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const AnalyticsScripts = dynamic(() => import("@/components/AnalyticsScripts"), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

export const metadata = {
  title: "Qalam Blog Studio",
  description: "A professional daily blog platform.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ...existing code... */}
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} font-sans`}>
        <AnalyticsScripts />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
