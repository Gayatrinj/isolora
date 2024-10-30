// src/app/api/item/list.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM items;
    `;
    return NextResponse.json({ items: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
  }
}
