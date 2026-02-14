"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Start or Get Conversation
export async function startConversation(targetUserId: string) {
    const session = await auth();
    console.log("startConversation: session user", session?.user?.id);
    console.log("startConversation: targetUserId", targetUserId);
    if (!session?.user) throw new Error("Unauthorized");

    // Verify users exist
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!currentUser) throw new Error(`Current user ${session.user.id} not found in DB`);
    if (!targetUser) throw new Error(`Target user ${targetUserId} not found in DB`);

    // Check if conversation exists
    // We need to find a conversation where BOTH users are participants.
    // This is complex in Prisma. 
    // Simplified User flow: Client clicks "Message" on Freelancer.

    // Find shared conversation
    const conversations = await prisma.conversation.findMany({
        where: {
            users: {
                every: {
                    userId: { in: [session.user.id, targetUserId] }
                }
            }
            // This 'every' logic ensures ONLY these two are in it? No, 'every' means all returned convos' users must match list.
            // If group chats existed, this would be weaker. But for 1-on-1 it's okay-ish if no other users exist.
            // A better query is: find convos where user is current AND user is target.
        },
        include: { users: true }
    });

    // Validating finding the specific one
    const existing = conversations.find(c =>
        c.users.length === 2 &&
        c.users.some(u => u.userId === session.user.id) &&
        c.users.some(u => u.userId === targetUserId)
    );

    if (existing) {
        return existing.id;
    }

    // Create new
    const conversation = await prisma.conversation.create({
        data: {
            users: {
                create: [
                    { userId: session.user.id },
                    { userId: targetUserId }
                ]
            }
        }
    });

    return conversation.id;
}

export async function getConversations() {
    const session = await auth();
    if (!session?.user) return [];

    const conversations = await prisma.conversation.findMany({
        where: {
            users: {
                some: { userId: session.user.id }
            }
        },
        include: {
            users: {
                include: { user: { select: { id: true, name: true, image: true, role: true } } }
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    // Format for UI
    return conversations.map(c => {
        const otherUser = c.users.find(u => u.userId !== session.user.id)?.user;
        const lastMessage = c.messages[0];
        return {
            id: c.id,
            otherUser,
            lastMessage: lastMessage ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isMine: lastMessage.senderId === session.user.id
            } : null,
            updatedAt: c.updatedAt
        };
    });
}

export async function getMessages(conversationId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify membership
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { users: true }
    });

    if (!conversation?.users.some(u => u.userId === session.user.id)) {
        throw new Error("Unauthorized");
    }

    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: { select: { id: true, name: true, image: true } }
        }
    });
}

import { createNotification } from "./notifications";

export async function sendMessage(conversationId: string, content: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    if (!content.trim()) return;

    await prisma.message.create({
        data: {
            content,
            conversationId,
            senderId: session.user.id
        }
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });

    // Notify the other user
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { users: { include: { user: true } } }
    });

    if (conversation) {
        const otherUserEntry = conversation.users.find(u => u.userId !== session.user.id);
        if (otherUserEntry && otherUserEntry.user) {
            const role = otherUserEntry.user.role;
            const link = role === "CLIENT"
                ? `/dashboard/client/messages?id=${conversationId}`
                : `/dashboard/freelancer/messages?id=${conversationId}`;

            await createNotification({
                userId: otherUserEntry.userId,
                type: "message",
                title: "رسالة جديدة",
                content: `${session.user.name}: ${content.substring(0, 50)}...`,
                link
            });
        }
    }

    revalidatePath(`/dashboard/client/messages`);
    revalidatePath(`/dashboard/freelancer/messages`);
}
