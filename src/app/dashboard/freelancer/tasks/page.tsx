"use client";

import { getFreelancerTasks } from "@/actions/projects"; // Assuming you exported this
import { useLang } from "@/components/LanguageProvider";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function MyTasksPage() {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getFreelancerTasks();
                setTasks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            <div>
                <h1 className="text-2xl font-black">{t("مهامي", "My Tasks")}</h1>
                <p className="text-white/60 text-sm">
                    {t("المشاريع التي تعمل عليها حالياً", "Projects you are currently working on")}
                </p>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 min-h-[50vh]">
                {loading ? (
                    <div className="text-center py-20 text-white/40">Loading...</div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/40 border-2 border-dashed border-white/5 rounded-2xl">
                        <Clock className="w-10 h-10 mb-4 opacity-50" />
                        <p>{t("لا توجد مهام حالياً", "No active tasks")}</p>
                        <p className="text-xs mt-2">{t("قدم عروضاً على مشاريع جديدة!", "Apply for new projects!")}</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                {/* Task Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-xl hover:text-[var(--shaal-orange)] transition">
                                            <a href={`/dashboard/freelancer/tasks/${task.id}`}>
                                                {task.title}
                                            </a>
                                        </h3>
                                        <span className={[
                                            "px-3 py-1 rounded-full text-xs font-bold border",
                                            task.status === "in_progress"
                                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                : task.status === "done"
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                        ].join(" ")}>
                                            {task.status === "in_progress" ? t("قيد التنفيذ", "In Progress") :
                                                task.status === "done" ? t("مكتمل", "Completed") : task.status}
                                        </span>
                                    </div>

                                    <div className="text-sm text-white/60 flex items-center gap-4">
                                        <span>Item #{task.id.slice(-4)}</span>
                                        <span>• {task.client?.name}</span>
                                        <span>• {task.deadline}</span>
                                    </div>
                                </div>

                                {/* Budget & Action */}
                                <div className="text-right">
                                    <div className="text-2xl font-black text-[var(--shaal-orange)] mb-2">
                                        {task.budget} OMR
                                    </div>
                                    <a
                                        href={`/dashboard/freelancer/tasks/${task.id}`}
                                        className="inline-flex px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition items-center gap-2"
                                    >
                                        {t("عرض التفاصيل", "View Details")}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
