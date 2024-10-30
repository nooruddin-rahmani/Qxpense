"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pen, Save, SquareX, Trash } from "lucide-react";

interface Expense {
  id: number;
  amount: number;
  payee: string;
  description: string;
}

export function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Expense>({
    id: 0,
    amount: 0,
    payee: "",
    description: "",
  });

  useEffect(() => {
    fetchExpenses();
    const interval = setInterval(fetchExpenses, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data: Expense[] = await response.json();
        setExpenses(data);
      } else {
        console.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm(expense);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/expenses/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setExpenses(
          expenses.map((exp) => (exp.id === editForm.id ? editForm : exp))
        );
        setEditingId(null);
      } else {
        console.error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (response.ok) {
        setExpenses(expenses.filter((exp) => exp.id !== id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="border p-8 rounded-lg">
      <CardHeader className="p-0 pb-5">
        <CardTitle>Expenses Table</CardTitle>
        <CardDescription>All Expenses Here</CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Payee</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              {editingId === expense.id ? (
                <>
                  <TableCell>
                    <Input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          amount: parseFloat(e.target.value),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm.payee}
                      onChange={(e) =>
                        setEditForm({ ...editForm, payee: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant={"outline"}
                      onClick={handleUpdate}
                    >
                      {" "}
                      <Save size="16" />
                    </Button>
                    <Button
                      className="ml-3"
                      size="icon"
                      variant={"outline"}
                      onClick={() => setEditingId(null)}
                    >
                      <SquareX size="16" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.payee}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      size="icon"
                      onClick={() => handleEdit(expense)}
                    >
                      <Pen size="16" />
                    </Button>
                    <Button
                      className="ml-3"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash size="16" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
