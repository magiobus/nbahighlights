import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />

      <noscript>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
