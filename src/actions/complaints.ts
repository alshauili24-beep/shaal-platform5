"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitComplaint(content: string) {
    const session = await auth();
    // Allow anonymous complaints? User asked for "resevied in admin page... chat with who make it".
    // Chat implies we need a User. So we'll enforce auth or at least try to attach it.
    // If user is guest, we can't really "chat" easily without email/phone.
    // For now, if logged in, attach ID. Content is required.

    if (!content.trim()) return { error: "Content is required" };

    try {
        await prisma.complaint.create({
            data: {
                content,
                userId: session?.user?.id,
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to submit complaint:", error);
        return { error: "Failed to submit" };
    }
}

export async function getAdminComplaints() {
    // Check Admin
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return [];

    return await prisma.complaint.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });
}
