import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initializeDatabase } from "@/lib/initDb";

interface MetricResult {
  total?: number | string;
  count?: number;
}

interface MonthlyData {
  month: string;
  amount: number | string;
}

export async function GET() {
  try {
    // Initialize the database
    await initializeDatabase();

    // Wrap all database queries in a try-catch block
    try {
      const totalExpensesThisMonthResult = await query<MetricResult>(
        "SELECT SUM(amount) as total FROM expenses WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())",
        []
      );

      const totalExpensesThisMonth =
        totalExpensesThisMonthResult[0]?.total != null
          ? parseFloat(totalExpensesThisMonthResult[0].total.toString())
          : 0;

      const totalIncomeResult = await query<MetricResult>(
        "SELECT SUM(amount) as total FROM incomes",
        []
      );
      const currentGuestsResult = await query<MetricResult>(
        "SELECT COUNT(*) as count FROM guests WHERE checkIn <= CURDATE() AND checkOut >= CURDATE()",
        []
      );

      const incomingGuestsResult = await query<MetricResult>(
        "SELECT COUNT(*) as count FROM guests WHERE checkIn > CURDATE()",
        []
      );

      const monthlyExpenses = await query<MonthlyData>(
        "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as amount FROM expenses GROUP BY month ORDER BY month DESC LIMIT 6",
        []
      );

      const monthlyIncomes = await query<MonthlyData>(
        "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as amount FROM incomes GROUP BY month ORDER BY month DESC LIMIT 6",
        []
      );

      const metrics = {
        totalExpensesThisMonth,
        totalIncome: parseFloat(totalIncomeResult[0]?.total?.toString() || "0"),
        currentGuests: currentGuestsResult[0]?.count ?? 0,
        incomingGuests: incomingGuestsResult[0]?.count ?? 0,
        monthlyExpenses,
        monthlyIncomes,
      };

      return NextResponse.json(metrics);
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection error",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard metrics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
