"use server";
import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registrationSchema } from "@/utils/zod";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

export async function signupUser(prevState, formData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = registrationSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      errors,
    };
  }

  // Simulate a successful signup process
  const { name, email, password } = result.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
        errors: { email: ["User already exists"] },
      };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // In a real application, make sure to hash the password before saving it
      },
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during signup",
      errors: { email: ["Something went wrong. Please try again."] },
    };
  }
}

export const signInAction = async (data) => {
  const result = loginSchema.safeParse(data);

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
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirect: false,
  });
  redirect("/");
};
