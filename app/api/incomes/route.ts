import { NextResponse } from "next/server";
import { query } from "@/lib/db";

async function ensureTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS incomes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount DECIMAL(10, 2) NOT NULL,
      payer VARCHAR(255) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await query(createTableSQL, []);
}

export async function GET() {
  try {
    await ensureTableExists();
    const incomes = await query("SELECT * FROM incomes", []);
    return NextResponse.json(incomes);
  } catch (error) {
    console.error("Failed to fetch incomes:", error);
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const { amount, payer, reason, description } = await request.json();
    await query(
      "INSERT INTO incomes (amount, payer, reason, description) VALUES (?, ?, ?, ?)",
      [amount, payer, reason, description]
    );
    return NextResponse.json(
      { message: "Income added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add income:", error);
    return NextResponse.json(
      { error: "Failed to add income" },
      { status: 500 }
    );
  }
}
