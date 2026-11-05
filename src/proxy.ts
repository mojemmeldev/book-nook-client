import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const session = await auth.api.getSession({
        headers: await headers()
    })
    const user = session?.user;
    if(!user){
        return NextResponse.redirect(new URL('sign-in', request.url))
    }

  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
    matcher: [
    "/my-borrows/:path*",
    "/my-books/:path*",
    "/add-book/:path*",
  ],
}