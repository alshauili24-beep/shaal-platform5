"use client";

import { Sidebar, SideLink } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useLang } from "@/components/LanguageProvider";

export default function ClientLayoutUI({ children }: { children: React.ReactNode }) {
    const { t } = useLang();
    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full pt-24 pb-10 bg-gradient-to-br from-[#071f25] to-[#0b3a45]">
                {/* Background Effect */}
                <div className="fixed inset-0 -z-10" style={{ background: "radial-gradient(900px 600px at 15% 20%, rgba(24,161,182,.20), transparent 60%), radial-gradient(900px 600px at 85% 25%, rgba(251,125,20,.18), transparent 55%)" }} />

                <div className="mx-auto w-[92%] max-w-6xl flex gap-6">
                    <Sidebar>
                        <SideLink href="/dashboard/client">{t("نظرة عامة", "Overview")}</SideLink>
                        <SideLink href="/dashboard/client/requests">{t("طلباتي", "My Requests")}</SideLink>
                        {/* <SideLink href="/dashboard/client/requests/new">{t("طلب جديد", "New Request")}</SideLink> */}
                        <SideLink href="/dashboard/client/messages">{t("الرسائل", "Messages")}</SideLink>
                        <SideLink href="/dashboard/client/settings">{t("الإعدادات", "Settings")}</SideLink>
                    </Sidebar>

                    <section className="flex-1 min-w-0">
                        {children}
                    </section>
                </div>
            </main>
        </>
    );
}
