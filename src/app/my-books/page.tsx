"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { authHeaders, useSession } from "@/lib/auth-client";
import { BookCard } from "@/app/all-books/_component/book-card";
import { toBookCardData, type ApiBook, type BookCardData } from "@/lib/books";
import My_Books_Card from "./_components/My_Books_Card";

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [books, setBooks] = useState<BookCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Load every book from the backend, then keep only the ones added by the
  // logged-in user (matched by creatorEmail).
  useEffect(() => {
    if (!user?.email) {
      return;
    }

    (async () => {
      const headers = await authHeaders();
      fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/books`, {
        cache: "no-store",
        headers,
      })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load books");
        const data = await res.json();
        const allBooks = Array.isArray(data) ? (data as ApiBook[]) : [];

        const myBooks = allBooks
          .filter(
            (book) =>
              (book as ApiBook & { creatorEmail?: string }).creatorEmail ===
              user.email,
          )
          .map(toBookCardData);

        setBooks(myBooks);
        setFailed(false);
      })
      .catch(() => {
        setFailed(true);
        setBooks([]);
      })
      .finally(() => setIsLoading(false));
    })();
  }, [user?.email]);

  // Session still loading
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="h-20 w-20">
          <Spinner />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to see the books you have added to BookNook.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
      <p className="mt-2 text-muted-foreground">
        The books you have added to BookNook.
      </p>

      {failed && (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Couldn&apos;t load your books right now — check that the backend server
          is running.
        </div>
      )}

      {!failed && isLoading && books.length === 0 && (
        <div className="mt-8 flex justify-center items-center h-64">
          <div className="h-20 w-20">
            <Spinner />
          </div>
        </div>
      )}

      {!failed && !isLoading && books.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          You haven&apos;t added any books yet.{" "}
          <Link
            href="/add-book"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Add your first book
          </Link>
        </div>
      )}

      {!failed && !isLoading && books.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <My_Books_Card key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
