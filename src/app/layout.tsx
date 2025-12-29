import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leonexia Client Tracker",
  description: "Manage clients efficiently with Leonexia Client Tracker",
  icons: {
    icon: "/LeonexiaTransparent.png", // your favicon in /public
    apple: "/LeonexiaTransparent.png",
  },
  openGraph: {
    title: "Leonexia Client Tracker",
    description: "Manage clients efficiently with Leonexia Client Tracker",
    url: "https://tracker.leonexia.com",
    siteName: "Leonexia",
    images: [
      {
        url: "https://tracker.leonexia.com/LeonexiaTransparent.png", // absolute URL
        width: 512,
        height: 512,
        alt: "Leonexia Logo",
      },
    ],
    locale: "en_PH",
    type: "website",
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
        {/* Optional: Structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Leonexia",
              url: "https://tracker.leonexia.com",
              logo: "https://tracker.leonexia.com/LeonexiaTransparent.png",
            }),
          }}
        />
        <link rel="icon" href="/LeonexiaTransparent.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
