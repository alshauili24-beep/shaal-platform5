"use client";

import { useLang } from "@/components/LanguageProvider";
// import { SignOutButton } from "@/components/AuthButtons"; // Unused
import Link from "next/link";

interface AdminDashboardProps {
    stats: {
        usersCount: number;
        projectsCount: number;
        proposalsCount: number;
    };
    users: any[];
    projects: any[];
}

export default function AdminDashboardClient({ stats, users, projects }: AdminDashboardProps) {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";

    return (
        <div className="max-w-7xl mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
            <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-200">
                        {t("لوحة تحكم المدير", "Admin Dashboard")}
                    </h1>
                    <p className="text-gray-400 mt-1">{t("مركز التحكم", "Control Panel")}</p>
                </div>
                {/* <div>
                     Logout usually handled by Navbar or specific button
                </div> */}
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard label={t("إجمالي المستخدمين", "Total Users")} value={stats.usersCount} color="bg-blue-500/10 border-blue-500/20 text-blue-400" />
                <StatCard label={t("إجمالي المشاريع", "Total Projects")} value={stats.projectsCount} color="bg-purple-500/10 border-purple-500/20 text-purple-400" />
                <StatCard label={t("إجمالي العروض", "Total Proposals")} value={stats.proposalsCount} color="bg-green-500/10 border-green-500/20 text-green-400" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <section className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("المستخدمين الجدد", "Recent Users")}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 uppercase bg-white/5">
                                <tr>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("المستخدم", "User")}</th>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("الدور", "Role")}</th>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("التاريخ", "Date")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{u.name || "No Name"}</div>
                                            <div className="text-xs text-gray-400">{u.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs border ${u.role === "CLIENT" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                                                u.role === "FREELANCER" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                                                    "bg-red-500/10 border-red-500/20 text-red-400"
                                                }`}>
                                                {u.role === "CLIENT" ? t("عميل", "Client") :
                                                    u.role === "FREELANCER" ? t("مستقل", "Freelancer") :
                                                        u.role === "ADMIN" ? t("مدير", "Admin") : u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={3} className="p-4 text-center text-gray-500">{t("لا يوجد مستخدمين", "No users found")}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recent Projects */}
                <section className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{t("أحدث المشاريع", "Recent Projects")}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 uppercase bg-white/5">
                                <tr>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("المشروع", "Project")}</th>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("الحالة", "Status")}</th>
                                    <th className={`px-4 py-3 ${isRTL ? "text-right" : ""}`}>{t("الميزانية", "Budget")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{p.title}</div>
                                            <div className="text-xs text-gray-400">{t("بواسطة", "by")} {p.client.name || p.client.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs border ${p.status === "open" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                                "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                                }`}>
                                                {p.status === "open" ? t("مفتوح", "Open") : p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {p.budget} {t("ر.ع", "OMR")}
                                        </td>
                                    </tr>
                                ))}
                                {projects.length === 0 && (
                                    <tr><td colSpan={3} className="p-4 text-center text-gray-500">{t("لا توجد مشاريع", "No projects found")}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`p-6 rounded-2xl border ${color.split(" ")[1]} bg-opacity-10 backdrop-blur-sm bg-white/5`}>
            <div className="text-gray-400 text-sm mb-1">{label}</div>
            <div className={`text-4xl font-black ${color.split(" ").pop()}`}>{value}</div>
        </div>
    );
}
