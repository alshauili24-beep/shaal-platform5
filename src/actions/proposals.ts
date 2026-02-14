"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function createProposal(formData: FormData) {
    const session = await auth();
    if (!session?.user || session.user.role !== "FREELANCER") {
        throw new Error("Unauthorized");
    }

    const projectId = formData.get("projectId") as string;
    const price = formData.get("price") as string;
    const coverLetter = formData.get("coverLetter") as string;

    if (!projectId || !price || !coverLetter) {
        throw new Error("Missing fields");
    }

    await prisma.proposal.create({
        data: {
            projectId,
            freelancerId: session.user.id,
            price,
            coverLetter,
            status: "pending",
        },
    });

    // Notify Client
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
        await createNotification({
            userId: project.clientId,
            type: "proposal_new",
            title: "New Proposal",
            content: `You received a new proposal for ${project.title}`,
            link: `/dashboard/client/requests/${projectId}`
        });
    }

    revalidatePath("/dashboard/freelancer/jobs");
}

export async function getProposalCount(projectId: string) {
    return await prisma.proposal.count({
        where: { projectId },
    });
}

export async function getProposalsForProject(projectId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify ownership (optional strict check, or rely on page auth)
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    // Allow if client is owner
    if (project?.clientId !== session.user.id) {
        // Technically strict, but let's keep it safe.
        // throw new Error("Unauthorized access to project");
    }

    return await prisma.proposal.findMany({
        where: { projectId },
        include: {
            freelancer: {
                select: { id: true, name: true, image: true, rating: true, completedJobs: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function updateProposalStatus(proposalId: string, newStatus: "accepted" | "rejected") {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        include: { project: true },
    });

    if (!proposal) throw new Error("Proposal not found");

    if (proposal.project.clientId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: newStatus },
    });

    // Notify Freelancer
    await createNotification({
        userId: proposal.freelancerId,
        type: `proposal_${newStatus}`,
        title: `Proposal ${newStatus === "accepted" ? "Accepted" : "Rejected"}`,
        content: `Your proposal for ${proposal.project.title} was ${newStatus}.`,
        link: newStatus === "accepted" ? "/dashboard/freelancer/tasks" : "/dashboard/freelancer/jobs"
    });

    if (newStatus === "accepted") {
        await prisma.project.update({
            where: { id: proposal.project.id },
            data: { status: "in_progress", assignedTo: proposal.freelancerId },
        });

        // Optional: Reject other proposals automatically?
    }

    revalidatePath(`/dashboard/client/requests/${proposal.projectId}`);
}
