import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { amount, payer, reason, description } = await request.json();
    await query(
      "UPDATE incomes SET amount = ?, payer = ?, reason = ?, description = ? WHERE id = ?",
      [amount, payer, reason, description, params.id]
    );
    return NextResponse.json({ message: "Income updated successfully" });
  } catch (error) {
    console.error("Failed to update income:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query("DELETE FROM incomes WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Failed to delete income:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}
