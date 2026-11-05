"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { authHeaders, useSession } from "@/lib/auth-client";
import My_Borrows_Table, { type ApiBorrow } from "./_components/My_Borrows_Table";

export default function  MyBorrowsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<ApiBorrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Load the borrows that belong to the logged-in user from the backend.
  // Uses GET /books/borrows/:email — the server matches on the `email` field
  // that the booking form stores with each borrow. The better-auth JWT is
  // sent as a Bearer token so the backend can verify the session.
  useEffect(() => {
    if (!user?.email) {
      return;
    }

    (async () => {
      const headers = await authHeaders();
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/books/borrows/${encodeURIComponent(
          user.email,
        )}`,
        {
          cache: "no-store",
          headers,
        },
      )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load borrows");
        const data = await res.json();
        setBorrows(Array.isArray(data) ? (data as ApiBorrow[]) : []);
        setFailed(false);
      })
      .catch(() => {
        setFailed(true);
        setBorrows([]);
      })
      .finally(() => setIsLoading(false));
    })();
  }, [user?.email]);

  function handleReturned(id: string) {
    setBorrows((prev) => prev.filter((borrow) => borrow._id !== id));
  }

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
        <h1 className="text-3xl font-bold tracking-tight">My Borrows</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to see the books you have borrowed from BookNook.
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
      <h1 className="text-3xl font-bold tracking-tight">My Borrows</h1>
      <p className="mt-2 text-muted-foreground">
        Books you have borrowed, and the days you have left to return them.
      </p>

      {failed && (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Couldn&apos;t load your borrows right now — check that the backend
          server is running.
        </div>
      )}

      {!failed && isLoading && borrows.length === 0 && (
        <div className="mt-8 flex justify-center items-center h-64">
          <div className="h-20 w-20">
            <Spinner />
          </div>
        </div>
      )}

      {!failed && !isLoading && borrows.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          You haven&apos;t borrowed any books yet.{" "}
          <Link
            href="/all-books"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Browse all books
          </Link>
        </div>
      )}

      {!failed && !isLoading && borrows.length > 0 && (
        <My_Borrows_Table
          borrows={borrows}
          onReturned={handleReturned}
        />
      )}
    </div>
  );
}
