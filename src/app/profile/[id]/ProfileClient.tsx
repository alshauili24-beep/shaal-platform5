"use client";

import { useLang } from "@/components/LanguageProvider";
import { RatingStars } from "@/components/RatingStars";
import { ArrowRight, Calendar, User, Briefcase, Image as ImageIcon, Video, Paperclip } from "lucide-react";
import Link from "next/link";

interface ProfileClientProps {
    user: any;
    portfolio: any[];
}

export default function ProfileClient({ user, portfolio }: ProfileClientProps) {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";

    if (!user) return <div className="p-20 text-center text-white/50">{t("المستخدم غير موجود", "User not found")}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#071f25] to-[#0b3a45] text-white pt-24 pb-10">
            <div className="mx-auto w-[92%] max-w-5xl space-y-8" dir={isRTL ? "rtl" : "ltr"}>

                {/* Header / Back */}
                {/* We try to detect history to go back, or just link to home/dashboard */}
                <Link href="#" onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition mb-4">
                    <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    {t("رجوع", "Back")}
                </Link>

                {/* Profile Card */}
                <div className="glass rounded-3xl border border-white/10 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-start">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
                        {user.name?.[0] || "U"}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-3xl font-black">{user.name}</h1>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/80">
                                {user.role === "FREELANCER" ? t("مستقل", "Freelancer") : user.role}
                            </span>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-4 text-white/60 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {t("انضم منذ", "Joined")}: {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {user.completedJobs} {t("مشرع مكتمل", "Projects Completed")}
                            </span>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                            <RatingStars rating={user.rating || 5.0} />
                            <span className="text-sm font-bold">{user.rating || "5.0"}</span>
                        </div>

                        {/* @ts-ignore */}
                        {user.bio && (
                            <p className="pt-4 text-white/70 text-sm leading-relaxed max-w-2xl">
                                {/* @ts-ignore */}
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Portfolio Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-[var(--shaal-orange)]" />
                        {t("معرض الأعمال", "Portfolio")}
                    </h2>

                    {portfolio.length === 0 ? (
                        <div className="glass p-10 text-center text-white/40 border-2 border-dashed border-white/5 rounded-2xl">
                            {t("لا توجد أعمال لعرضها", "No portfolio items to show")}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolio.map(item => (
                                <div key={item.id} className="bg-black/20 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition group">
                                    <div className="h-48 bg-white/5 relative bg-black/50">
                                        {item.videoUrl ? (
                                            <video
                                                src={item.videoUrl}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        ) : item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                                <ImageIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                        <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {item.attachmentUrl && (
                                            <a
                                                href={item.attachmentUrl}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-white/80 transition w-fit"
                                            >
                                                <Paperclip className="w-3 h-3 text-[var(--shaal-orange)]" />
                                                {t("تحميل المرفق", "Download Attachment")}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
