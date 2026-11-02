import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import type { Book } from "@/lib/books";

type BookCardProps = {
  book: Book;
};

/** Card used in New Arrivals (and reusable on the All Books page later). */
export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/all-books/${book.id}`}
        className="relative block aspect-[2/3] overflow-hidden bg-muted"
        aria-label={`View details for ${book.title}`}
      >
        <Image
          src={book.image}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
          {book.category}
        </span>

        <h3 className="mt-2 line-clamp-1 font-semibold" title={book.title}>
          {book.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5" aria-hidden="true" />
          {book.author}
        </p>

        <Link
          href={`/all-books/${book.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
