import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"

import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("book-nook-user");

export const auth = betterAuth({
      emailAndPassword: { 
    enabled: true, 
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