"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getNotifications() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20
    });
}

export async function getUnreadCount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    return await prisma.notification.count({
        where: { userId: session.user.id, read: false }
    });
}

export async function markAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.notification.update({
        where: { id: notificationId, userId: session.user.id },
        data: { read: true }
    });
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true }
    });
}

// Internal helper (not an action itself, but exported for use by other actions)
export async function createNotification({ userId, type, title, content, link }: {
    userId: string;
    type: string;
    title: string;
    content: string;
    link?: string;
}) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                content,
                link
            }
        });
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
}
