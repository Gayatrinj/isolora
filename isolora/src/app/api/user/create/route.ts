import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // SQL statement to create the 'users' table
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      emailid VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`;

    console.log("Users table created successfully");
    return NextResponse.json(
      { message: "Users table created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating users table:', error);
    return NextResponse.json(
      { error: "Error creating users table" },
      { status: 500 }
    );
  }
}
