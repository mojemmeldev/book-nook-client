# 📚 BookNook | A Modern Book Library

**BookNook** is a responsive, full-stack book library application where readers can discover books, manage their own collections, and borrow books online. It offers secure authentication, book management, and a simple borrowing experience.

## 🌐 Live Website

- **Client (Live Site):** [Visit BookNook](https://YOUR-CLIENT-URL.vercel.app)
- **Server API:** `https://YOUR-SERVER-URL.vercel.app`

> **Before submitting:** Replace both example URLs with your actual deployed links.

## ✨ Key Features

- **Secure authentication:** Register and log in using email/password or Google, powered by Better Auth.
- **Protected pages:** Only authenticated users can access Add Book, Book Details, My Books, and My Borrows. Users are redirected back to their intended page after signing in.
- **Interactive homepage:** A Swiper.js banner, six dynamically loaded new arrivals, and additional reader-focused sections.
- **Book discovery:** Browse all available books in a responsive grid and view details about individual titles.
- **Add books:** Upload a book image, enter its information, and save it with the contributor's details and the date added.
- **Manage personal books:** View, edit, and delete books you added, including a confirmation modal before deletion.
- **Borrow and return:** Borrow books through a modal and track borrowed books, borrow dates, and return dates in My Borrows.
- **Responsive interface:** Mobile-friendly navbar, user-profile dropdown, consistent cards, and a site-wide footer.
- **User feedback:** Toast notifications, loading indicators, page-specific titles, and a custom 404 page.

## 🛠️ Tech Stack

| Part | Technologies |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| Authentication | Better Auth, Google OAuth, MongoDB Adapter |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Images | imgbb or Postimages |
| UI & Feedback | Swiper.js, Lucide icons, toast notifications |
| API Protection | Session/token validation on protected requests |

## 📄 Main Pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home banner, latest books, extra sections |
| `/books` | Public | Browse all books |
| `/login` | Public | Sign in using credentials or Google |
| `/register` | Public | Create a new account |
| `/add-book` | Private | Add a book |
| `/books/[id]` | Private | View book details and borrow |
| `/my-books` | Private | View, update, and delete your books |
| `/my-borrows` | Private | View borrowed books and return them |
| `/profile` | Private | User profile, if implemented |

## 🔌 Express API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/books` | Get books (supports latest-first sorting and limiting for New Arrivals) |
| `GET` | `/books/:id` | Get a book by ID |
| `POST` | `/books` | Add a new book |
| `PATCH` | `/books/:id` | Edit an existing book |
| `DELETE` | `/books/:id` | Delete a book |
| `POST` | `/borrows` | Borrow a book |
| `GET` | `/borrows` | Get the signed-in user's borrowed books |
| `DELETE` | `/borrows/:id` | Return a borrowed book |

> Book details and write/borrow operations require authentication. Update the API documentation if your actual access rules or endpoint paths differ.

## ⚙️ Run Locally

**1. Clone the repository**

```bash
git clone YOUR-CLIENT-REPOSITORY-URL
cd YOUR-CLIENT-FOLDER
```

**2. Install frontend dependencies**

```bash
npm install
```

**3. Configure the client environment (`.env.local`)**

```env
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-strong-secret
MONGO_URI=your-mongodb-connection-string
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

Add your image-hosting credentials according to how image uploads are implemented. Never commit secrets to GitHub.

**4. Start the frontend**

```bash
npm run dev
```

**5. Start the Express server**

In your backend project, install dependencies, configure the server's `.env` (including `MONGO_URI`, authentication/JWKS settings, and any required allowed origins), then start it using the script defined in its `package.json`.

Open `http://localhost:3000` in your browser.

## 🔐 Authentication & Authorization

BookNook uses Better Auth for login, registration, and Google sign-in. Private Next.js pages redirect unauthenticated visitors to the login page. Protected Express endpoints must also verify the user's authentication token/session and check ownership for editing or deleting books. Client-side route protection alone is not sufficient to secure database operations.

## 📱 Responsive Design

BookNook is designed for mobile, tablet, and desktop screens, with consistent typography, image sizes, card spacing, buttons, and navigation.

---

**BookNook** | Discover. Borrow. Read. 📖
