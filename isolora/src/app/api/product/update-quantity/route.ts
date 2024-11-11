// src/app/api/product/update-quantity/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const { itemId, quantity } = await request.json();

    // Validate the required parameters
    if (!itemId || quantity == null) {
      return NextResponse.json(
        { success: false, message: "Item ID and quantity are required" },
        { status: 400 }
      );
    }

    // Ensure the quantity is not negative
    if (quantity < 0) {
      return NextResponse.json(
        { success: false, message: "Quantity cannot be negative" },
        { status: 400 }
      );
    }

    // Update the quantity in the items table
    const result = await sql`
      UPDATE items
      SET quantity = ${quantity}
      WHERE itemid = ${itemId}
      RETURNING *;
    `;

    // Check if the item was found and updated
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Quantity updated successfully",
      item: result.rows[0], // Optionally return the updated item
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating quantity" },
      { status: 500 }
    );
  }
}
