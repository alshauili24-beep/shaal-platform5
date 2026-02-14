"use client";

import { getOpenProjects } from "@/actions/projects";
import { createProposal } from "@/actions/proposals";
import { useLang } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
// import { auth } from "@/auth"; // Cannot use in client component

export default function FindWorkPage() {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";

    // Since this is now a client component, we should fetch projects via useEffect 
    // OR keep it server component and pass lang prop? 
    // Best practice for "static" server data + dynamic lang is... mixed.
    // For simplicity, let's fetch in useEffect.
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getOpenProjects();
                setProjects(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">{t("ابحث عن عمل", "Find Work")}</h1>
                    <p className="text-white/60 text-sm">{t("تصفح المشاريع المتاحة وقدم عرضك", "Browse available projects and send your proposal")}</p>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 text-center text-white/40">{t("جاري التحميل...", "Loading...")}</div>
                ) : projects.length === 0 ? (
                    <div className="glass p-8 text-center text-white/60">
                        {t("لا توجد مشاريع متاحة حالياً.", "No open jobs available at the moment.")}
                    </div>
                ) : (
                    projects.map((p) => (
                        <div key={p.id} className="glass rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold">{p.title}</h2>
                                        <div className="text-sm text-white/60 mt-1">
                                            {t("العميل:", "Client:")} {p.client.name || "Client"} • {p.service}
                                        </div>
                                    </div>
                                    <div className={`text-${isRTL ? "left" : "right"}`}>
                                        <span className="block text-2xl font-black text-emerald-400">{p.budget} {t("ر.ع", "OMR")}</span>
                                        <span className="text-xs text-white/50">{t("الميزانية", "Budget")}</span>
                                    </div>
                                </div>

                                <p className="mt-4 text-white/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                                    {p.details}
                                </p>

                                <div className="mt-4 flex gap-4 text-sm text-white/50">
                                    <span>{t("آخر موعد:", "Due:")} {p.deadline}</span>
                                </div>
                            </div>

                            <div className="md:w-72 bg-white/5 rounded-2xl p-5 border border-white/10 h-fit">
                                <h3 className="font-bold mb-3">{t("تقديم عرض", "Submit Proposal")}</h3>
                                {/* We can use a Server Action directly in 'action' prop even in Client Component */}
                                <form action={async (formData) => {
                                    // Wrap for error handling/feedback optional
                                    await createProposal(formData);
                                    alert(t("تم إرسال العرض!", "Proposal Sent!"));
                                }} className="space-y-3">
                                    <input type="hidden" name="projectId" value={p.id} />

                                    <div>
                                        <label className="text-xs text-white/60 block mb-1">{t("سعرك (ر.ع)", "Your Price (OMR)")}</label>
                                        <input name="price" type="number" required placeholder="example: 45" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30" />
                                    </div>

                                    <div>
                                        <label className="text-xs text-white/60 block mb-1">{t("رسالة العرض", "Cover Letter")}</label>
                                        <textarea name="coverLetter" required rows={3} placeholder={t("لماذا أنت الأنسب؟", "Why you?")} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30" />
                                    </div>

                                    <button type="submit" className="w-full rounded-xl py-2 font-semibold text-black text-sm hover:scale-[1.02] transition" style={{ background: "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))" }}>
                                        {t("إرسال العرض", "Send Proposal")}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
