import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { amount, payee, description } = await request.json();
    await query(
      "UPDATE expenses SET amount = ?, payee = ?, description = ? WHERE id = ?",
      [amount, payee, description, params.id]
    );
    return NextResponse.json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Failed to update expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query("DELETE FROM expenses WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
