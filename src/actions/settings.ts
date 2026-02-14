"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;

    // Optional: Image URL handling if we had upload logic
    // const image = formData.get("image") as string; 

    if (!name) throw new Error("Name is required");

    await prisma.user.update({
        where: { email: session.user.email },
        // @ts-ignore
        data: { name, phone, bio },
    });

    revalidatePath("/dashboard/client/settings");
    revalidatePath("/dashboard/freelancer/settings");
    revalidatePath("/", "layout"); // Update navbar name
}

export async function changePassword(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || !user.password) throw new Error("User not found");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        throw new Error("Incorrect current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedPassword },
    });
}
