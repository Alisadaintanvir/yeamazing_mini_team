"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Search, Mail } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 text */}
        <div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="h-1 w-full bg-primary/30 rounded-full mt-2" />
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/")} className="gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              (window.location.href = "mailto:support@example.com")
            }
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
