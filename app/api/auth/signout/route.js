import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await signOut({ redirect: false }); // Sign out the user

  return NextResponse.redirect("/"); // Redirect to the login page
}
