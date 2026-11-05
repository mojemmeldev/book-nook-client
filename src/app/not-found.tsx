import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

/**
 * Custom 404 page — shown for any route that does not exist.
 * (A `not-found.tsx` at the app root is picked up automatically by Next.)
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="size-8 text-muted-foreground" aria-hidden="true" />
      </span>

      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Error 404
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        This page slipped off the shelf
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist, was moved, or is
        temporarily unavailable.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Home className="size-4" aria-hidden="true" />
        Back to Home
      </Link>
    </section>
  );
}
