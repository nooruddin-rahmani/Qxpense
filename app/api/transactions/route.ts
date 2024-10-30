import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  payee?: string;
  payer?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  try {
    const incomes = await query<Transaction>(
      "SELECT id, 'income' as type, amount, description, created_at as date, payer FROM incomes",
      []
    );
    const expenses = await query<Transaction>(
      "SELECT id, 'expense' as type, amount, description, created_at as date, payee FROM expenses",
      []
    );

    let allTransactions: Transaction[] = [...incomes, ...expenses];
    allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (limit) {
      allTransactions = allTransactions.slice(0, limit);
    }

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
