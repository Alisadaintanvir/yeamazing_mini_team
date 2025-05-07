"use server";

import { prisma } from "@/lib/prisma";

export const defaultUserService = async (userId) => {
  try {
    // Create default team
    await prisma.team.create({
      data: {
        name: "Development Team",
        description: "Your personal default team",
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: true,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
