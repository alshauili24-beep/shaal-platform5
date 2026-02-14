"use client";

import { useEffect, useState } from "react";
import { getAdminComplaints } from "@/actions/complaints";
import { startConversation } from "@/actions/messaging";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

type ComplaintType = {
    id: string;
    content: string;
    status: string;
    createdAt: Date;
    user?: {
        id: string;
        name: string | null;
    } | null;
};

export default function AdminComplaintsPage() {
    const { t } = useLang();
    const router = useRouter();
    const [complaints, setComplaints] = useState<ComplaintType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminComplaints().then((data) => {
            // @ts-ignore
            setComplaints(data);
            setLoading(false);
        });
    }, []);

    async function handleChat(userId: string) {
        try {
            const conversationId = await startConversation(userId);
            router.push(`/admin/messages?id=${conversationId}`);
        } catch (error: any) {
            alert(error.message || "Failed to start chat");
        }
    }

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white/20" /></div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{t("المقترحات والشكاوى", "Suggestions & Complaints")}</h1>

            <div className="grid gap-6">
                {complaints.map((item) => (
                    <div key={item.id} className="glass rounded-2xl border border-white/10 p-6 relative">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg">
                                        {item.user ? item.user.name : t("زائر", "Guest")}
                                    </span>
                                    <span className="text-xs text-white/40">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl">
                                    {item.content}
                                </p>
                            </div>

                            {item.user && (
                                <button
                                    onClick={() => handleChat(item.user!.id)}
                                    className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl transition text-sm font-bold shrink-0"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    {t("مراسلة", "Message")}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {complaints.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        {t("لا توجد مقترحات جديدة", "No new suggestions")}
                    </div>
                )}
            </div>
        </div>
    );
}
