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
      <body className={`antialiased`}>
        {/* TODO better loading screen */}
        <Suspense fallback="Loading...">
          <QueryProvider>
            <UserProvider>
              <div className="h-screen max-h-screen grid grid-rows-[auto_1fr_auto]  p-8">
                {children}
              </div>
            </UserProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
