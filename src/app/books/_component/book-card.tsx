import Image from "next/image";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import type { BookCardData } from "@/lib/books";

type BookCardProps = {
  book: BookCardData;
};

/**
 * Reusable book card â€” cover, category, title and author.
 *
 * Used by New Arrivals and the All Books grid. Accepts any book shaped like
 * `BookCardData` (dummy books satisfy it directly; backend books go through
 * `toBookCardData`), and falls back to a placeholder when no cover exists.
 */
export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/books/${book.id}`}
        className="relative block aspect-[2/3] overflow-hidden bg-muted"
        aria-label={`View details for ${book.title}`}
      >
        {book.image ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            preload={false}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <BookOpen
              className="size-10"
              aria-hidden="true"
            />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {book.category && (
          <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {book.category}
          </span>
        )}

        <h3 className="mt-2 line-clamp-1 font-semibold" title={book.title}>
          {book.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5" aria-hidden="true" />
          {book.author}
        </p>

        <Link
          href={`/books/${book.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
