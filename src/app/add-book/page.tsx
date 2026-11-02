export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Book</h1>
      <p className="mt-2 text-muted-foreground">
        Add a new book to the BookNook library.
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        The add-book form will show up here.
      </div>
    </div>
  );
}
