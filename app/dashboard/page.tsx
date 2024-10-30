"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  Menu,
  Package2,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Image from "next/image";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", income: 186, expense: 80 },
  { month: "February", income: 305, expense: 200 },
  { month: "March", income: 237, expense: 120 },
  { month: "April", income: 73, expense: 190 },
  { month: "May", income: 209, expense: 130 },
  { month: "June", income: 214, expense: 140 },
];

const chartConfig = {
  income: {
    label: "income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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

interface Guest {
  id: number;
  fullName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  photoPath: string | null;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  payee?: string;
  payer?: string;
}

// Add this function at the top of your file, outside of the Page component
function calculateStayDuration(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days and round up
}

export default function Page() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalExpensesThisMonth: 0,
    totalIncome: 0,
    currentGuests: 0,
    incomingGuests: 0,
    monthlyExpenses: [],
    monthlyIncomes: [],
  });

  const [isClient, setIsClient] = useState(false);
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

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

    const fetchRecentGuests = async () => {
      try {
        const response = await fetch("/api/guests?limit=5");
        if (response.ok) {
          const data = await response.json();
          setRecentGuests(data);
        } else {
          console.error("Failed to fetch recent guests");
        }
      } catch (error) {
        console.error("Error fetching recent guests:", error);
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?limit=5");
        if (response.ok) {
          const data = await response.json();
          setRecentTransactions(data);
        } else {
          console.error("Failed to fetch recent transactions");
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchDashboardMetrics();
    fetchRecentGuests();
    fetchRecentTransactions();
    const interval = setInterval(fetchDashboardMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

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
            className="text-foreground transition-colors hover:text-foreground"
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
            className="text-muted-foreground transition-colors hover:text-foreground"
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
              <Link href="/dashboard" className="hover:text-foreground">
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
              <Link
                href="/dashboard/guests"
                className="text-muted-foreground hover:text-foreground"
              >
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
        <div className="grid gap-4 md:gap-4 lg:grid-cols-3 xl:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/transactions">
                  All Transactions
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.payee || transaction.payer || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : transaction.type === "expense"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Guests</CardTitle>
                <CardDescription>Recent Guests Visited</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/guests">
                  All Guests
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-1">
              {recentGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center gap-4 hover:bg-neutral-900 py-2 px-3"
                >
                  <Avatar className="h-9 w-9">
                    {guest.photoPath ? (
                      <Image
                        src={guest.photoPath}
                        alt={guest.fullName}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        {guest.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {guest.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {guest.email}
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {calculateStayDuration(guest.checkIn, guest.checkOut)} days
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income - Expense</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total income - expense in 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
