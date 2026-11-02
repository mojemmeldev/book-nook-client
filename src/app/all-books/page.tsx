export const metadata = {
  title: "All Books",
};

export default function AllBooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">All Books</h1>
      <p className="mt-2 text-muted-foreground">
        Browse every book in the BookNook library.
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        The book list will show up here.
      </div>
    </div>
  );
}
