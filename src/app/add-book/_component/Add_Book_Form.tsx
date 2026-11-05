
"use client";

import React, { useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { BookPlus, Loader2, Upload } from "lucide-react";

import { toast } from "@/components/ui/toast"
import { authHeaders, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload-image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";



const Add_Book_Form = () => {


    const [formData, setFormData] = useState({ title: "", author: "", category: "", description: "", totalCopies: "1", });

    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const { data: session, isPending } = useSession();
    const user = session?.user;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.email) return;

        if (!image) {
            toast.add({ title: "Please select a book cover image.", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const form = e.currentTarget;
            const bookData = new FormData(form);

            const totalCopies = Math.max(1, Number(bookData.get("totalCopies")) || 1);
            const book = {
                title: bookData.get("title") as string,
                author: bookData.get("author") as string,
                category: bookData.get("category") as string,
                description: bookData.get("description") as string,
                totalCopies,
                availableCopies: totalCopies,
                // Date the book was added.
                createdAt: new Date().toISOString(),
                userName: user.name || "",
                userEmail: user.email,
                creatorEmail: user.email,
            };

            // Upload the cover image first, then send its URL with the book.
            const imageUrl = await uploadImage(image);

            // JWT — the backend verifies the Better Auth token on this route.
            const headers = await authHeaders();

            const result = await fetch(`${API_BASE}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: JSON.stringify({ ...book, image: imageUrl }),
            },
            );

            if (!result.ok) {
                throw new Error("Failed to add book.");
            }

            const data = await result.json();

            console.log(book, "book");
            console.log(data);

            toast.add({
                title: "Book added",
                description: `“${book.title}” is now in the BookNook library.`,
                type: "success",
            });

            // Reset the form after a successful add.
            form.reset();
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setFormData({ title: "", author: "", category: "", description: "", totalCopies: "1" });
        }
        catch (err) {
            if (err instanceof Error) {
                toast.add({ title: err.message, type: "error" });
            } else {
                toast.add({ title: "Something went wrong adding the book.", type: "error" });
            }
        }
        finally {
            setLoading(false);
        }


    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookPlus className="h-5 w-5" />
                    Book Information
                </CardTitle>

                <CardDescription>
                    Enter the information about your new book.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Book Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Book Title
                        </Label>

                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter book title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Author Name */}
                    <div className="space-y-2">
                        <Label htmlFor="author">
                            Author Name
                        </Label>

                        <Input
                            id="author"
                            name="author"
                            placeholder="Enter author name"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>

                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData((prev) => (
                                { ...prev, category: value ?? "", }
                            ))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder="Select book category"
                                />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Fiction">
                                    Fiction
                                </SelectItem>

                                <SelectItem value="Science">
                                    Science
                                </SelectItem>

                                <SelectItem value="History">
                                    History
                                </SelectItem>

                                <SelectItem value="Kids">
                                    Kids
                                </SelectItem>

                                <SelectItem value="Others">
                                    Others
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Total Copies */}
                    <div className="space-y-2">
                        <Label htmlFor="totalCopies">
                            Total Copies
                        </Label>

                        <Input
                            id="totalCopies"
                            name="totalCopies"
                            type="number"
                            min={1}
                            step={1}
                            placeholder="How many copies does the library own?"
                            value={formData.totalCopies}
                            onChange={handleChange}
                            required
                        />

                        <p className="text-xs text-muted-foreground">
                            Each borrow takes one copy away; returning it puts
                            the copy back.
                        </p>
                    </div>

                    {/* Book Image */}
                    <div className="space-y-2">
                        <Label htmlFor="image">
                            Book Image
                        </Label>

                        <div className="rounded-lg border border-dashed p-4">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <Upload className="h-4 w-4" />
                                Upload book cover image
                            </div>

                            <Input
                                id="image"
                                type="file"
                                ref={fileInputRef}
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(e) =>
                                    setImage(e.target.files?.[0] || null)
                                }
                                required
                            />

                            <p className="mt-2 text-xs text-muted-foreground">
                                PNG, JPG, WEBP or GIF (Max 5 MB)
                            </p>

                            {image && (
                                <p className="mt-2 text-sm text-green-600">
                                    Selected: {image.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Short Description
                        </Label>

                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Write a short book description..."
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* User Name and Email */}
                    <div className="grid gap-4 md:grid-cols-2">

                        <div className="space-y-2">
                            <Label htmlFor="userName">
                                User Name
                            </Label>

                            <Input
                                id="userName"
                                value={user?.name || ""}
                                readOnly
                                placeholder="User name"
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userEmail">
                                User Email
                            </Label>

                            <Input
                                id="userEmail"
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                placeholder="User email"
                                className="bg-muted"
                            />
                        </div>

                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading || isPending || !user}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Book...
                            </>
                        ) : (
                            <>
                                <BookPlus className="mr-2 h-4 w-4" />
                                Add Book
                            </>
                        )}
                    </Button>

                    {!isPending && !user && (
                        <p className="text-center text-sm text-destructive">
                            Please sign in to add a book.
                        </p>
                    )}

                </form>
            </CardContent>
        </Card>
    );
};

export default Add_Book_Form;
