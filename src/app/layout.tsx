import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "SHAAL | شعل للحلول الذكية",
  description:
    "منصة عمانية تربط العملاء بالفريلانسرز بخدمات التصميم، التسويق، التطوير، والمحتوى.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "SHAAL | شعل للحلول الذكية",
    description:
      "منصة عمانية تربط العملاء بالفريلانسرز بخدمات التصميم والتسويق والتطوير.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
