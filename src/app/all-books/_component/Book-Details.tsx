
import Image from "next/image";
import { BookOpen, UserRound, Mail, ArrowLeft } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    userName?: string;
    userEmail?: string;
    addedBy?: {
        name?: string;
        email?: string;
    };
};

const BookDetails = ({ book }: { book: Book }) => {
    const addedByName =
        book.userName || book.addedBy?.name || "Unknown";

    const addedByEmail =
        book.userEmail || book.addedBy?.email;

    return (
        <section className="min-h-screen bg-background py-12">
            <div className="container mx-auto max-w-6xl px-4">

                <Card className="overflow-hidden">
                    <CardContent className="p-6 md:p-10">

                        <div className="grid gap-10 md:grid-cols-2">



                            {/* Book Image */}
                            <div className="relative aspect-[2/3] w-full max-w-md overflow-hidden rounded-xl bg-muted">


                                {book.image ? (
                                    <Image
                                        src={book.image}
                                        alt={book.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <BookOpen className="h-20 w-20 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Book Information */}
                            <div className="flex flex-col gap-5">

                                <Badge
                                    variant="secondary"
                                    className="w-fit px-3 py-1"
                                >
                                    {book.category}
                                </Badge>

                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    {book.title}
                                </h1>

                                <p className="text-lg text-muted-foreground">
                                    By{" "}
                                    <span className="font-medium text-foreground">
                                        {book.author}
                                    </span>
                                </p>

                                <div className="border-t pt-5">
                                    <h2 className="mb-3 text-xl font-semibold">
                                        Description
                                    </h2>

                                    <p className="leading-8 text-muted-foreground">
                                        {book.description}
                                    </p>
                                </div>

                                {/* Added By */}
                                <div className="rounded-xl bg-muted/50 p-5">
                                    <h3 className="mb-4 font-semibold">
                                        Added By
                                    </h3>

                                    <div className="space-y-3">
                                        <p className="flex items-center gap-3">
                                            <UserRound className="h-5 w-5 text-muted-foreground" />
                                            {addedByName}
                                        </p>

                                        {addedByEmail && (
                                            <p className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                                {addedByEmail}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Borrow Button */}
                                <Button
                                    size="lg"
                                    className="mt-4 w-full cursor-pointer"
                                >
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Borrow This Book
                                </Button>

                                <div className="mb-6">
                                    <Link
                                        href="/all-books"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Books
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default BookDetails;
