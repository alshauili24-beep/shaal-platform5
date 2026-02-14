"use client";

import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjectById, updateProject } from "@/actions/projects";

export default function EditProjectClient({ projectId }: { projectId: string }) {
    const { lang, t } = useLang();
    const router = useRouter();
    const isRTL = lang === "ar";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [service, setService] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [details, setDetails] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const p = await getProjectById(projectId);
                if (p) {
                    setTitle(p.title);
                    setService(p.service);
                    setBudget(p.budget.toString());
                    setDeadline(p.deadline);
                    setDetails(p.details);
                } else {
                    alert(t("المشروع غير موجود", "Project not found"));
                    router.push("/dashboard/client/requests");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [projectId, t, router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("service", service);
        formData.append("budget", budget);
        formData.append("deadline", deadline);
        formData.append("details", details);

        try {
            await updateProject(projectId, formData);
            router.push(`/dashboard/client/requests/${projectId}`);
        } catch (err) {
            alert("Error updating project");
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-white/50">{t("جاري التحميل...", "Loading...")}</div>;

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex items-center gap-4">
                <Link
                    href={`/dashboard/client/requests/${projectId}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                    <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black">{t("تعديل المشروع", "Edit Project")}</h1>
                    <p className="text-white/60 text-sm">
                        {t("قم بتحديث تفاصيل مشروعك", "Update your project details")}
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="glass rounded-3xl border border-white/10 p-8 max-w-2xl">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">{t("عنوان المشروع", "Project Title")}</label>
                        <input
                            value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                            placeholder={t("مثال: تصميم شعار", "e.g. Logo Design")}
                        />
                    </div>

                    {/* Service & Budget */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/70 mb-2">{t("مجال الخدمة", "Service Category")}</label>
                            <select
                                value={service} onChange={e => setService(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 text-white/80 [&>option]:bg-[#0b3a45]"
                            >
                                <option value="design">{t("تصميم وجرافيك", "Design & Creative")}</option>
                                <option value="marketing">{t("تسوين ومبيعات", "Marketing & Sales")}</option>
                                <option value="dev">{t("برمجة وتقنية", "Development & IT")}</option>
                                <option value="content">{t("كتابة وترجمة", "Writing & Translation")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-white/70 mb-2">{t("الميزانية (ر.ع)", "Budget (OMR)")}</label>
                            <input
                                value={budget} onChange={e => setBudget(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                                placeholder="100" type="number"
                            />
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">{t("آخر موعد", "Deadline")}</label>
                        <input
                            value={deadline} onChange={e => setDeadline(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                            placeholder="YYYY-MM-DD" type="date"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">{t("التتفاصيل", "Details")}</label>
                        <textarea
                            value={details} onChange={e => setDetails(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 min-h-[120px]"
                            placeholder={t("اشرح المطلوب بدقة...", "To describe requirements...")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-[var(--shaal-orange)] text-black font-bold py-4 rounded-2xl hover:brightness-110 transition disabled:opacity-50"
                    >
                        {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ التغييرات", "Save Changes")}
                    </button>
                </div>
            </form>
        </div>
    );
}
