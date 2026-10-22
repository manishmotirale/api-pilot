import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import { HotkeysProviders } from "@/components/hot-key-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "API Pilot - Modern API Testing Platform",
    template: "%s | API Pilot",
  },
  description: "A powerful API testing and collaboration platform with real-time collaboration, AI-powered request generation, WebSocket testing, and comprehensive API development tools. The modern alternative to Postman.",
  keywords: [
    "API testing",
    "REST client",
    "API development",
    "Postman alternative",
    "WebSocket testing",
    "API collaboration",
    "HTTP client",
    "API testing tool",
  ],
  authors: [{ name: "API Pilot Team" }],
  creator: "API Pilot",
  openGraph: {
    type: "website",
    title: "API Pilot - Modern API Testing Platform",
    description: "A powerful API testing and collaboration platform with AI-powered features",
    siteName: "API Pilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Pilot - Modern API Testing Platform",
    description: "A powerful API testing and collaboration platform with AI-powered features",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HotkeysProviders>
              <Toaster />
              {children}
            </HotkeysProviders>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
