/**
 * Dummy book data — swap this file for real database/API data later.
 *
 * The shape mirrors what a MongoDB `books` collection returns, so moving
 * to the real backend only means replacing `books` with a fetch call.
 */

/** Categories offered in the Add Book form. */
export const BOOK_CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  /** ISO date string — used to show the newest books first. */
  createdAt: string;
};

export const books: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    image: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    description:
      "Tiny changes that lead to big results. A practical guide to building good habits and breaking bad ones.",
    createdAt: "2026-10-28",
  },
  {
    id: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    description:
      "A shepherd boy travels the world in search of a treasure, and discovers that the journey itself is the reward.",
    createdAt: "2026-10-25",
  },
  {
    id: "nineteen-eighty-four",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    description:
      "A dystopian classic about surveillance, propaganda and the cost of living under a totalitarian regime.",
    createdAt: "2026-10-21",
  },
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    description:
      "A brief history of humankind — from the Stone Age to the modern era, told with wit and insight.",
    createdAt: "2026-10-18",
  },
  {
    id: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    image: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    description:
      "Bilbo Baggins joins a quest of dwarves, dragons and gold in this beloved fantasy adventure.",
    createdAt: "2026-10-15",
  },
  {
    id: "educated",
    title: "Educated",
    author: "Tara Westover",
    category: "Biography",
    image: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    description:
      "A memoir about a woman who leaves her survivalist family and earns a PhD from Cambridge.",
    createdAt: "2026-10-12",
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    description:
      "Jay Gatsby's lavish parties and unending longing define this portrait of the American Dream.",
    createdAt: "2026-10-08",
  },
  {
    id: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
    image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    description:
      "A child's-eye view of race, justice and morality in the American South.",
    createdAt: "2026-10-04",
  },
  {
    id: "harry-potter-and-the-sorcerers-stone",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    image: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
    description:
      "A boy discovers he is a wizard and begins his education at Hogwarts School of Witchcraft and Wizardry.",
    createdAt: "2026-09-29",
  },
  {
    id: "the-catcher-in-the-rye",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    image: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
    description:
      "Holden Caulfield spends three days wandering New York City, searching for something real.",
    createdAt: "2026-09-24",
  },
];

/**
 * Latest books, newest first.
 *
 * Dummy version of the MongoDB query:
 *   db.books.find().sort({ createdAt: -1 }).limit(limit)
 */
export function getLatestBooks(limit = 6): Book[] {
  return [...books]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

/** Find a single book by its id (dummy equivalent of `db.books.findOne({ _id })`). */
export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}

/** Data collected by the Add Book form (before an id/createdAt is assigned). */
export type NewBook = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
};

/**
 * Insert a newly submitted book (dummy equivalent of `db.books.insertOne()`).
 *
 * Books are unshifted so newest-first listings (`getLatestBooks`, All Books)
 * pick the new entry up after the page is revalidated.
 */
export function createBook(input: NewBook): Book {
  const book: Book = {
    id: `${slugify(input.title)}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    ...input,
  };

  books.unshift(book);
  return book;
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "book";
}

/* ------------------------------------------------------------------ *
 * Backend books — GET ${NEXT_PUBLIC_SERVER_BASE_URL}/books
 * ------------------------------------------------------------------ */

/**
 * Book document returned by the backend (a MongoDB `books` document).
 *
 * Differs from the dummy `Book` above: MongoDB uses `_id`, fields can be
 * missing or empty, and `image` is not always a URL string yet.
 */
export type ApiBook = {
  _id: string;
  title?: string;
  author?: string;
  category?: string;
  /** Cover URL — currently `{}` for records saved before uploads were wired. */
  image?: unknown;
  description?: string;
  /** Total copies owned by the library (challenge requirement). */
  totalCopies?: number;
  /** Copies that are not borrowed right now — 0 means "Not Available". */
  availableCopies?: number;
  /** ISO date string set when the book was added. */
  createdAt?: string;
  userName?: string;
  userEmail?: string;
  creatorEmail?: string;
};

/** Minimal book shape the reusable `BookCard` needs to render. */
export type BookCardData = {
  id: string;
  title: string;
  author: string;
  category?: string;
  /** Cover URL — the card shows a placeholder when it is missing. */
  image?: string;
  /** Total copies of this book in the library. */
  totalCopies?: number;
  /** Copies left to borrow — 0 disables the Borrow button. */
  availableCopies?: number;
};

/** Map a backend book onto the shape `BookCard` renders. */
export function toBookCardData(book: ApiBook): BookCardData {
  const image = typeof book.image === "string" ? book.image.trim() : "";

  return {
    id: book._id,
    title: book.title?.trim() || "Untitled",
    author: book.author?.trim() || "Unknown author",
    category: book.category?.trim() || undefined,
    image: image || undefined,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
  };
}
