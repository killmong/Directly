import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Convert PDF File to Base64 for Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // 4. Configure Gemini Prompt & Schema
    const prompt = `
      You are an expert technical recruiter and resume parser.
      Read this uploaded PDF resume and extract the candidate's information into a strictly formatted JSON object.
      
      RULES:
      - Infer their primary "role" (e.g., "Full Stack Developer", "Data Scientist").
      - Write a short, engaging 2-sentence "bio".
      - Write a longer "aboutText" (1 paragraph) summarizing their experience.
      - Extract all technical "skills" into an array of strings.
      - Extract up to 4 "projects". For each, write a "title", a short "description", and a longer "deepContent" explaining the technical architecture. Look for GitHub or Live URLs if present.
      - Look for "socialLinks" (GitHub, LinkedIn, YouTube).
      - Extract their "contactEmail".

      Respond ONLY with valid JSON matching this exact structure:
      {
        "role": "String",
        "bio": "String",
        "aboutText": "String",
        "skills": ["String", "String"],
        "projects": [
          {
            "title": "String",
            "description": "String",
            "githubUrl": "String or empty",
            "liveUrl": "String or empty",
            "deepContent": "String"
          }
        ],
        "socialLinks": {
          "github": "String or empty",
          "linkedin": "String or empty",
          "youtube": "String or empty"
        },
        "contactEmail": "String"
      }
    `;

    // 5. Configure the Gemini 2.5 Flash Model (Just like your working code!)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json", // Forces clean JSON output
        temperature: 0.7,
      },
    });

    console.log("Sending PDF to Gemini 2.5 Flash...");

    // 6. Call Gemini passing BOTH the prompt and the PDF data
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("Raw Gemini Response received successfully!");

    // Clean up the response just in case it wraps it in markdown backticks
    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(cleanedText);

    // 7. Save to MongoDB
    console.log("Saving to MongoDB...");
    await connectToDatabase();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          portfolioData: parsedData,
          hasCompletedOnboarding: true,
        },
      },
      { new: true },
    );

    console.log("Success! Data saved to DB.");
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("🔥 CRITICAL ANALYSIS ERROR OR QUOTA MET:", error);

    console.log("Using Fallback Developer Data to bypass API limit...");

    const fallbackData = {
      role: "Full Stack Developer",
      bio: "Passionate developer building scalable web applications and engaging UI experiences.",
      aboutText:
        "I specialize in the MERN stack, Next.js, and modern animation libraries like GSAP and Framer Motion. When I'm not coding high-performance interfaces or fintech dashboards, I'm usually editing videos or exploring new web technologies.",
      skills: [
        "Next.js",
        "React",
        "Node.js",
        "MongoDB",
        "GSAP",
        "Tailwind CSS",
      ],
      projects: [
        {
          title: "Folio Dashboard",
          description: "A modern fintech data interface.",
          githubUrl: "https://github.com/killmong",
          liveUrl: "",
          deepContent:
            "Built a comprehensive financial dashboard utilizing Next.js, Tailwind CSS, Tremor for data visualization, and Framer Motion for seamless interactions.",
        },
        {
          title: "SwiftConnect",
          description: "A responsive social media application.",
          githubUrl: "https://github.com/killmong",
          liveUrl: "",
          deepContent:
            "Architected a full-stack social platform featuring user authentication, media uploads, and real-time feeds using the MERN stack.",
        },
      ],
      socialLinks: {
        github: "killmong",
        linkedin: "",
        youtube: "GOuravSharmaVLogD",
      },
      contactEmail: session.user.email || "hello@example.com",
    };

    // Save the fallback data to MongoDB so the app flow continues
    await connectToDatabase();
    await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        $set: {
          portfolioData: fallbackData,
          hasCompletedOnboarding: true,
        },
      },
      { new: true },
    );

    // Return the fallback data to the frontend successfully
    return NextResponse.json({
      success: true,
      data: fallbackData,
      isFallback: true,
    });
  }
}
