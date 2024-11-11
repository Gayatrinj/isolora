import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    const result = await sql`
  SELECT cart.id AS cartId, cart.product_id AS productId, items.name, items.price, cart.quantity, items.image_url
  FROM cart
  INNER JOIN items ON cart.product_id = items.itemid
  WHERE cart.user_id = ${userIdInt};
`;

return NextResponse.json({ success: true, cartItems: result.rows });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
