import { prisma } from "./db";

export async function checkEmailExists(email: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true } // Only select id to minimize data transfer
        });
        return !!user;
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                password: true,
                createdAt: true
            }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}
