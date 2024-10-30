import { NextResponse } from "next/server";
import { query } from "@/lib/db";

async function ensureTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount DECIMAL(10, 2) NOT NULL,
      payee VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await query(createTableSQL, []);
}

// Remove the broadcastMetrics function

export async function GET() {
  try {
    await ensureTableExists();
    const expenses = await query("SELECT * FROM expenses", []);
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const { amount, payee, description } = await request.json();
    await query(
      "INSERT INTO expenses (amount, payee, description) VALUES (?, ?, ?)",
      [amount, payee, description]
    );
    // Remove the broadcastMetrics() call
    return NextResponse.json(
      { message: "Expense added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add expense:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, amount, payee, description } = await request.json();
    await query(
      "UPDATE expenses SET amount = ?, payee = ?, description = ? WHERE id = ?",
      [amount, payee, description, id]
    );
    // Remove the broadcastMetrics() call
    return NextResponse.json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Failed to update expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await query("DELETE FROM expenses WHERE id = ?", [id]);
    // Remove the broadcastMetrics() call
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
