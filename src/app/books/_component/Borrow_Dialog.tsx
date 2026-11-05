"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Loader2Icon, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { authHeaders, useSession } from "@/lib/auth-client";
import type { Book } from "./Book-Details";

/** Borrow period: the book must be returned 7 days after borrowing. */
const BORROW_DAYS = 7;

/** "YYYY-MM-DD" so the My Borrows table can read it back without timezone drift. */
function toDateInput(date: Date): string {
    return date.toISOString().slice(0, 10);
}

const BorrowDialog = ({ book }: { book: Book }) => {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Borrow period is computed when the dialog opens (not during render,
     * so the component stays free of impure calls).
     */
    const [dates, setDates] = useState<{ borrow: string; return: string } | null>(
        null,
    );

    /** Copies left to borrow — 0 means the book is out of stock. */
    const copiesLeft = book.availableCopies ?? book.totalCopies ?? 1;
    const isUnavailable = copiesLeft <= 0;

    const borrowDate = dates?.borrow ?? "";
    const returnDate = dates?.return ?? "";

    /** Signed-out visitors are sent to Login and brought back after signing in. */
    function handleBorrowClick() {
        if (isPending) return;

        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        setDates({
            borrow: toDateInput(new Date()),
            return: toDateInput(
                new Date(Date.now() + BORROW_DAYS * 24 * 60 * 60 * 1000),
            ),
        });
        setIsOpen(true);
    }

    async function handleConfirmBorrow() {
        if (!user || !dates) return;

        setIsSubmitting(true);

        try {
            // JWT — the backend verifies the Better Auth token on this route.
            const headers = await authHeaders();

            const res = await fetch(
                `${API_BASE}/books/borrows`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                    body: JSON.stringify({
                        bookId: book._id,
                        bookTitle: book.title,
                        bookImage: book.image,
                        userName: user.name || "",
                        email: user.email,
                        borrowDate,
                        returnDate,
                        status: "borrowed",
                    }),
                },
            );

            if (!res.ok) {
                // The backend explains why (409 = already borrowed, 401 = no
                // session, 403 = no copies left, …).
                let message = `Request failed with status ${res.status}`;
                try {
                    const data = (await res.json()) as {
                        message?: string;
                        error?: string;
                    };
                    message = data.message || data.error || message;
                } catch {
                    // Non-JSON body — keep the status message.
                }

                if (res.status === 401) {
                    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
                }

                throw new Error(message);
            }

            toast.add({
                title: "Book borrowed",
                description: `“${book.title}” was added to your borrows — please return it by ${returnDate}.`,
                type: "success",
            });

            setIsOpen(false);
            // Refresh so the copies counter on the page updates immediately.
            router.refresh();
        } catch (err) {
            toast.add({
                title: "Couldn't borrow the book",
                description:
                    err instanceof Error
                        ? err.message
                        : "Please try again in a moment.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open, event) => {
                // Ignore outside clicks/Escape while submitting.
                if (!open && event?.reason === "outside-press" && isSubmitting) {
                    return;
                }
                setIsOpen(open);
            }}
        >
            {/* Borrow Button */}
            <Button
                size="lg"
                className="mt-4 w-full cursor-pointer"
                onClick={handleBorrowClick}
                disabled={isPending || isUnavailable}
            >
                <BookOpen className="mr-2 h-5 w-5" />
                {isUnavailable ? "Not Available" : "Borrow This Book"}
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl font-bold">
                        Borrow This Book
                    </DialogTitle>
                    <DialogDescription>
                        You are borrowing “{book.title}”. Please return it by{" "}
                        {returnDate}.
                    </DialogDescription>
                </DialogHeader>

                {user ? (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleConfirmBorrow();
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="borrow-user-name">
                                User Name
                            </Label>
                            <Input
                                id="borrow-user-name"
                                value={user.name || ""}
                                readOnly
                                className="cursor-default opacity-80"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="borrow-user-email">
                                User Email
                            </Label>
                            <Input
                                id="borrow-user-email"
                                type="email"
                                value={user.email || ""}
                                readOnly
                                className="cursor-default opacity-80"
                            />
                        </div>

                        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                            Borrowed on <b>{borrowDate}</b> — due back{" "}
                            <b>{returnDate}</b>.
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer"
                            >
                                {isSubmitting && (
                                    <Loader2Icon
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                {isSubmitting
                                    ? "Borrowing..."
                                    : "Confirm Borrow"}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="grid gap-4">
                        <p className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                            <Lock
                                className="mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            />
                            Please sign in to borrow books — your name and
                            email will be attached to the borrow.
                        </p>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Link
                            href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                            className="sm:w-auto"
                          >
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full cursor-pointer"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BorrowDialog;
