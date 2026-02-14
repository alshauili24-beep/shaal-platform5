"use client";

import { useEffect, useState } from "react";
import { getFinanceStats, getAllTransactions } from "@/actions/finance";
import { Loader2, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

type Stats = {
    totalRevenue: number;
    totalPayouts: number;
    pendingPayouts: number;
    netBalance: number;
};

type Transaction = {
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string;
    };
};

export default function AdminFinancePage() {
    const { t } = useLang();
    const [stats, setStats] = useState<Stats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, transactionsData] = await Promise.all([
                    getFinanceStats(),
                    getAllTransactions()
                ]);
                setStats(statsData);
                // @ts-ignore
                setTransactions(transactionsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white/20" /></div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t("المالية والأرباح", "Finance & Profits")}</h1>
                <p className="text-white/60 mt-2">{t("نظرة عامة على الإيرادات والمصروفات", "Overview of revenue and expenses")}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title={t("إجمالي الإيرادات", "Total Revenue")}
                    value={stats?.totalRevenue || 0}
                    icon={<TrendingUp className="text-green-400" />}
                    color="bg-green-500/10 text-green-400 border-green-500/20"
                />
                <StatCard
                    title={t("صافي الربح", "Net Profit")} // Assuming Net Balance acts as profit/holding for now
                    value={stats?.netBalance || 0}
                    icon={<DollarSign className="text-blue-400" />}
                    color="bg-blue-500/10 text-blue-400 border-blue-500/20"
                />
                <StatCard
                    title={t("المصروفات (دفعات)", "Payouts")}
                    value={stats?.totalPayouts || 0}
                    icon={<TrendingDown className="text-red-400" />}
                    color="bg-red-500/10 text-red-400 border-red-500/20"
                />
                <StatCard
                    title={t("معلقة", "Pending")}
                    value={stats?.pendingPayouts || 0}
                    icon={<Clock className="text-orange-400" />}
                    color="bg-orange-500/10 text-orange-400 border-orange-500/20"
                />
            </div>

            {/* Transactions Table */}
            <div className="glass rounded-[1.75rem] border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="font-bold text-lg">{t("آخر المعاملات", "Recent Transactions")}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 text-sm font-medium text-white/60">
                            <tr>
                                <th className="px-6 py-4 text-start">{t("المستخدم", "User")}</th>
                                <th className="px-6 py-4 text-start">{t("المبلغ", "Amount")}</th>
                                <th className="px-6 py-4 text-start">{t("النوع", "Type")}</th>
                                <th className="px-6 py-4 text-start">{t("الحالة", "Status")}</th>
                                <th className="px-6 py-4 text-start">{t("التاريخ", "Date")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{tx.user.name || "Unknown"}</div>
                                        <div className="text-xs text-white/40">{tx.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold">
                                        {tx.amount.toLocaleString()} OMR
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${tx.type === "deposit" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                                            }`}>
                                            {tx.type === "deposit" ? t("إيداع", "Deposit") : t("سحب", "Payout")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`capitalize text-sm ${tx.status === "success" ? "text-green-400" :
                                                tx.status === "pending" ? "text-orange-400" : "text-red-400"
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/50">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                                        {t("لا توجد معاملات حتى الآن", "No transactions found yet")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
    return (
        <div className={`glass rounded-2xl p-6 border ${color.split(" ")[2] || "border-white/10"}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color.split(" ")[0]} ${color.split(" ")[1]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-black mb-1">{value.toLocaleString()} <span className="text-sm font-normal text-white/50">OMR</span></div>
            <div className="text-sm text-white/60">{title}</div>
        </div>
    );
}
