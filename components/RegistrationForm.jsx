"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useState } from "react";
import { signupUser } from "@/actions/auth-actions";

export function RegistrationForm({ className, ...props }) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, formAction] = useActionState(signupUser, {
    success: null,
    error: {},
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
                {state?.errors?.name && (
                  <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  placeholder="m@example.com"
                  required
                />
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={(e) =>
                    setFormValues({ ...formValues, password: e.target.value })
                  }
                  required
                />
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                {state?.errors?.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>

              {state?.success && (
                <p className="text-green-600 text-center">{state.message}</p>
              )}

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
