import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { themeId } = await req.json();

    if (!themeId) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Update the user's selected theme in MongoDB
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          "themeConfig.templateName": themeId,
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Theme Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save theme" },
      { status: 500 },
    );
  }
}
