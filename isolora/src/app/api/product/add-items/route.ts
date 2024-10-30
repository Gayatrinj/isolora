
// src/app/api/product/add-item/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface Item {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export async function POST(request: Request) {
  const { name, category, description, price, quantity, imageUrl } = (await request.json()) as Item;

  try {
    const result = await sql`
      INSERT INTO items (name, category, description, price, quantity, image_url)
      VALUES (${name}, ${category}, ${description}, ${price}, ${quantity}, ${imageUrl})
      RETURNING *;
    `;
    return NextResponse.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error("Error adding item to database:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}

