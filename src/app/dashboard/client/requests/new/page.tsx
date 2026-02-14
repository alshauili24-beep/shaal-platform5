"use client";

import { createProject } from "@/actions/projects";
import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRequestPage() {
    const { lang, t } = useLang();
    const router = useRouter();
    const isRTL = lang === "ar";
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createProject(formData);
            router.push("/dashboard/client/requests");
        } catch (err) {
            console.error(err);
            alert("Error creating project");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto glass rounded-3xl border border-white/10 p-8" dir={isRTL ? "rtl" : "ltr"}>
            <h1 className="text-2xl font-bold mb-6">{t("إنشاء طلب مشروع جديد", "Create New Request")}</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-white/70 mb-1">{t("عنوان المشروع", "Project Title")}</label>
                    <input name="title" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder={t("مثال: تصميم شعار", "e.g. Design a Logo")} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("نوع الخدمة", "Service Type")}</label>
                        <select name="service" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 text-white/80 [&>option]:bg-[#0b3a45]">
                            <option value="design">{t("تصميم", "Design")}</option>
                            <option value="marketing">{t("تسوين", "Marketing")}</option>
                            <option value="dev">{t("برمجة", "Development")}</option>
                            <option value="video">{t("فيديو", "Video")}</option>
                            <option value="content">{t("محتوى", "Content")}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("الميزانية (ر.ع)", "Budget (OMR)")}</label>
                        <input name="budget" type="number" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder="50" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white/70 mb-1">{t("آخر موعد", "Deadline")}</label>
                    <input name="deadline" type="date" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
                </div>

                <div>
                    <label className="block text-sm text-white/70 mb-1">{t("التفاصيل", "Details")}</label>
                    <textarea name="details" required rows={4} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" placeholder={t("اشرح تفاصيل مشروعك...", "Describe your project...")} />
                </div>

                <div className="pt-4 flex gap-3">
                    <button disabled={loading} type="submit" className="flex-1 rounded-xl px-6 py-3 font-semibold text-black hover:brightness-110 transition disabled:opacity-50" style={{ background: "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))" }}>
                        {loading ? t("جاري النشر...", "Posting...") : t("نشر الطلب", "Post Request")}
                    </button>
                    <Link href="/dashboard/client/requests" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition">
                        {t("إلغاء", "Cancel")}
                    </Link>
                </div>
            </form>
        </div>
    );
}
