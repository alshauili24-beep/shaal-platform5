import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Admin credentials as requested
const ADMIN_USER = {
    id: "admin-id-secure",
    name: "Shaal Admin",
    email: "SHAALADMIN", // Treating username as email field for simplicity in this provider
    password: "@adminSHAAIL2026",
    role: "ADMIN" as const,
};

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // 1. Check for Admin
                    if (email === ADMIN_USER.email) {
                        if (password === ADMIN_USER.password) {
                            // Sync Admin to DB to satisfy Foreign Keys
                            await prisma.user.upsert({
                                where: { id: ADMIN_USER.id },
                                update: {},
                                create: {
                                    id: ADMIN_USER.id,
                                    name: ADMIN_USER.name,
                                    email: ADMIN_USER.email,
                                    password: await bcrypt.hash(ADMIN_USER.password, 10),
                                    role: ADMIN_USER.role,
                                    image: null,
                                }
                            });
                            return ADMIN_USER;
                        }
                        return null;
                    }

                    // 2. Check for Database User
                    const user = await getUser(email);
                    if (!user) return null;

                    if (user.isBanned) {
                        throw new Error("Your account has been suspended by the administrator.");
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password || "");
                    if (passwordsMatch) {
                        // Cast role to match NextAuth type
                        return {
                            ...user,
                            role: user.role as "CLIENT" | "FREELANCER" | "ADMIN",
                            bio: user.bio || undefined,
                            phone: user.phone || undefined,
                        };
                    }
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});
