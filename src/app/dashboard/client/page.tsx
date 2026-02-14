"use client";

import { useLang } from "@/components/LanguageProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ClientDashboard() {
    const { lang, t } = useLang();
    const { data: session } = useSession();
    const user = session?.user;
    const isRTL = lang === "ar";

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <div className="glass rounded-3xl border border-white/10 p-6 flex items-start justify-between gap-6 flex-wrap">
                <div>
                    <div className="text-sm text-white/60">{t("لوحة التحكم", "Dashboard")}</div>
                    <h1 className="text-3xl font-black mt-1">
                        {t("مرحباً, ", "Welcome, ")} {user?.name || t("عميل", "Client")}
                    </h1>
                    <p className="mt-2 text-white/70">
                        {t("إدارة مشاريعك وعرض العروض المقدمة.", "Manage your projects and view proposals.")}
                    </p>
                </div>
                <div>
                    <Link
                        href="/dashboard/client/requests/new"
                        className="inline-block rounded-2xl px-5 py-3 font-semibold text-black"
                        style={{ background: "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))" }}
                    >
                        {t("طلب جديد", "New Request")}
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-3xl border border-white/10 p-6">
                    <h2 className="text-xl font-bold mb-4">{t("مشاريعك النشطة", "Your Active Projects")}</h2>
                    <p className="text-white/60 text-sm">
                        {t("لا توجد مشاريع نشطة حالياً.", "No active projects loaded.")}
                    </p>
                    {/* TODO: List active projects */}
                </div>
                <div className="glass rounded-3xl border border-white/10 p-6">
                    <h2 className="text-xl font-bold mb-4">{t("آخر العروض", "Recent Proposals")}</h2>
                    <p className="text-white/60 text-sm">{t("لا توجد عروض جديدة.", "No new proposals.")}</p>
                </div>
            </div>
        </div>
    );
}
