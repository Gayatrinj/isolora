// src/app/api/item/create-table.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS items (
        itemid SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        user_id INT REFERENCES users(id) ON DELETE CASCADE
      );`;

    console.log("Items table created successfully");
    return NextResponse.json({ message: "Items table created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error creating items table:", error);
    return NextResponse.json({ error: "Error creating items table" }, { status: 500 });
  }
}
