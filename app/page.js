import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { signOut } from "@/auth"; // Import signOut from your auth config

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo - Left side */}
          <Link href="/" className="flex items-center">
            <h1 className="ml-3 text-xl font-bold text-gray-900">
              Yeamazing Team
            </h1>
          </Link>

          {/* Auth Buttons - Right side */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              // Show Logout if user is authenticated
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </form>
            ) : (
              // Show Login/Get Started if not authenticated
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/registration"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Rest of your page content remains the same */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Collaborate with your team
            <br className="hidden md:block" /> effortlessly
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
            A minimal, focused workspace for your team to get things done
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={session?.user ? "/dashboard" : "/registration"}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {session?.user ? "Go to Dashboard" : "Start free trial"}
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 text-base font-medium text-blue-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Yeamazing Team. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
