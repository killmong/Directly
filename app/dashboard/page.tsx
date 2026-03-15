import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient"; // We will build this next

export default async function DashboardPage() {
  // 1. Secure the route on the server
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. Pass the user data to our interactive client component
  return <DashboardClient user={session.user} />;
}
