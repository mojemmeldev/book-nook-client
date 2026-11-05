
import React from 'react';
import { API_BASE } from "@/lib/api";
import BookDetails from '../_component/Book-Details';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const book = (await res.json()) as { title?: string };
      if (book?.title) return { title: book.title };
    }
  } catch {
    // Fall back to the default title below.
  }

  return { title: "Book Details" };
}

const BookDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let book;
  try {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return notFound();
    book = await res.json();
  } catch {
    return notFound();
  }

  if (!book || !book._id) return notFound();

  return (
    <div>
      <BookDetails book={book} />
    </div>
  );
};

export default BookDetailsPage;
