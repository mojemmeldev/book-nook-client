"use client";

import { useState } from "react";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { CurrentUser } from "@/lib/current-user";

type BookingFormProps = {
  bookId: string;
  bookTitle: string;
  user: CurrentUser;
};

type FormErrors = Partial<Record<"borrowDate" | "returnDate", string>>;

/** `YYYY-MM-DD` in the browser's local timezone (avoids a UTC off-by-one). */
function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultBorrowDate(): string {
  return toISODate(new Date());
}

function defaultReturnDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return toISODate(date);
}

/**
 * Booking form shown in the right column of a book details page.
 *
 * Posts the booking to `POST ${NEXT_PUBLIC_SERVER_BASE_URL}/borrows`
 * (mirrors the Add Book form's POST to `/books`).
 */
export function BookingForm({ bookId, bookTitle, user }: BookingFormProps) {
  const [borrowDate, setBorrowDate] = useState(defaultBorrowDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = toISODate(new Date());

  function updateBorrowDate(value: string) {
    setBorrowDate(value);
    setErrors((prev) => ({ ...prev, borrowDate: undefined }));

    // Keep the return date valid when the borrow date moves past it.
    if (value && returnDate && returnDate <= value) {
      setReturnDate("");
      setErrors((prev) => ({ ...prev, returnDate: undefined }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!borrowDate) next.borrowDate = "Please choose a borrow date.";
    if (!returnDate) next.returnDate = "Please choose a return date.";
    if (borrowDate && returnDate && returnDate <= borrowDate) {
      next.returnDate = "Return date must be after the borrow date.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/borrows`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId,
            bookTitle,
            userName: user.name,
            email: user.email,
            borrowDate,
            returnDate,
            note: note.trim(),
            status: "borrowed",
            createdAt: new Date().toISOString(),
          }),
        },
      );

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json().catch(() => null);
      if (data && data.acknowledged === false) throw new Error("Not acknowledged");

      toast.add({
        title: "Booking confirmed!",
        description: `“${bookTitle}” is yours from ${borrowDate} until ${returnDate}.`,
        type: "success",
      });

      setNote("");
      setBorrowDate(defaultBorrowDate());
      setReturnDate(defaultReturnDate());
      setErrors({});
    } catch {
      toast.add({
        title: "Couldn't complete the booking",
        description: "Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-4" aria-hidden="true" />
          Booking Form
        </CardTitle>
        <CardDescription>
          Pick your dates and we&apos;ll hold this copy for you.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Book (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="booking-book">Book</Label>
            <Input
              id="booking-book"
              value={bookTitle}
              readOnly
              disabled
              className="bg-muted/60"
            />
          </div>

          {/* Logged-in user (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="booking-user">Booking for</Label>
            <div
              id="booking-user"
              className="rounded-lg border bg-muted/40 px-3 py-2.5"
            >
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-borrow-date">Borrow from</Label>
              <Input
                id="booking-borrow-date"
                name="borrowDate"
                type="date"
                min={today}
                value={borrowDate}
                onChange={(event) => updateBorrowDate(event.target.value)}
                aria-invalid={!!errors.borrowDate}
              />
              {errors.borrowDate && (
                <p className="text-sm text-destructive">{errors.borrowDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-return-date">Return by</Label>
              <Input
                id="booking-return-date"
                name="returnDate"
                type="date"
                min={borrowDate || today}
                value={returnDate}
                onChange={(event) => {
                  setReturnDate(event.target.value);
                  setErrors((prev) => ({ ...prev, returnDate: undefined }));
                }}
                aria-invalid={!!errors.returnDate}
              />
              {errors.returnDate && (
                <p className="text-sm text-destructive">{errors.returnDate}</p>
              )}
            </div>
          </div>

          {/* Note (optional) */}
          <div className="space-y-2">
            <Label htmlFor="booking-note">Note (optional)</Label>
            <Textarea
              id="booking-note"
              name="note"
              rows={3}
              placeholder="Anything the library should know..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-full px-6"
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Track this booking anytime under{" "}
            <span className="font-medium text-foreground">My Borrows</span>.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
