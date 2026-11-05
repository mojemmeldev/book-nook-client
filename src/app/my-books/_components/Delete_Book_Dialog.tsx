"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { authHeaders } from "@/lib/auth-client";
import type { ApiBook } from "@/lib/books";

type DeleteBookDialogProps = {
  book: ApiBook;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the book was removed from the database. */
  onDeleted: (id: string) => void;
};

/**
 * Custom confirmation modal for deleting a book — the browser's native
 * `confirm()` is never used.
 */
export function DeleteBookDialog({
  book,
  open,
  onOpenChange,
  onDeleted,
}: DeleteBookDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const headers = await authHeaders();
      const res = await fetch(
        `${API_BASE}/books/${book._id}`,
        { method: "DELETE", headers },
      );

      if (!res.ok) {
        throw new Error("Could not delete this book.");
      }

      toast.add({
        title: "Book deleted",
        description: `“${book.title || "Untitled"}” has been removed.`,
        type: "success",
      });

      onDeleted(book._id);
      onOpenChange(false);
    } catch (err) {
      toast.add({
        title: "Delete failed",
        description:
          err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" aria-hidden="true" />
            Delete this book?
          </DialogTitle>
          <DialogDescription>
            “{book.title || "Untitled"}” will be permanently removed from
            BookNook. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer"
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            {deleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteBookDialog;
