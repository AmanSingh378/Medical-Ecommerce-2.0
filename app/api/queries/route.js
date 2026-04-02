import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { queriesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newQuery = await db.insert(queriesTable).values({
      name,
      email,
      message,
    }).returning();

    console.log("Query saved:", newQuery[0]);

    return NextResponse.json({ success: true, query: newQuery[0] }, { status: 201 });
  } catch (error) {
    console.error("Error saving query:", error);
    return NextResponse.json({ error: "Failed to save query" }, { status: 500 });
  }
}

// Optional GET to list queries (for admin)
export async function GET() {
  try {
    const allQueries = await db.select().from(queriesTable).orderBy(queriesTable.createdAt);
    return NextResponse.json(allQueries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json({ error: "Failed to fetch queries" }, { status: 500 });
  }
}
