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

interface Income {
  id: number;
  amount: number;
  payer: string;
  description: string;
}

export function IncomeTable() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Income>({
    id: 0,
    amount: 0,
    payer: "",
    description: "",
  });

  useEffect(() => {
    fetchIncomes();
    const interval = setInterval(fetchIncomes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch("/api/incomes");
      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      } else {
        console.error("Failed to fetch incomes");
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const handleEdit = (income: Income) => {
    setEditingId(income.id);
    setEditForm(income);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/incomes/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setIncomes(
          incomes.map((inc) => (inc.id === editForm.id ? editForm : inc))
        );
        setEditingId(null);
      } else {
        console.error("Failed to update income");
      }
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/incomes/${id}`, { method: "DELETE" });
      if (response.ok) {
        setIncomes(incomes.filter((inc) => inc.id !== id));
      } else {
        console.error("Failed to delete income");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  return (
    <div className="border p-8 rounded-lg">
      <CardHeader className="p-0 pb-5">
        <CardTitle>Incomes Table</CardTitle>
        <CardDescription>All Incomes Here</CardDescription>
      </CardHeader>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="justify-between text-right">
            <TableHead>Amount</TableHead>
            <TableHead>Payer</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income) => (
            <TableRow key={income.id}>
              {editingId === income.id ? (
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
                      value={editForm.payer}
                      onChange={(e) =>
                        setEditForm({ ...editForm, payer: e.target.value })
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
                  <TableCell>${income.amount}</TableCell>
                  <TableCell>{income.payer}</TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      onClick={() => handleEdit(income)}
                      size="icon"
                    >
                      <Pen size="16" />
                    </Button>
                    <Button
                      className="ml-3"
                      variant="destructive"
                      onClick={() => handleDelete(income.id)}
                      size="icon"
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
