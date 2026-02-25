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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
