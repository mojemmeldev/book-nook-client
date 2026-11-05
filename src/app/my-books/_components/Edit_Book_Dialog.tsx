"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { authHeaders } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload-image";
import { BOOK_CATEGORIES, type ApiBook } from "@/lib/books";

type EditBookDialogProps = {
  book: ApiBook;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the updated book after a successful save. */
  onSaved: (book: ApiBook) => void;
};

/**
 * "Edit" form for a book the logged-in user added — prefilled with the
 * current data and saved through `PATCH /books/:id` (JWT protected).
 */
export function EditBookDialog({
  book,
  open,
  onOpenChange,
  onSaved,
}: EditBookDialogProps) {
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [category, setCategory] = useState(book.category || "Fiction");
  const [description, setDescription] = useState(book.description || "");
  const [totalCopies, setTotalCopies] = useState(
    String(book.totalCopies ?? 1),
  );
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const copies = Math.max(1, Number(totalCopies) || 1);
    setSaving(true);

    try {
      // Optional: only upload a new cover when a new file was picked.
      let imageUrl: string | undefined;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const headers = await authHeaders();
      const res = await fetch(
        `${API_BASE}/books/${book._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            title,
            author,
            category,
            description,
            totalCopies: copies,
            ...(imageUrl ? { image: imageUrl } : {}),
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Could not save your changes.");
      }

      toast.add({
        title: "Book updated",
        description: `“${title}” has been saved.`,
        type: "success",
      });

      onSaved({
        ...book,
        title,
        author,
        category,
        description,
        totalCopies: copies,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      onOpenChange(false);
    } catch (err) {
      toast.add({
        title: "Update failed",
        description:
          err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the details of “{book.title}”. Only fields you change are
            saved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Book Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-author">Author Name</Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "Fiction")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select book category" />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-copies">Total Copies</Label>
            <Input
              id="edit-copies"
              type="number"
              min={1}
              step={1}
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description">Short Description</Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-image">
              Book Image (optional — keeps the current cover if left empty)
            </Label>
            <div className="rounded-lg border border-dashed p-3">
              <Input
                id="edit-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {image && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-green-600">
                  <Upload className="size-4" aria-hidden="true" />
                  New image: {image.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="cursor-pointer">
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookDialog;
