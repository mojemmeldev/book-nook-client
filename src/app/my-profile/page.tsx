"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, BookmarkCheck, PlusCircle, User, Mail, ShieldCheck } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your profile and manage your library activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Button onClick={() => router.push("/sign-in?callbackUrl=/my-profile")}>
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/sign-up")}>
              Register
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal details and library activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Card */}
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-24 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={user.image || undefined} alt={user.name || "User photo"} />
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-lg font-bold">{user.name || "BookNook Reader"}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="size-3.5" />
              <span>Verified Member</span>
            </div>
          </CardContent>
        </Card>

        {/* Details & Quick Links */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>Your registered details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium">{user.name || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Manage your books and loans</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/add-book"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
              >
                <PlusCircle className="size-5 text-primary" />
                <span className="text-xs font-medium">Add Book</span>
              </Link>
              <Link
                href="/my-books"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
              >
                <BookOpen className="size-5 text-primary" />
                <span className="text-xs font-medium">My Books</span>
              </Link>
              <Link
                href="/my-borrows"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
              >
                <BookmarkCheck className="size-5 text-primary" />
                <span className="text-xs font-medium">My Borrows</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

