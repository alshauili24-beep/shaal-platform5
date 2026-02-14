"use client";

import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, User, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getProposalsForProject, updateProposalStatus } from "@/actions/proposals";
import { RatingStars } from "@/components/RatingStars";

import { useRouter } from "next/navigation";
import { startConversation } from "@/actions/messaging";
import MilestoneList from "@/components/MilestoneList";

export default function ProjectDetailsClient({ projectId }: { projectId: string }) {
    const { lang, t } = useLang();
    const router = useRouter();
    const isRTL = lang === "ar";
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"proposals" | "financials">("proposals");

    async function handleMessage(e: React.MouseEvent, freelancerId: string) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const conversationId = await startConversation(freelancerId);
            router.push(`/dashboard/client/messages?id=${conversationId}`);
        } catch (err) {
            alert("Error starting conversation");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const data = await getProposalsForProject(projectId);
                setProposals(data);
            } catch (err) {
                console.error("Failed to load proposals", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [projectId]);

    async function handleStatus(proposalId: string, status: "accepted" | "rejected") {
        if (!confirm(`Are you sure you want to ${status} this proposal?`)) return;
        try {
            await updateProposalStatus(proposalId, status);
            // Refresh local state or router
            setProposals(prev => prev.map(p =>
                p.id === proposalId ? { ...p, status } : p
            ));
            router.refresh();
        } catch (err) {
            alert("Failed to update status");
        }
    }

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("تفاصيل المشروع والعروض", "Project Details & Proposals")}</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab("proposals")}
                    className={`pb-2 px-2 text-sm font-bold transition ${activeTab === "proposals" ? "text-[var(--shaal-orange)] border-b-2 border-[var(--shaal-orange)]" : "text-white/60 hover:text-white"}`}
                >
                    {t("العروض", "Proposals")}
                </button>
                <button
                    onClick={() => setActiveTab("financials")}
                    className={`pb-2 px-2 text-sm font-bold transition ${activeTab === "financials" ? "text-[var(--shaal-orange)] border-b-2 border-[var(--shaal-orange)]" : "text-white/60 hover:text-white"}`}
                >
                    {t("المالية والدفعات", "Financials & Milestones")}
                </button>
            </div>

            {activeTab === "financials" ? (
                <MilestoneList projectId={projectId} isClient={true} isFreelancer={false} />
            ) : (
                /* Proposals List */
                <div className="glass p-6 rounded-3xl border border-white/10">
                    {loading ? (
                        <div className="text-center py-10 text-white/40">Loading...</div>
                    ) : proposals.length === 0 ? (
                        <div className="text-center py-10 text-white/40 border-2 border-dashed border-white/5 rounded-2xl">
                            {t("لا توجد عروض حتى الآن", "No proposals yet")}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {proposals.map((prop) => (
                                <div key={prop.id} className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-start justify-between">
                                    {/* Freelancer Info */}
                                    <Link href={`/profile/${prop.freelancer.id}`} className="flex gap-4 group cursor-pointer flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition shrink-0">
                                            {prop.freelancer.name?.[0] || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg group-hover:text-[var(--shaal-orange)] transition">{prop.freelancer.name}</h3>
                                                <button
                                                    onClick={(e) => handleMessage(e, prop.freelancer.id)}
                                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[var(--shaal-orange)] hover:text-black transition text-white/60"
                                                    title={t("إرسال رسالة", "Send Message")}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                                                <RatingStars rating={prop.freelancer.rating || 5.0} />
                                                <span>• {prop.freelancer.completedJobs} {t("مهمة", "Jobs")}</span>
                                            </div>
                                            <div className="mt-3 text-white/80 text-sm bg-white/5 p-3 rounded-xl max-w-xl group-hover:bg-white/10 transition">
                                                "{prop.coverLetter}"
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Price & Actions */}
                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                        <div className="text-2xl font-black text-[var(--shaal-orange)]">
                                            ${(parseFloat(prop.price) * 1.10).toFixed(2)}
                                        </div>
                                        {prop.status === "pending" && (
                                            <div className="flex items-center gap-2 w-full">
                                                <button
                                                    onClick={() => handleStatus(prop.id, "accepted")}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-bold transition"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> {t("قبول", "Accept")}
                                                </button>
                                                <button
                                                    onClick={() => handleStatus(prop.id, "rejected")}
                                                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {prop.status === "accepted" && (
                                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                                                {t("تم القبول", "Accepted")}
                                            </div>
                                        )}
                                        {prop.status === "rejected" && (
                                            <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">
                                                {t("مرفوض", "Rejected")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
