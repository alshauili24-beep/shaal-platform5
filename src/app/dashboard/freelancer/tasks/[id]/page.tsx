"use client";

import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { useEffect, useState, use } from "react";
import { getProjectById } from "@/actions/projects";
import MilestoneList from "@/components/MilestoneList";
import { startConversation } from "@/actions/messaging";
import { useRouter } from "next/navigation";

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang, t } = useLang();
    const router = useRouter();
    const isRTL = lang === "ar";

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "financials">("details");

    useEffect(() => {
        async function load() {
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleMessage = async () => {
        if (project?.clientId) {
            const cid = await startConversation(project.clientId);
            router.push(`/dashboard/freelancer/messages?id=${cid}`);
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50">Loading...</div>;
    if (!project) return <div className="p-10 text-center">Project not found</div>;

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <div>
                <Link href="/dashboard/freelancer/tasks" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition text-sm">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    {t("العودة للمهام", "Back to Tasks")}
                </Link>
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="text-3xl font-black">{project.title}</h1>
                        <p className="text-white/60 mt-1 flex items-center gap-2">
                            {t("العميل", "Client")}: <span className="text-white hover:underline cursor-pointer" onClick={handleMessage}>{project.client?.name || "Unknown"}</span>
                        </p>
                    </div>
                    <span className={[
                        "px-4 py-2 rounded-xl text-sm font-bold border",
                        project.status === "in_progress"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                    ].join(" ")}>
                        {project.status === "in_progress" ? t("قيد التنفيذ", "In Progress") : project.status}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-2 px-2 text-sm font-bold transition ${activeTab === "details" ? "text-[var(--shaal-orange)] border-b-2 border-[var(--shaal-orange)]" : "text-white/60 hover:text-white"}`}
                >
                    {t("التفاصيل", "Details")}
                </button>
                <button
                    onClick={() => setActiveTab("financials")}
                    className={`pb-2 px-2 text-sm font-bold transition ${activeTab === "financials" ? "text-[var(--shaal-orange)] border-b-2 border-[var(--shaal-orange)]" : "text-white/60 hover:text-white"}`}
                >
                    {t("المالية والدفعات", "Financials & Milestones")}
                </button>
            </div>

            {activeTab === "financials" ? (
                <MilestoneList projectId={id} isClient={false} isFreelancer={true} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass p-8 rounded-3xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">{t("تفاصيل المشروع", "Project Details")}</h3>
                            <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-line">
                                {project.details}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-3xl border border-white/10">
                            <h3 className="text-lg font-bold mb-4 text-white/60">{t("اكشن", "Actions")}</h3>
                            <button className="w-full py-3 bg-[var(--shaal-orange)] text-black rounded-xl font-bold hover:opacity-90 transition mb-3">
                                {t("تسليم المشروع", "Deliver Project")}
                            </button>
                            <button onClick={handleMessage} className="w-full py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition">
                                {t("مراسلة العميل", "Message Client")}
                            </button>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-white/10">
                            <h3 className="text-lg font-bold mb-4 text-white/60">{t("معلومات", "Info")}</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-white/40 uppercase mb-1">{t("الميزانية", "Budget")}</div>
                                    <div className="font-mono text-xl">{project.budget}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/40 uppercase mb-1">{t("الموعد النهائي", "Deadline")}</div>
                                    <div className="text-lg">{project.deadline}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
