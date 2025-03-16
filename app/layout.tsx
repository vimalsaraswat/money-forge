import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ChatLink from "@/components/chat-link";
import { AIProvider } from "@/providers/ai-provider";
import { SessionProvider } from "next-auth/react";

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
                  <AppSidebar className="pt-[var(--header-height)] bg-sidebar/50 backdrop-blur-sm" />
                  <SidebarInset className="self-stretch flex-1 bg-background/50 backdrop-blur-sm">
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
