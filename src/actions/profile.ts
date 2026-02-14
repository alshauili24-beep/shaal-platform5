"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            role: true,
            rating: true,
            completedJobs: true,
            createdAt: true,
            bio: true,
            // email: false, // Don't expose email publicly ideally, or mask it
        }
    });
    return user;
}

export async function getPublicPortfolio(userId: string) {
    return await prisma.portfolioItem.findMany({
        where: { freelancerId: userId },
        orderBy: { createdAt: "desc" },
    });
}
