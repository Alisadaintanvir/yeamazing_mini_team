"use client";

import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-50/80 to-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo - Left side */}
        <Link href="/" className="flex items-center">
          <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Yeamazing Team
          </h1>
        </Link>
      </div>
    </header>
  );
}
