"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Ensure only admins can call this
async function checkAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getAllUsers(page = 1, query = "") {
    await checkAdmin();
    const take = 20;
    const skip = (page - 1) * take;

    const where = query ? {
        OR: [
            { name: { contains: query } },
            { email: { contains: query } }
        ]
    } : {};

    const users = await prisma.user.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            isVerified: true,
            isBanned: true,
            createdAt: true,
            _count: {
                select: { projects: true, proposals: true }
            }
        }
    });

    const total = await prisma.user.count({ where });

    return { users, total, pages: Math.ceil(total / take) };
}

export async function toggleUserBan(userId: string) {
    const session = await checkAdmin();
    // Prevent banning self
    if (userId === session.user.id) throw new Error("Cannot ban yourself");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const newState = !user.isBanned;

    await prisma.user.update({
        where: { id: userId },
        data: { isBanned: newState }
    });

    revalidatePath("/admin/users");
    return newState;
}

export async function verifyUser(userId: string) {
    await checkAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });

    await prisma.user.update({
        where: { id: userId },
        data: { isVerified: !user?.isVerified }
    });

    revalidatePath("/admin/users");
}

export async function getAdminStats() {
    await checkAdmin();

    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();

    // Calculate total revenue (simulated from Transactions)
    const transactions = await prisma.transaction.aggregate({
        where: { status: "success", type: "deposit" }, // Assuming deposits are revenue for now
        _sum: { amount: true }
    });

    return {
        totalUsers,
        totalProjects,
        totalRevenue: transactions._sum.amount || 0,
        const proposalsCount = await prisma.proposal.count();

        return {
            usersCount: totalUsers,
            projectsCount: totalProjects,
            proposalsCount,
            // totalRevenue: transactions._sum.amount || 0,
            // activeFreelancers: await prisma.user.count({ where: { role: "FREELANCER" } }),
        };
    }

    export async function getAdminData() {
        await checkAdmin();

        const users = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, email: true, role: true, image: true, createdAt: true }
        });

        const projects = await prisma.project.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { client: { select: { name: true } } }
        });

        return { users, projects };
    }
