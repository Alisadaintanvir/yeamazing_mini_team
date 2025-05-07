import { signIn } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { loginSchema } from "@/utils/zod";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";

async function handler(request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body); // Validate the request body against the login schema

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      errors,
      message: "Invalid credentials",
    };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return NextResponse.json(
            {
              success: false,
              message: "Invalid credentials!",
            },
            { status: 401 }
          );

        default:
          return NextResponse.json(
            {
              success: false,
              message: "Something went wrong!",
            },
            { status: 500 }
          );
      }
    }
    throw error;
  }
}

export const POST = withRateLimit(handler, "auth");
