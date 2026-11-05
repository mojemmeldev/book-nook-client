"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * A borrow document returned by `GET ${NEXT_PUBLIC_SERVER_BASE_URL}/books/borrows/:email`.
 * Saved by the "Borrow This Book" form on the Book Details page.
 */
export type ApiBorrow = {
  _id: string;
  bookId?: string;
  bookTitle?: string;
  bookImage?: string;
  userName?: string;
  email?: string;
  /** "YYYY-MM-DD" */
  borrowDate?: string;
  /** "YYYY-MM-DD" */
  returnDate?: string;
  status?: string;
};

type BorrowRowProps = {
  borrow: ApiBorrow;
  /** Called after the borrow was successfully removed (returned). */
  onReturned: (id: string) => void;
};

function My_Borrows_Row({ borrow, onReturned }: BorrowRowProps) {
  const [isReturning, setIsReturning] = useState(false);

  const title = borrow.bookTitle?.trim() || "Untitled";
  const bookId = borrow.bookId;

  async function handleReturn() {
    setIsReturning(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/books/borrows/${borrow._id}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      toast.add({
        title: "Book returned",
        description: `“${title}” has been removed from your borrows.`,
        type: "success",
      });

      onReturned(borrow._id);
    } catch {
      toast.add({
        title: "Couldn't return the book",
        description: "Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <TableRow>
      {/* Image */}
      <TableCell>
        <div className="relative h-16 w-12 overflow-hidden rounded-md bg-muted">
          <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <BookOpen
              className="size-4"
              aria-hidden="true"
            />
          </span>
          {borrow.bookImage && (
            <Image
              src={borrow.bookImage}
              alt={`Cover of ${title}`}
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
        </div>
      </TableCell>

      {/* Title */}
      <TableCell className="max-w-xs">
        <div className="flex flex-col gap-0.5 whitespace-normal">
          <span className="line-clamp-2 font-medium" title={title}>
            {bookId ? (
              <Link
                href={`/all-books/${bookId}`}
                className="hover:underline"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {borrow.userName?.trim() || "Unknown reader"}
          </span>
        </div>
      </TableCell>

      {/* Borrow Date */}
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {borrow.borrowDate?.trim() || "—"}
      </TableCell>

      {/* Return Date */}
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {borrow.returnDate?.trim() || "—"}
      </TableCell>

      {/* Return Book */}
      <TableCell className="text-right">
        <Button
          variant="destructive"
          size="sm"
          disabled={isReturning}
          onClick={handleReturn}
          className="cursor-pointer"
        >
          {isReturning && (
            <Loader2Icon
              className="animate-spin"
              aria-hidden="true"
            />
          )}
          {isReturning ? "Returning..." : "Return Book"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

type MyBorrowsTableProps = {
  borrows: ApiBorrow[];
  /** Called after the borrow was successfully removed (returned). */
  onReturned: (id: string) => void;
};

/**
 * Table of the logged-in user's borrowed books:
 * Image, Title, Borrow Date, Return Date and a "Return Book" button.
 */
export default function My_Borrows_Table({
  borrows,
  onReturned,
}: MyBorrowsTableProps) {
  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Borrow Date</TableHead>
          <TableHead>Return Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrows.map((borrow) => (
          <My_Borrows_Row
            key={borrow._id}
            borrow={borrow}
            onReturned={onReturned}
          />
        ))}
      </TableBody>
    </Table>
  );
}
