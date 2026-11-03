
"use client";
import React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = {
  name: string;
  email: string;
  photoURL: string;
  password: string;
};

const Page = () => {

    const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with your registration logic (API route, Firebase, etc.)
      console.log("Register:", form);
    } finally {
      setLoading(false);
    }
  };



    return (
         <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Fill in your details to register.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="photoURL">Photo URL</Label>
              <Input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={form.photoURL}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
    );
};

export default Page;


