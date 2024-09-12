import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./components/QueryProvider";
import { Suspense } from "react";
import { UserProvider } from "./components/UserProvider";
// import localFont from "next/font/local";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// ${geistSans.variable}

export const metadata: Metadata = {
  title: "Mathagon 2",
  // TBD with og:image
  description: "Mathagon 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased p-8`}>
        {/* TODO better loading screen */}
        <Suspense fallback="Loading...">
          <QueryProvider>
            <UserProvider>{children}</UserProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
