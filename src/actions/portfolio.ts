"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Helper to save file locally
async function saveFile(file: File | null, folder: string): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const name = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const path = join(process.cwd(), "public", "uploads", folder);

    // Ensure directory exists
    await mkdir(path, { recursive: true });

    // Write file
    await writeFile(join(path, name), buffer);

    return `/uploads/${folder}/${name}`;
}

export async function addPortfolioItem(formData: FormData) {
    const session = await auth();
    if (!session?.user || session.user.role !== "FREELANCER") {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Handle File Uploads
    const imageFile = formData.get("imageFile") as File;
    const videoFile = formData.get("videoFile") as File;
    const attachmentFile = formData.get("attachmentFile") as File;

    const imageUrl = await saveFile(imageFile, "images");
    const videoUrl = await saveFile(videoFile, "videos");
    const attachmentUrl = await saveFile(attachmentFile, "files");

    // Fallback to URL input if no file uploaded
    const finalImageUrl = imageUrl || (formData.get("imageUrl") as string);

    if (!title) {
        throw new Error("Title is required");
    }

    try {
        console.log("Saving Portfolio Item:", { title, imageUrl: finalImageUrl, videoUrl, attachmentUrl });
        await prisma.portfolioItem.create({
            data: {
                title,
                description,
                imageUrl: finalImageUrl,
                // @ts-ignore
                videoUrl,
                // @ts-ignore
                attachmentUrl,
                freelancerId: session.user.id,
            },
        });
        console.log("Portfolio Item Saved Successfully");
    } catch (error) {
        console.error("Error saving portfolio item:", error);
        throw new Error("Failed to save portfolio item");
    }

    revalidatePath("/dashboard/freelancer/portfolio");
}

export async function getPortfolioItems() {
    const session = await auth();
    if (!session?.user) return [];

    return await prisma.portfolioItem.findMany({
        where: { freelancerId: session.user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function deletePortfolioItem(itemId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
    if (item?.freelancerId !== session.user.id) throw new Error("Unauthorized");

    await prisma.portfolioItem.delete({ where: { id: itemId } });
    revalidatePath("/dashboard/freelancer/portfolio");
}
