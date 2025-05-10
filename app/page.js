import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { signOut } from "@/auth"; // Import signOut from your auth config

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-50 to-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo - Left side */}
          <Link href="/" className="flex items-center">
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
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
                  className="group relative px-4 py-2 text-sm font-medium text-gray-700 bg-white/30 hover:bg-white/50 rounded-md border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </span>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Add padding to main content to account for fixed header */}
        <div className="pt-16">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col items-center text-center relative">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Collaborate with your team
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  effortlessly
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl leading-relaxed">
                A minimal, focused workspace for your team to get things done
                together. Streamline your workflow and boost productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href={session?.user ? "/dashboard" : "/registration"}
                  className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {session?.user ? "Go to Dashboard" : "Start free trial"}
                </Link>
                <Link
                  href="/features"
                  className="px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-100 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Learn more
                </Link>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Easy Collaboration
                  </h3>
                  <p className="text-gray-600">
                    Work together seamlessly with real-time updates and shared
                    workspaces.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Task Management
                  </h3>
                  <p className="text-gray-600">
                    Stay organized with intuitive task tracking and progress
                    monitoring.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Boost Productivity
                  </h3>
                  <p className="text-gray-600">
                    Streamline your workflow and achieve more with less effort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Yeamazing Team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
