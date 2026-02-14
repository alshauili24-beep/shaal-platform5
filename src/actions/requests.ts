"use server";

import { prisma } from "@/lib/prisma";
import { createNotification } from "@/actions/notifications";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth"; // Add auth import

export async function submitServiceRequest(formData: FormData) {
    const session = await auth(); // Get session
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const brief = formData.get("brief") as string;
    const service = formData.get("service") as string;
    const budget = formData.get("budget") as string;
    const timeline = formData.get("timeline") as string;

    if (!name || !phone || !brief) {
        throw new Error("Missing required fields");
    }

    // @ts-ignore
    await prisma.serviceRequest.create({
        data: {
            name,
            phone,
            brief,
            service,
            budget,
            timeline,
            userId: session?.user?.id, // Save userId if logged in
        }
    });

    // Notify Admins
    try {
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true }
        });

        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                type: "request",
                title: "طلب خدمة جديد",
                content: `طلب جديد من ${name}: ${service}`,
                link: "/admin/requests"
            });
        }
    } catch (error) {
        console.error("Failed to notify admins", error);
    }
}

export async function getAdminRequests() {
    // @ts-ignore
    return await prisma.serviceRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true } // Include user details
    });
}

export async function updateRequestStatus(id: string, status: string) {
    // @ts-ignore
    await prisma.serviceRequest.update({
        where: { id },
        data: { status }
    });
    revalidatePath("/admin/requests");
}
