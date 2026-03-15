import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },

    // The data we will extract from the PDF using Gemini
    portfolioData: {
      role: { type: String, default: "" },
      bio: { type: String, default: "" },
      aboutText: { type: String, default: "" },
      skills: [{ type: String }],
      projects: [
        {
          title: String,
          description: String,
          githubUrl: String,
          liveUrl: String,
          deepContent: String,
        },
      ],
      socialLinks: {
        github: String,
        linkedin: String,
        youtube: String,
      },
      contactEmail: String,
    },

    // The theme they select from the visual picker
    themeConfig: {
      templateName: { type: String, default: "minimal" },
      primaryColor: { type: String, default: "#3b82f6" },
    },

    hasCompletedOnboarding: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);

export default User;
