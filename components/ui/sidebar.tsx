import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <nav className="space-y-2">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard/expenses">Expenses</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard/incomes">Incomes</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard/subscriptions">Subscriptions</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard/customers">Customers</Link>
        </Button>
      </nav>
    </div>
  );
}
