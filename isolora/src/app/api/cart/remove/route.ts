import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { userId, productId } = await request.json();
    console.log("Received DELETE request:", { userId, productId });

    if (!userId || !productId) {
      console.warn("User ID and Product ID are required");
      return NextResponse.json(
        { success: false, message: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    const checkResult = await sql`
      SELECT * FROM cart WHERE user_id = ${userId} AND product_id = ${productId};
    `;

    if (checkResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    const deleteResult = await sql`
      DELETE FROM cart
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *;
    `;

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Deletion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" });

  } catch (error) {
    console.error("Error in DELETE endpoint:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during item removal" },
      { status: 500 }
    );
  }
}
