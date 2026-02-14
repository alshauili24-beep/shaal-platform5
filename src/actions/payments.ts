"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function createMilestone(projectId: string, title: string, amount: number, dueDate?: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.clientId !== session.user.id) throw new Error("Unauthorized");

    await prisma.milestone.create({
        data: {
            projectId,
            title,
            amount,
            status: "pending",
            dueDate: dueDate ? new Date(dueDate) : null
        }
    });

    revalidatePath(`/dashboard/client/requests/${projectId}`);
}

export async function getProjectMilestones(projectId: string) {
    // Auth check relaxed for read (freelancer needs to see it)
    const session = await auth();
    if (!session?.user) return [];

    return await prisma.milestone.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" }
    });
}

// Simulates Client paying into Escrow
export async function fundMilestone(milestoneId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") throw new Error("Unauthorized");

    const milestone = await prisma.milestone.findUnique({
        where: { id: milestoneId },
        include: { project: true }
    });

    if (!milestone) throw new Error("Not found");
    if (milestone.project.clientId !== session.user.id) throw new Error("Unauthorized");

    // MOCK PAYMENT PROCESS
    // In real app: Create Stripe Checkout Session here.

    // Simulate updating DB directly
    await prisma.milestone.update({
        where: { id: milestoneId },
        data: { status: "funded" }
    });

    // Record Transaction (Include 10% Platform Fee)
    const totalAmount = milestone.amount * 1.10;

    await prisma.transaction.create({
        data: {
            amount: totalAmount,
            type: "deposit",
            status: "success",
            userId: session.user.id,
            milestoneId
        }
    });

    // Notify Freelancer
    if (milestone.project.assignedTo) {
        await createNotification({
            userId: milestone.project.assignedTo,
            type: "milestone_funded",
            title: "Milestone Funded",
            content: `Funds for "${milestone.title}" have been deposited. You can start working.`,
            link: `/dashboard/freelancer/tasks` // Link to tasks?
        });
    }

    revalidatePath(`/dashboard/client/requests/${milestone.projectId}`);
}

// Simulates Client releasing funds to Freelancer
export async function releaseMilestone(milestoneId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") throw new Error("Unauthorized");

    const milestone = await prisma.milestone.findUnique({
        where: { id: milestoneId },
        include: { project: true }
    });

    if (!milestone) throw new Error("Not found");
    // Ensure it was funded? or allow direct pay? Let's say needs funded.
    if (milestone.status !== "funded") throw new Error("Milestone must be funded first");

    await prisma.milestone.update({
        where: { id: milestoneId },
        data: { status: "paid" }
    });

    // Transaction for Payout (Virtual)
    if (milestone.project.assignedTo) {
        await prisma.transaction.create({
            data: {
                amount: milestone.amount,
                type: "payout",
                status: "success",
                userId: milestone.project.assignedTo,
                milestoneId
            }
        });

        await createNotification({
            userId: milestone.project.assignedTo,
            type: "milestone_paid",
            title: "Payment Released",
            content: `Payment of $${milestone.amount} for "${milestone.title}" has been released to you.`,
            link: `/dashboard/freelancer/financials` // Assuming a financials page exists or just tasks
        });
    }

    revalidatePath(`/dashboard/client/requests/${milestone.projectId}`);
}

// Freelancer requests release
export async function requestMilestoneRelease(milestoneId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const milestone = await prisma.milestone.findUnique({
        where: { id: milestoneId },
        include: { project: true }
    });

    // Verify freelancer is assigned
    if (milestone?.project.assignedTo !== session.user.id) throw new Error("Unauthorized");

    // Notify Client
    await createNotification({
        userId: milestone.project.clientId,
        type: "milestone_request",
        title: "Release Requested",
        content: `Freelancer requested payment release for "${milestone.title}".`,
        link: `/dashboard/client/requests/${milestone.projectId}`
    });

    // We could add a "reviewing" status, but let's keep it simple.
}
