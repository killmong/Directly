import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";

// Define the MongoDB Schema for your videos
const VideoSchema = new mongoose.Schema({
  title: String,
  youtubeId: String,
  url: String,
  category: String,
  views: Number,
  createdAt: { type: Date, default: Date.now },
});

// Get the model (or create it if it doesn't exist)
const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);

// GET: Fetch all videos
export async function GET() {
  await connectToDatabase();
  const videos = await Video.find({}).sort({ createdAt: -1 });
  return NextResponse.json(videos);
}

// POST: Add a new video
export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const newVideo = await Video.create(body);
  return NextResponse.json(newVideo);
}

// DELETE: Remove a video
export async function DELETE(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Video.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
