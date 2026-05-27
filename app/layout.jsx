import "./globals.css";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7052202351109392"
          crossOrigin="anonymous"
        ></script>
        {/* ...existing code... */}
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "ad5f7a13-d281-4104-be4a-2d14a6370d93",
                  promptOptions: {
                    slidedown: {
                      enabled: true,
                      position: "top"
                    }
                  }
                });
                OneSignal.on('subscriptionChange', function(isSubscribed) {
                  if (isSubscribed) {
                    OneSignal.getUserId().then(function(userId) {
                      // Send userId to your backend to save
                      fetch('/api/subscribers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId }),
                      });
                    });
                  }
                });
              });
            `
          }}
        />
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} font-sans`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
