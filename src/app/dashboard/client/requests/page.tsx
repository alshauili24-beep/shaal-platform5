"use client";

import { getClientProjects } from "@/actions/projects";
import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RequestsPage() {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getClientProjects();
            setProjects(data);
            setLoading(false);
        }
        load();
    }, []);

    const statusMap: Record<string, string> = {
        open: t("مفتوح", "Open"),
        in_progress: t("قيد التنفيذ", "In Progress"),
        completed: t("مكتمل", "Completed"),
        // fallback
    };

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("طلباتي", "My Requests")}</h1>
                <Link
                    href="/dashboard/client/requests/new"
                    className="rounded-xl px-4 py-2 bg-white text-black font-medium hover:scale-105 transition"
                >
                    {t("طلب جديد", "New Request")}
                </Link>
            </div>

            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-white/50">{t("جاري التحميل...", "Loading...")}</div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-white/60">
                        {t("لا توجد طلبات بعد. ابدأ بإنشاء طلب جديد!", "No requests found. Create one to get started!")}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-white/60 text-xs uppercase">
                            <tr>
                                <th className={`px-6 py-4 ${isRTL ? "text-right" : ""}`}>{t("العنوان", "Title")}</th>
                                <th className={`px-6 py-4 ${isRTL ? "text-right" : ""}`}>{t("الحالة", "Status")}</th>
                                <th className={`px-6 py-4 ${isRTL ? "text-right" : ""}`}>{t("الميزانية", "Budget")}</th>
                                <th className={`px-6 py-4 ${isRTL ? "text-right" : ""}`}>{t("المتقدمين", "Applicants")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {projects.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/client/requests/${p.id}`} className="block hover:text-[var(--shaal-orange)] transition">
                                            <div className="font-semibold">{p.title}</div>
                                        </Link>
                                        <div className="text-xs text-white/50">{p.service} • {t("آخر موعد:", "Due:")} {p.deadline}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${p.status === "open" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                            "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                            }`}>
                                            {statusMap[p.status] || p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{p.budget} {t("ر.ع", "OMR")}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/client/requests/${p.id}`} className="hover:underline">
                                            {p.proposals.length} {t("متقدم", "Applicants")}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
