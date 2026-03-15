import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              hasCompletedOnboarding: false,
            });
          }
          return true;
        } catch (error) {
          console.log("Error saving user to DB:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session }) {
      await connectToDatabase();
      const sessionUser = await User.findOne({ email: session.user?.email });
      if (sessionUser && session.user) {
        session.user.id = sessionUser._id.toString();
        session.user.hasCompletedOnboarding =
          sessionUser.hasCompletedOnboarding;
      }
      return session;
    },
  },
};
