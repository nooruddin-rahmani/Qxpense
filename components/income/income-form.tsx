"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function IncomeForm() {
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payer,
          description,
        }),
      });
      if (response.ok) {
        // Reset form and maybe refresh the income list
        setAmount("");
        setPayer("");
        setDescription("");
      } else {
        console.error("Failed to add income");
      }
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 col-span-2 p-8 border rounded-lg"
    >
      <CardHeader className="p-0">
        <CardTitle>Incomes</CardTitle>
        <CardDescription>Add Incomes Here</CardDescription>
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
        <Label htmlFor="payer">Payer</Label>
        <Input
          id="payer"
          type="text"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
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
      <Button type="submit">Add Income</Button>
    </form>
  );
}
