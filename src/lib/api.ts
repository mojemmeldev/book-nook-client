/**
 * Base URL of the book/borrow backend (the Express server).
 *
 * Trailing slashes are trimmed so paths like `/books` never turn into
 * `//books` when `.env` contains e.g. `https://example.vercel.app/`.
 */
export const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/** Build a full backend URL: apiUrl("/books/123") */
export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
