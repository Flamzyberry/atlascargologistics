import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "ShipX Cargo Logistics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: `${COMPANY_NAME} - Global Shipping & Logistics Solutions`,
  description: `${COMPANY_NAME} provides reliable international and domestic shipping services. Track shipments, get instant quotes, and manage logistics with our advanced platform. Reliable shipping options for domestic and international freight.`,
  keywords: [
    "shipping",
    "logistics",
    "freight forwarding",
    "package tracking",
    "international shipping",
    "courier service",
    "express delivery",
    "cargo transport",
    COMPANY_NAME,
  ],
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: COMPANY_NAME,
    title: `${COMPANY_NAME} - Global Shipping & Logistics Solutions`,
    description: `${COMPANY_NAME} provides reliable international and domestic shipping services. Track shipments, get instant quotes, and manage logistics with our advanced platform.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_NAME} - Global Shipping & Logistics Solutions`,
    description: `${COMPANY_NAME} provides reliable international and domestic shipping services. Track shipments, get instant quotes, and manage logistics.`,
    creator: `@${COMPANY_NAME.toLowerCase().replace(/\\s+/g, "")}`,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* GTranslate.io Widget */}
        <Script
          id="gtranslate-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.gtranslateSettings = {
                "default_language": "en",
                "detect_browser_language": true,
                "languages": ["en","es","fr","de","it","pt","zh-CN","zh-TW","ja","ko","ar","ru","hi","bn","pa","te","mr","ta","ur","tr","pl","nl","sv","no","da","fi","cs","el","he","id","ms","th","vi","ro","hu","uk","bg","hr","sk","sl","lt","lv","et"],
                "wrapper_selector": ".gtranslate_wrapper",
                "alt_flags": {"en":"usa","pt":"brazil"}
              };
            `,
          }}
        />
        <Script
          src="https://cdn.gtranslate.net/widgets/latest/dropdown.js"
          strategy="afterInteractive"
          defer
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <Providers>{children}</Providers>

        {/* Smartsupp Live Chat Widget */}
        <Script
          id="smartsupp-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '5734aa6d7470dd3703a25a64e53cce9c1ef380bf';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[]; 
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />

        {/* GTranslate Widget Container */}
        <div className="gtranslate_wrapper" />

        {/* Custom styles for GTranslate dropdown widget */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .gtranslate_wrapper {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                z-index: 9999 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .gtranslate_wrapper select,
              .gt_selector {
                background: #000000 !important;
                color: #ffffff !important;
                border: none !important;
                border-radius: 0 8px 0 0 !important;
                padding: 6px 10px !important;
                font-size: 11px !important;
                cursor: pointer !important;
                outline: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                padding-right: 24px !important;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
                background-repeat: no-repeat !important;
                background-position: right 6px center !important;
              }
              .gtranslate_wrapper select:hover,
              .gt_selector:hover {
                background-color: #222222 !important;
              }
              .gtranslate_wrapper select option {
                background: #000000 !important;
                color: #ffffff !important;
                padding: 8px !important;
              }
              @media (max-width: 640px) {
                .gtranslate_wrapper select,
                .gt_selector {
                  font-size: 10px !important;
                  padding: 5px 8px !important;
                  padding-right: 20px !important;
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
