"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import ThemePicker from "./ThemePicker";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/library", label: "Library" },
  { href: "/stats", label: "Stats" },
];

export default function Nav() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-30 bg-warm-50/80 dark:bg-warm-900/80 backdrop-blur-md border-b border-warm-200 dark:border-warm-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <Link
          href="/"
          className="font-heading text-lg sm:text-2xl font-bold text-warm-800 dark:text-warm-100 shrink-0 hover:text-warm-600 dark:hover:text-warm-300 transition-colors"
        >
          My Book Tracker
        </Link>

        {/* Nav Links - only show when signed in */}
        {isSignedIn && (
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-warm-500 text-white dark:bg-warm-400 dark:text-warm-900"
                        : "text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right side: Theme Picker + Auth */}
        <div className="shrink-0 flex items-center gap-3">
          <ThemePicker />
          {isLoaded && isSignedIn && <UserButton />}
          {isLoaded && !isSignedIn && (
            <SignInButton>
              <button className="px-4 py-1.5 rounded-2xl text-sm font-medium bg-warm-600 hover:bg-warm-700 text-warm-50 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
