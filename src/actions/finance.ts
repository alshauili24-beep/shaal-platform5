"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getFinanceStats() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    // 1. Total Revenue (Deposits with success status)
    const deposits = await prisma.transaction.aggregate({
        where: { type: "deposit", status: "success" },
        _sum: { amount: true }
    });

    // 2. Total Payouts (Payouts with success status)
    const payouts = await prisma.transaction.aggregate({
        where: { type: "payout", status: "success" },
        _sum: { amount: true }
    });

    // 3. Pending Payouts
    const pending = await prisma.transaction.aggregate({
        where: { type: "payout", status: "pending" },
        _sum: { amount: true }
    });

    return {
        totalRevenue: deposits._sum.amount || 0,
        totalPayouts: payouts._sum.amount || 0,
        pendingPayouts: pending._sum.amount || 0,
        netBalance: (deposits._sum.amount || 0) - (payouts._sum.amount || 0)
    };
}

export async function getAllTransactions() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return [];

    return await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, email: true, image: true }
            }
        },
        take: 50 // Limit to last 50 for now
    });
}
