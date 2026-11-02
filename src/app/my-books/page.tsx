export const metadata = {
  title: "My Books",
};

export default function MyBooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
      <p className="mt-2 text-muted-foreground">
        The books you have added to BookNook.
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        Your books will show up here.
      </div>
    </div>
  );
}
