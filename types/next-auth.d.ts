import NextAuth, { DefaultSession } from "next-auth";

// This extends the built-in session types to include your custom MongoDB fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      hasCompletedOnboarding: boolean;
    } & DefaultSession["user"];
  }
}
