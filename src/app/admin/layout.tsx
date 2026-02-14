"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { LayoutDashboard, Users, FolderOpen, MessageSquare, FileText, DollarSign } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t, lang } = useLang();
    const isRTL = lang === "ar";

    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full pt-20 pb-10 bg-gradient-to-br from-[#071f25] to-[#0b3a45]" dir={isRTL ? "rtl" : "ltr"}>
                <div className="fixed inset-0 -z-10" style={{ background: "radial-gradient(900px 600px at 50% 10%, rgba(255,255,255,0.05), transparent 60%)" }} />

                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
                    {/* Admin Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24 space-y-2">
                            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider px-4 mb-2">{t("لوحة التحكم", "Admin Panel")}</h2>
                            <NavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label={t("الرئيسية", "Dashboard")} />
                            <NavLink href="/admin/users" icon={<Users className="w-5 h-5" />} label={t("المستخدمين", "Users")} />
                            <NavLink href="/admin/requests" icon={<FileText className="w-5 h-5" />} label={t("طلبات شعل", "Shaal Requests")} />
                            <NavLink href="/admin/messages" icon={<MessageSquare className="w-5 h-5" />} label={t("الرسائل", "Messages")} />
                            <NavLink href="/admin/complaints" icon={<MessageSquare className="w-5 h-5" />} label={t("الشكاوى", "Complaints")} />
                            <NavLink href="/admin/finance" icon={<DollarSign className="w-5 h-5" />} label={t("المالية", "Finance")} /> {/* Add Finance Link */}
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition group">
            <span className="opacity-70 group-hover:opacity-100">{icon}</span>
            <span className="font-bold text-sm">{label}</span>
        </Link>
    );
}
