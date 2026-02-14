"use client";

import { getAdminRequests, updateRequestStatus } from "@/actions/requests";
import { useLang } from "@/components/LanguageProvider";
import { startConversation } from "@/actions/messaging";
import { Loader2, Check, X, Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RequestType = {
    id: string;
    name: string;
    phone: string;
    service: string;
    budget: string;
    timeline: string;
    brief: string;
    status: string;
    createdAt: Date;
    userId?: string | null; // Add userId
    user?: any; // Add user object
};

export default function AdminRequestsPage() {
    const { t } = useLang();
    const router = useRouter(); // Initialize router
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        setLoading(true);
        try {
            const data = await getAdminRequests();
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatus(id: string, status: string) {
        // Optimistic update
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        try {
            await updateRequestStatus(id, status);
        } catch (error) {
            console.error(error);
            loadRequests(); // Revert on error
        }
    }

    async function handleChat(userId: string) {
        if (!userId) return;
        try {
            const conversationId = await startConversation(userId);
            router.push(`/admin/messages?id=${conversationId}`); // Redirect to Admin Messages
        } catch (error: any) {
            console.error("Failed to start chat", error);
            alert(error.message || "Failed to start chat");
        }
    }

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-white/50" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto text-white" dir="rtl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">{t("طلبات شعل", "Shaal Requests")}</h1>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                    {requests.length} {t("طلب", "Requests")}
                </div>
            </div>

            <div className="grid gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="glass rounded-2xl border border-white/10 p-6 relative overflow-hidden group hover:border-white/20 transition">
                        {/* Status Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                req.status === 'contacted' ? 'bg-green-500/20 text-green-400' :
                                    'bg-red-500/20 text-red-400'}`}>
                            {req.status}
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Main Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        {req.name}
                                        {req.userId && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{t("مسجل", "Registered")}</span>}
                                    </h3>
                                    <div className="text-white/50 text-sm mt-1 flex gap-4">
                                        <span>{req.phone}</span>
                                        <span>•</span>
                                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div>
                                        <div className="text-white/40 mb-1">{t("الخدمة", "Service")}</div>
                                        <div className="font-semibold text-[var(--shaal-orange)]">{req.service}</div>
                                    </div>
                                    <div>
                                        <div className="text-white/40 mb-1">{t("الميزانية", "Budget")}</div>
                                        <div className="font-semibold">{req.budget}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-white/40 mb-1">{t("المدة", "Timeline")}</div>
                                        <div className="font-semibold">{req.timeline}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-white/40 text-sm mb-2">{t("تفاصيل الطلب", "Brief")}</div>
                                    <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-xl">
                                        {req.brief}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6 mt-4 md:mt-0">
                                {req.userId && (
                                    <button
                                        onClick={() => handleChat(req.userId!)}
                                        className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl transition text-sm font-bold"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        {t("مراسلة", "Message")}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleStatus(req.id, 'contacted')}
                                    className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 rounded-xl transition text-sm font-bold"
                                >
                                    <Check className="w-4 h-4" />
                                    {t("تم التواصل", "Contacted")}
                                </button>
                                <button
                                    onClick={() => handleStatus(req.id, 'rejected')}
                                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl transition text-sm font-bold"
                                >
                                    <X className="w-4 h-4" />
                                    {t("رفض", "Reject")}
                                </button>
                                <a
                                    href={`https://wa.me/${req.phone}`}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition text-sm font-bold"
                                >
                                    <Mail className="w-4 h-4" />
                                    {t("واتساب", "WhatsApp")}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        {t("لا توجد طلبات جديدة", "No new requests")}
                    </div>
                )}
            </div>
        </div>
    );
}
