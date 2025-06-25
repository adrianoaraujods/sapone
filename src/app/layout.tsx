import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";

import { BackgroundPattern } from "@/components/layout/background-pattern";
import SystemProvider from "@/components/system-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-svh overflow-x-hidden font-sans antialiased [--navbar-height:calc(theme(spacing.14))]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <SystemProvider>
            {children}

            <BackgroundPattern />
          </SystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
