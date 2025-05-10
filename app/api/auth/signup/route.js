import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRateLimit } from "@/lib/withRateLimit";
import { registrationSchema } from "@/utils/zod";
import { NextResponse } from "next/server";

async function signupHandler(req) {
  const body = await req.json();
  const result = registrationSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      errors,
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // In a real application, make sure to hash the password before saving it
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during signup",
      },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(signupHandler, "auth");
