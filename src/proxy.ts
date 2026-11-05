import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })

    const user = session?.user
    if (!user) {
        // Store the original URL so we can send the user back after sign-in
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Authenticated — let the request through (do NOT redirect to /home)
    return NextResponse.next()
}

export const config = {
    matcher: [
    "/my-borrows/:path*",
    "/my-books/:path*",
    "/add-book/:path*",
    // Book details is a private route, but /books (the list) stays public.
    "/books/:id",
  ],
}