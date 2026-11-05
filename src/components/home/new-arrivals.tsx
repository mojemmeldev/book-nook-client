import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookCard } from "@/app/books/_component/book-card";
import { API_BASE } from "@/lib/api";
import { toBookCardData, type ApiBook, type BookCardData } from "@/lib/books";
import { SectionHeading } from "@/components/section-heading";

/** Newest books first — the backend sorts by `createdAt` desc and limits. */
const LATEST_LIMIT = 6;

async function loadLatestBooks(): Promise<{
  books: BookCardData[];
  failed: boolean;
}> {
  try {
    const res = await fetch(
      `${API_BASE}/books?limit=${LATEST_LIMIT}`,
      { cache: "no-store" },
    );

    if (!res.ok) return { books: [], failed: true };

    const data: unknown = await res.json();
    const allBooks = Array.isArray(data) ? (data as ApiBook[]) : [];

    // Safety net: never show more than the newest 6, even if the backend
    // ignores the `limit` parameter.
    return {
      books: allBooks.slice(0, LATEST_LIMIT).map(toBookCardData),
      failed: false,
    };
  } catch {
    return { books: [], failed: true };
  }
}

export async function NewArrivals() {
  const { books, failed } = await loadLatestBooks();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        title="New Arrivals"
        subtitle="The latest books added to the BookNook shelves."
      />

      {failed ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Couldn&apos;t load the latest books right now — check that the
          backend server is running.
        </div>
      ) : books.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No books yet — the first new arrival could be yours.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          See All Books
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
