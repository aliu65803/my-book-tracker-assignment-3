import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Book Tracker",
  description: "Track your reading journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${merriweather.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var d = document.documentElement;
                var mode = localStorage.getItem('theme');
                if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  d.classList.add('dark');
                }
                var ct = localStorage.getItem('color-theme');
                if (ct && ['cozy','ocean','forest'].indexOf(ct) !== -1) {
                  d.classList.add('theme-' + ct);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full font-body antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
