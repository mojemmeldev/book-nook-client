export const metadata = {
  title: "My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Borrows</h1>
      <p className="mt-2 text-muted-foreground">
        Books you have borrowed, and the days you have left to return them.
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        Your borrowed books will show up here.
      </div>
    </div>
  );
}
