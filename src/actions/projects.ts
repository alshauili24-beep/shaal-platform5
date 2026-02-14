"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { createNotification } from "./notifications";

export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const service = formData.get("service") as string;
    const budget = formData.get("budget") as string;
    const deadline = formData.get("deadline") as string;
    const details = formData.get("details") as string;

    if (!title || !service || !budget || !deadline) {
        throw new Error("Missing fields");
    }

    const project = await prisma.project.create({
        data: {
            title,
            service,
            budget,
            deadline,
            details,
            status: "open",
            clientId: session.user.id,
        },
    });

    // Notify all Freelancers
    // This could be heavy if there are many users, but fine for V1.
    const freelancers = await prisma.user.findMany({
        where: { role: "FREELANCER" },
        select: { id: true }
    });

    for (const f of freelancers) {
        await createNotification({
            userId: f.id,
            type: "project_new",
            title: "New Project Available",
            content: `New project posted: ${title} (${budget})`,
            link: `/dashboard/freelancer/jobs` // Or specific project link if we have one? Find Work page is good.
        });
    }

    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/client/requests");
}

export async function getClientProjects() {
    const session = await auth();
    if (!session?.user) return [];

    return await prisma.project.findMany({
        where: { clientId: session.user.id },
        include: { proposals: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getOpenProjects() {
    return await prisma.project.findMany({
        where: { status: "open" },
        include: { client: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
    });
}


export async function getFreelancerTasks() {
    const session = await auth();
    if (!session?.user) return [];

    return await prisma.project.findMany({
        where: { assignedTo: session.user.id },
        include: { client: { select: { name: true, image: true, email: true } } },
        orderBy: { updatedAt: "desc" },
    });
}

export async function getProjectById(projectId: string) {
    const session = await auth();
    if (!session?.user) return null;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    // Only allow owner to see it for editing? 
    // Or reuse for details page? Details page needs it too.
    // For now, return it. Validation happens in update.
    return project;
}

export async function updateProject(projectId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") throw new Error("Unauthorized");

    const existing = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existing || existing.clientId !== session.user.id) throw new Error("Unauthorized");

    await prisma.project.update({
        where: { id: projectId },
        data: {
            title: formData.get("title") as string,
            service: formData.get("service") as string,
            budget: formData.get("budget") as string,
            deadline: formData.get("deadline") as string,
            details: formData.get("details") as string,
        },
    });

    revalidatePath(`/dashboard/client/requests/${projectId}`);
    revalidatePath("/dashboard/client/requests");
}
