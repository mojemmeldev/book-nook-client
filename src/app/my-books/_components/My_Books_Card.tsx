"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Pencil, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toBookCardData, type ApiBook } from "@/lib/books";
import EditBookDialog from "./Edit_Book_Dialog";
import DeleteBookDialog from "./Delete_Book_Dialog";

type MyBooksCardProps = {
  book: ApiBook;
  /** Called after a successful edit — keeps the parent list in sync. */
  onUpdated: (book: ApiBook) => void;
  /** Called after a successful delete — removes the card from the list. */
  onDeleted: (id: string) => void;
};

/**
 * Card for a book added by the logged-in user: cover, category, title,
 * author plus the Edit (prefilled form) and Delete (confirm modal) actions.
 */
export default function MyBooksCard({
  book,
  onUpdated,
  onDeleted,
}: MyBooksCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const display = toBookCardData(book);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/books/${display.id}`}
        className="relative block aspect-[2/3] overflow-hidden bg-muted"
        aria-label={`View details for ${display.title}`}
      >
        {display.image ? (
          <Image
            src={display.image}
            alt={`Cover of ${display.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            preload={false}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <BookOpen className="size-10" aria-hidden="true" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {display.category && (
          <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {display.category}
          </span>
        )}

        <h3 className="mt-2 line-clamp-1 font-semibold" title={display.title}>
          {display.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5" aria-hidden="true" />
          {display.author}
        </p>

        <div className="mt-auto pt-4">
          <Link
            href={`/books/${display.id}`}
            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            View Details
          </Link>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <EditBookDialog
        book={book}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSaved={onUpdated}
      />

      <DeleteBookDialog
        book={book}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={onDeleted}
      />
    </div>
  );
}
