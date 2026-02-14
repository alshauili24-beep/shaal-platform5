"use client";

import { useState, useEffect } from "react";
import { getAllUsers, toggleUserBan, verifyUser } from "@/actions/admin";
import { Search, Shield, Ban, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

export default function AdminUsersPage() {
    const { t } = useLang();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers(page, search);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleBan = async (id: string, currentStatus: boolean) => {
        if (!confirm(currentStatus ? t("إزالة الحظر؟", "Unban user?") : t("حظر المستخدم؟", "Ban user?"))) return;
        await toggleUserBan(id);
        loadData();
    };

    const handleVerify = async (id: string) => {
        await verifyUser(id);
        loadData();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("إدارة المستخدمين", "User Management")}</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                    <input
                        placeholder={t("بحث عن مستخدم...", "Search users...")}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--shaal-orange)]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 text-white/60 border-b border-white/5">
                            <th className="p-4 font-normal">{t("المستخدم", "User")}</th>
                            <th className="p-4 font-normal">{t("الدور", "Role")}</th>
                            <th className="p-4 font-normal">{t("الحالة", "Status")}</th>
                            <th className="p-4 font-normal">{t("النشاط", "Activity")}</th>
                            <th className="p-4 font-normal text-right">{t("إجراءات", "Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/40">{t("جاري التحميل...", "Loading...")}</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                            {user.name?.[0] || "?"}
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {user.name}
                                                {user.isVerified && <CheckCircle className="w-3 h-3 text-blue-400" title="Verified" />}
                                            </div>
                                            <div className="text-xs text-white/40">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.role === "CLIENT" ? "bg-purple-500/20 text-purple-300" : "bg-teal-500/20 text-teal-300"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {user.isBanned ? (
                                        <span className="px-2 py-1 rounded-full text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                                            <Ban className="w-3 h-3" /> {t("محظور", "Banned")}
                                        </span>
                                    ) : (
                                        <span className="text-green-400 text-xs">{t("نشط", "Active")}</span>
                                    )}
                                </td>
                                <td className="p-4 text-white/60">
                                    {user.role === "CLIENT" ? (
                                        <span>{user._count.projects} {t("مشاريع", "Projects")}</span>
                                    ) : (
                                        <span>{user._count.proposals} {t("عروض", "Proposals")}</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleVerify(user.id)}
                                            className={`p-2 rounded-lg transition ${user.isVerified ? "bg-blue-500/20 text-blue-400" : "bg-white/5 hover:bg-white/10 text-white/40"}`}
                                            title="Toggle Verify"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleBan(user.id, user.isBanned)}
                                            className={`p-2 rounded-lg transition ${user.isBanned ? "bg-red-500/20 text-red-400" : "bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40"}`}
                                            title="Toggle Ban"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls could go here */}
        </div>
    );
}
