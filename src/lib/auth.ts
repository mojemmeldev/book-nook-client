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