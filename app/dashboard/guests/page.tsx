"use client";
import { GuestForm } from "@/components/guest/guest-form";
import { GuestTable } from "@/components/guest/guest-table";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  CircleUser,
  Menu,
  Package2,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import dynamic from "next/dynamic";

const ModeToggle = dynamic(() => import("@/components/ModeToggle"), {
  ssr: false,
});

interface DashboardMetrics {
  totalExpensesThisMonth: number;
  totalIncome: number;
  currentGuests: number;
  incomingGuests: number;
  monthlyExpenses: Array<{ month: string; amount: number }>;
  monthlyIncomes: Array<{ month: string; amount: number }>;
}

export default function Guestspage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalExpensesThisMonth: 0,
    totalIncome: 0,
    currentGuests: 0,
    incomingGuests: 0,
    monthlyExpenses: [],
    monthlyIncomes: [],
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchDashboardMetrics = async () => {
      try {
        const response = await fetch("/api/dashboard-metrics");
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch dashboard metrics:", errorData);
        }
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    };

    fetchDashboardMetrics();
    const interval = setInterval(fetchDashboardMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const prepareChartData = () => {
    return metrics.monthlyExpenses
      .map((expense) => ({
        month: new Date(expense.month).toLocaleString("default", {
          month: "short",
        }),
        amount: expense.amount,
      }))
      .reverse()
      .slice(0, 6);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  const chartData = prepareChartData();

  const getPercentageChange = () => {
    if (chartData.length < 2) return null;
    const currentMonth = chartData[0].amount;
    const previousMonth = chartData[1].amount;
    const percentageChange =
      ((currentMonth - previousMonth) / previousMonth) * 100;
    return percentageChange.toFixed(1);
  };

  const percentageChange = getPercentageChange();

  return (
    <div className="flex min-h-screen dark: w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-neutral-950 px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Qxpense</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/incomes"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Incomes
          </Link>
          <Link
            href="/dashboard/expenses"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Expenses
          </Link>
          <Link
            href="/dashboard/guests"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Guests
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Qxpense</span>
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/incomes"
                className="text-muted-foreground hover:text-foreground"
              >
                Incomes
              </Link>
              <Link
                href="/dashboard/expenses"
                className="text-muted-foreground hover:text-foreground"
              >
                Expenses
              </Link>
              <Link href="/dashboard/guests" className=" hover:text-foreground">
                Guests
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full gap-4 justify-end">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue This Month
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalIncome}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.monthlyIncomes.length >= 2
                  ? `${
                      ((metrics.monthlyIncomes[
                        metrics.monthlyIncomes.length - 1
                      ].amount -
                        metrics.monthlyIncomes[
                          metrics.monthlyIncomes.length - 2
                        ].amount) /
                        metrics.monthlyIncomes[
                          metrics.monthlyIncomes.length - 2
                        ].amount) *
                      100
                    }% from last month`
                  : "No data available for comparison"}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses This Month
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${" "}
                {metrics.totalExpensesThisMonth.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Guests
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.currentGuests}</div>
              <p className="text-xs text-muted-foreground">
                Active guests in the hotel
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Incoming Guests
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.incomingGuests}</div>
              <p className="text-xs text-muted-foreground">
                Guests arriving soon
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GuestForm />
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses in Six Months</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tickLine={false} dy={10} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    width={80}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    contentStyle={{
                      background: "rgba(0, 0,0, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Total Expenses",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#2CB185"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-medium">
                {percentageChange && (
                  <>
                    {parseFloat(percentageChange) >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <span
                      className={
                        parseFloat(percentageChange) >= 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {Math.abs(parseFloat(percentageChange))}% from last month
                    </span>
                  </>
                )}
              </div>
              <div className="text-muted-foreground">
                Total expenses for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
        <GuestTable />
      </main>
    </div>
  );
}
