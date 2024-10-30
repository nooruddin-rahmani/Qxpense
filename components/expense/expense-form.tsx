"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [payee, setPayee] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payee,
          description,
        }),
      });
      if (response.ok) {
        // Reset form and maybe refresh the expense list
        setAmount("");
        setPayee("");
        setDescription("");
      } else {
        const errorData = await response.json();
        console.error("Failed to add expense:", errorData.error);
        // Show error message to user
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      // Show error message to user
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 col-span-2 p-8 border rounded-lg"
    >
      <CardHeader className="p-0">
        <CardTitle>Expenses</CardTitle>
        <CardDescription>Add Expenses Here</CardDescription>
      </CardHeader>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="payee">Payee</Label>
        <Input
          id="payee"
          type="text"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Expense</Button>
    </form>
  );
}
