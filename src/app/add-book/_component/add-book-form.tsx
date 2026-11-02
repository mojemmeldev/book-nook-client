"use client";

import { useEffect, useRef, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption, } from "@/components/ui/native-select";
import { BOOK_CATEGORIES, type BookCategory } from "@/lib/books";
import type { CurrentUser } from "@/lib/current-user";
import { toast } from "@/components/ui/toast"

type AddBookFormProps = {
  user: CurrentUser;
};

type FormErrors = Partial<
  Record<"title" | "author" | "category" | "image" | "description", string>
>;

const EMPTY_FORM = {
  title: "",
  author: "",
  category: "" as BookCategory | "",
  description: "",
};

export function AddBookForm({ user }: AddBookFormProps) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke the object URL when the preview changes or the form unmounts.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!form.title.trim()) next.title = "Book title is required.";
    if (!form.author.trim()) next.author = "Author name is required.";
    if (!form.category) next.category = "Please choose a category.";
    if (!image) next.image = "Please upload a book image.";
    if (!form.description.trim())
      next.description = "Short description is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    console.log(form);
    const formData = new FormData(form);
    const books=Object.fromEntries(formData.entries());
   

    const result = await fetch (`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/books`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(books),
    })
    const data=await result.json();
     console.log(data);

     if (data.acknowledged){
      toast.add({
        title:"Book added successfully!",
        type:"success",
      })
     
     }
  }






  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Book Title */}
        <div className="space-y-2">
          <Label htmlFor="book-title">Book Title</Label>
          <Input
            id="book-title"
            name="title"
            placeholder="e.g. The Alchemist"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Author Name */}
        <div className="space-y-2">
          <Label htmlFor="book-author">Author Name</Label>
          <Input
            id="book-author"
            name="author"
            placeholder="e.g. Paulo Coelho"
            value={form.author}
            onChange={(event) => update("author", event.target.value)}
            aria-invalid={!!errors.author}
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="book-category">Category</Label>
          <NativeSelect
            id="book-category"
            name="category"
            className="w-full"
            value={form.category}
            onChange={(event) =>
              update("category", event.target.value as BookCategory)
            }
            aria-invalid={!!errors.category}
          >
            <NativeSelectOption value="" disabled>
              Select a category
            </NativeSelectOption>
            {BOOK_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>

        {/* Book Image */}
        <div className="space-y-2">
          <Label htmlFor="book-image">Book Image</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="book-image"
              name="image"
              type="file"
              accept="image/*"
              className="file:text-muted-foreground"
              onChange={handleImageChange}
              aria-invalid={!!errors.image}
            />
            {image && (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={clearImage}
                aria-label="Remove selected image"
              >
                <XIcon />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Book image preview"
                className="size-14 rounded-md border object-cover"
              />
            )}
            <p className="text-xs text-muted-foreground">
              <UploadIcon className="inline size-3.5 align-text-bottom" /> PNG
              or JPG, up to 5 MB.
            </p>
          </div>
          {errors.image && (
            <p className="text-sm text-destructive">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="book-description">Short Description</Label>
        <Textarea
          id="book-description"
          name="description"
          rows={4}
          placeholder="A short summary of the book..."
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Logged-in user (read-only) */}
      <div className="grid gap-5 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="book-user-name">User Name</Label>
          <Input
            id="book-user-name"
            name="userName"
            value={user.name}
            readOnly
            disabled
            className="bg-muted/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="book-user-email">Email</Label>
          <Input
            id="book-user-email"
            name="email"
            type="email"
            value={user.email}
            readOnly
            disabled
            className="bg-muted/60"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-9 px-6">
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        {isSubmitting ? "Adding..." : "Add Book"}
      </Button>
    </form>
  );
}
