"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import { signUp, signOut } from "@/lib/auth-client";

type FormState = {
  name: string;
  email: string;
  photoURL: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.photoURL.trim() || undefined,
      });

      if (error) {
        const msg = error.message || "Registration failed. Please check your information.";
        setErrorMessage(msg);
        toast.add({
          title: "Registration failed",
          description: msg,
          type: "error",
        });
        return;
      }

      // If better-auth automatically logged the user in, sign out so they can log in at the login page
      try {
        await signOut();
      } catch {
        // Ignore signout cleanup error
      }

      // Show success toast
      toast.add({
        title: "Registration successful!",
        description: "Your account has been created. Please log in.",
        type: "success",
      });

      // Navigate user to their Login page
      router.replace("/sign-in");
    } catch (err) {
      console.error("Signup Error:", err);
      const msg = "Something went wrong. Please try again.";
      setErrorMessage(msg);
      toast.add({
        title: "Registration failed",
        description: msg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details below to register for BookNook.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Error Message anywhere in the form */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-2">
              <Label htmlFor="photoURL">Photo URL (optional)</Label>
              <Input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/your-avatar.jpg"
                value={form.photoURL}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="mt-2 flex flex-col gap-4">
            {/* Register Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
