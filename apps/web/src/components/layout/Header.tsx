"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-primary-600">
            WebBuilder
          </Link>
          {isAuthenticated && (
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/templates"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Templates
              </Link>
              <Link
                href="/dashboard/sites"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                My Sites
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 sm:block">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
