import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { getBookById } from "@/lib/books";

export const metadata = {
  title: "Book Details",
};

export default async function BookDetailsPage(
  props: PageProps<"/all-books/[id]">,
) {
  const { id } = await props.params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/all-books"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to All Books
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border bg-muted">
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {book.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            {book.title}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <User className="size-4" aria-hidden="true" />
            {book.author}
          </p>

          <p className="mt-6 leading-relaxed">{book.description}</p>

          <div className="mt-8 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Available</span> — borrow
            logic will be connected here later.
          </div>

          {/* TODO: wire this up to the borrow action later */}
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Borrow Book
          </button>
        </div>
      </div>
    </div>
  );
}
