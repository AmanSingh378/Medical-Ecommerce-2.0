import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { feedbacksTable } from "@/configs/schema";

export async function POST(req) {
  try {
    const { name, email, message, rating } = await req.json();

    if (!name || !email || !message || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const newFeedback = await db.insert(feedbacksTable).values({
      name,
      email,
      message,
      rating: parseInt(rating),
    }).returning();

    console.log("Feedback saved:", newFeedback[0]);

    return NextResponse.json({ success: true, feedback: newFeedback[0] }, { status: 201 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

// GET all feedback
export async function GET() {
  try {
    const allFeedbacks = await db.select().from(feedbacksTable).orderBy(feedbacksTable.createdAt);
    return NextResponse.json(allFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
