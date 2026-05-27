"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AnalyticsScripts() {
  const [isProd, setIsProd] = useState(false);

  useEffect(() => {
    setIsProd(window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1");
  }, []);

  if (!isProd) return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N638RNLFR1" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N638RNLFR1');
        `}
      </Script>
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7052202351109392"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* OneSignal */}
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer strategy="afterInteractive" />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
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
                  fetch('/api/subscribers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                  });
                });
              }
            });
          });
        `}
      </Script>
    </>
  );
}
