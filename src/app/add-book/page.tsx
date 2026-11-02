import { getCurrentUser } from "@/lib/current-user";
import { AddBookForm } from "./_component/add-book-form";

export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  const user = getCurrentUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Book</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in the details below to add a new book to the BookNook library.
      </p>

      <AddBookForm user={user} />
    </div>
  );
}
