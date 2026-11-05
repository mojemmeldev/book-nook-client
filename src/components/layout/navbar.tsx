"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "@/components/layout/user-dropdown";

const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/all-books", label: "All Books" },
  { href: "/about", label: "About" },
];

const privateNavLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const currentNavLinks = user
    ? [...publicNavLinks, ...privateNavLinks]
    : publicNavLinks;

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const linkClasses = (href: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive(href)
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
    );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">BookNook</span>
        </Link>

        {/* Desktop nav links */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {currentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right: Auth state */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Avatar + Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <UserDropdown user={user} size="sm" />}

          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t bg-background px-4 py-4 md:hidden sm:px-6"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {currentNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClasses(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
