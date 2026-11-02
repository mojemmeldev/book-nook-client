import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestBooks } from "@/lib/books";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";

export function NewArrivals() {
  // New books first: db.books.find().sort({ createdAt: -1 }).limit(6)
  const latestBooks = getLatestBooks(6);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        title="New Arrivals"
        subtitle="The latest books added to the BookNook shelves."
      />

      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3">
        {latestBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/all-books"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          See All Books
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
