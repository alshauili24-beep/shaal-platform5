"use client";

import { useState, useEffect } from "react";
import { createMilestone, fundMilestone, releaseMilestone, requestMilestoneRelease, getProjectMilestones } from "@/actions/payments";
import { CreditCard, CheckCircle, Lock, Plus } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

type Milestone = {
    id: string;
    title: string;
    amount: number;
    status: string;
    dueDate?: Date | null;
};

export default function MilestoneList({ projectId, isClient, isFreelancer }: { projectId: string, isClient: boolean, isFreelancer: boolean }) {
    const { t } = useLang();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const load = async () => {
        const data = await getProjectMilestones(projectId);
        setMilestones(data);
    };

    useEffect(() => {
        load();
    }, [projectId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await createMilestone(projectId, title, parseFloat(amount), date);
        setLoading(false);
        setShowForm(false);
        setTitle("");
        setAmount("");
        load();
    };

    const handleFund = async (id: string) => {
        if (!confirm(t("هل أنت متأكد من دفع ", "Are you sure to pay ") + "$" + milestones.find(m => m.id === id)?.amount + "?")) return;
        setLoading(true);
        await fundMilestone(id);
        setLoading(false);
        load();
    };

    const handleRelease = async (id: string) => {
        if (!confirm(t("تأكيد تحرير الدفعة للمستقل؟", "Release funds to freelancer?"))) return;
        setLoading(true);
        await releaseMilestone(id);
        setLoading(false);
        load();
    };

    const handleRequest = async (id: string) => {
        await requestMilestoneRelease(id);
        alert(t("تم إرسال الطلب للعميل!", "Request sent to client!"));
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{t("دفعات المشروع", "Payment Milestones")}</h3>
                {isClient && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-[var(--shaal-orange)] text-black px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition"
                    >
                        <Plus className="w-4 h-4" /> {t("إضافة دفعة", "Add Milestone")}
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            placeholder={t("عنوان الدفعة", "Milestone Title")}
                            value={title} onChange={e => setTitle(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            required
                        />
                        <input
                            type="number" placeholder={t("المبلغ ($)", "Amount ($)")}
                            value={amount} onChange={e => setAmount(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            required
                        />
                        <input
                            type="date"
                            value={date} onChange={e => setDate(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowForm(false)} className="text-white/60 text-sm hover:text-white px-3">{t("إلغاء", "Cancel")}</button>
                        <button type="submit" disabled={loading} className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold">{t("حفظ", "Save")}</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {milestones.length === 0 && (
                    <div className="text-center text-white/40 py-8 text-sm">{t("لا توجد دفعات مضافة", "No milestones created yet.")}</div>
                )}

                {milestones.map(m => (
                    <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-lg text-white">{m.title}</span>
                                <Badge status={m.status} t={t} />
                            </div>
                            <div className="text-white/60 text-sm mt-1">
                                {t("تاريخ الاستحقاق", "Due")}: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : t("غير محدد", "No date")}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="font-mono text-xl text-[var(--shaal-orange)]">${m.amount}</span>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {isClient && m.status === "pending" && (
                                    <button
                                        onClick={() => handleFund(m.id)} disabled={loading}
                                        className="flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-sm font-bold transition"
                                    >
                                        <Lock className="w-3 h-3" /> {t("إيداع", "Fund Escrow")}
                                    </button>
                                )}

                                {isClient && m.status === "funded" && (
                                    <button
                                        onClick={() => handleRelease(m.id)} disabled={loading}
                                        className="flex items-center gap-2 bg-[var(--shaal-orange)] text-black px-3 py-1.5 rounded-lg text-sm font-bold transition hover:opacity-90"
                                    >
                                        <CheckCircle className="w-3 h-3" /> {t("تحرير الدفعة", "Release Payment")}
                                    </button>
                                )}

                                {isFreelancer && m.status === "funded" && (
                                    <button
                                        onClick={() => handleRequest(m.id)} disabled={loading}
                                        className="bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        {t("طلب تحرير", "Request Release")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Badge({ status, t }: { status: string, t: any }) {
    const styles: Record<string, string> = {
        pending: "bg-gray-500/20 text-gray-400",
        funded: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        paid: "bg-green-500/20 text-green-400 border border-green-500/30",
        completed: "bg-green-500/20 text-green-400"
    };

    // Icon mapping
    const labels: Record<string, string> = {
        pending: t("قيد الانتظار", "Pending"),
        funded: t("مودعة بالضمان", "Funded (Escrow)"),
        paid: t("تم الدفع", "Paid"),
        completed: t("مكتمل", "Completed")
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
}
