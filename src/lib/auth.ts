import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"

import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("book-nook-user");

export const auth = betterAuth({
      emailAndPassword: {
    enabled: true,
    // Assignment password rule: at least 6 characters (plus upper + lower
    // case, which the sign-up form checks before submitting).
    minPasswordLength: 6,
  },

  // Google social login — needs GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Resolve the public origin from each incoming request instead of a single
  // fixed URL. A hardcoded BETTER_AUTH_URL (e.g. http://localhost:3000) makes
  // Better Auth reject requests coming from other hosts with
  // 403 INVALID_ORIGIN — which is exactly what happened on Vercel — and it
  // also produces the wrong OAuth redirect URI.
  baseURL: {
    allowedHosts: ["localhost", "localhost:*", "*.vercel.app"],
    // Used only when the request carries no usable Host header (tests, etc).
    fallback: "http://localhost:3000",
  },

  database: mongodbAdapter(db, {
    client,
  }),
   plugins: [
        jwt(), 
    ], 
    session:{
      cookieCache: {
        enabled:true, 
        strategy:"jwt",
        maxAge: 60*60*24*7, // 7 days
      }
    }
});