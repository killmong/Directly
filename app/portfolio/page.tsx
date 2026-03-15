import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { redirect } from "next/navigation";
import LivePortfolio from "./LivePortfolio";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  await connectToDatabase();

  // Fetch the user's complete profile from MongoDB
  const rawUserData = await User.findOne({ email: session.user.email }).lean();

  if (!rawUserData || !rawUserData.portfolioData) {
    redirect("/dashboard"); // Send them back if they haven't uploaded a resume
  }

  // THE FIX: Strip out MongoDB complex objects (like ObjectIds) into plain strings
  const plainUserData = JSON.parse(JSON.stringify(rawUserData));

  // We pass the cleaned, plain JSON data to our interactive client component
  return (
    <LivePortfolio
      data={plainUserData.portfolioData}
      theme={plainUserData.themeConfig}
    />
  );
}
