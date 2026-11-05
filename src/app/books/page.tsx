import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { BookCard } from "@/app/books/_component/book-card";
import { toBookCardData, type ApiBook, type BookCardData } from "@/lib/books";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata = {
  title: "All Books",
};

/** Load books from the backend â€” never throws, so the page can show a fallback. */
async function loadBooks(): Promise<{
  books: BookCardData[];
  failed: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE}/books`, {
      cache: "no-store",
    });

    if (!res.ok) return { books: [], failed: true };

    const booksData: unknown = await res.json();
    const books = Array.isArray(booksData) ? (booksData as ApiBook[]) : [];

    return { books: books.map(toBookCardData), failed: false };
  } 
  catch {
    return { books: [], failed: true };
  }
}

export default async function AllBooksPage() {
  const { books, failed } = await loadBooks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">All Books</h1>
      <p className="mt-2 text-muted-foreground">
        Browse every book in the BookNook library.
      </p>

      {failed ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Couldn&apos;t load books right now â€” check that the backend server is
          running.
        </div>
      ) : books.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No books yet.{" "}
          <Link
            href="/add-book"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Add the first book
          </Link>
        </div>
      ) : (
        <FadeIn className="mt-8">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
