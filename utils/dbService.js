import { comparePassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getUserFromDB = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user from DB:", error);
    throw new Error("Database error");
  }
};
