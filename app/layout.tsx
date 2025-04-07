import { AppSidebar } from "@/components/app-sidebar";
import ChatLink from "@/components/chat-link";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AIProvider } from "@/providers/ai-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyForge",
  description: "Forging a solid financial future, one decision at a time.",
};

export default function RootLayout({
  ai,
  children,
}: Readonly<{
  ai: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ fontSize: "100%" }} suppressHydrationWarning>
      <body className={`${inter.className} antialiased h-dvh`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AIProvider>
              <div>{ai}</div>
              <SidebarProvider className="flex flex-col [--header-height:calc(--spacing(14))]">
                <Header />
                <div className="flex flex-1 items-stretch">
                  {/* Animated Background Elements */}
                  <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute top-3/4 left-2/3 w-1/3 h-1/3 bg-blue-500/20 rounded-full blur-[90px] animate-pulse delay-1000" />
                    <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-2000" />
                  </div>
                  <AppSidebar className="pt-[var(--header-height)] bg-sidebar/50 backdrop-blur-sm" />
                  <SidebarInset className="self-stretch flex-1 bg-background/75 backdrop-blur-md">
                    <div className="h-[calc(100dvh-var(--header-height)-2px)] overflow-auto p-2 md:p-4 grid">
                      {children}
                    </div>
                  </SidebarInset>
                </div>
                <Toaster />
                <ChatLink />
              </SidebarProvider>
            </AIProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
