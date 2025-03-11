"use client";

import { useState, useEffect } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
   ResponsiveContainer,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid,
} from "recharts";

type Budget = {
   _id?: string;
   category: string;
   month: string;
   budget: number;
};

type Transaction = {
   _id?: string;
   amount: number;
   date: string;
   description: string;
   category?: string;
};

export default function BudgetingPage() {
   const [budgets, setBudgets] = useState<Budget[]>([]);
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [form, setForm] = useState<Budget>({
      category: "",
      month: "",
      budget: 0,
   });
   const [error, setError] = useState("");

   useEffect(() => {
      fetch("/api/budgets")
         .then((res) => res.json())
         .then((data) => setBudgets(data))
         .catch((err) => console.error(err));

      fetch("/api/transactions")
         .then((res) => res.json())
         .then((data) => setTransactions(data))
         .catch((err) => console.error(err));
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.category || !form.month || form.budget <= 0) {
         setError("All fields are required.");
         return;
      }
      setError("");
      try {
         const res = await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });
         const newBudget = await res.json();
         setBudgets([...budgets, newBudget.ops?.[0] ?? form]);
         setForm({ category: "", month: "", budget: 0 });
      } catch (err) {
         console.error(err);
      }
   };

   const budgetMap: Record<string, number> = {};
   budgets.forEach((b) => {
      const key = `${b.month}-${b.category}`;
      budgetMap[key] = b.budget;
   });

   const actualMap: Record<string, number> = {};
   transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (t.category) {
         const key = `${month}-${t.category}`;
         actualMap[key] = (actualMap[key] || 0) + Number(t.amount);
      }
   });

   const chartData = budgets.map((b) => {
      const key = `${b.month}-${b.category}`;
      return {
         category: `${b.category} (${b.month})`,
         budget: b.budget,
         actual: actualMap[key] || 0,
      };
   });

   return (
      <Card className="bg-black border border-gray-800 text-white">
         <CardHeader>
            <CardTitle className="text-2xl">Budgeting</CardTitle>
            <CardDescription>
               Set budgets and compare actual spending
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-sm">
               {error && <p className="text-red-500">{error}</p>}

               <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                     id="category"
                     type="text"
                     placeholder="e.g., Food"
                     value={form.category}
                     onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                     }
                  />
               </div>
               <div>
                  <Label htmlFor="month">Month</Label>
                  <Input
                     id="month"
                     type="month"
                     value={form.month}
                     onChange={(e) =>
                        setForm({ ...form, month: e.target.value })
                     }
                  />
               </div>
               <div>
                  <Label htmlFor="budget">Budget Amount</Label>
                  <Input
                     id="budget"
                     type="number"
                     placeholder="e.g., 500"
                     value={form.budget === 0 ? "" : form.budget}
                     onChange={(e) =>
                        setForm({
                           ...form,
                           budget:
                              e.target.value === ""
                                 ? 0
                                 : Number(e.target.value),
                        })
                     }
                  />
               </div>

               <Button type="submit">Set Budget</Button>
            </form>

            <h2 className="text-xl mb-4">Budget vs Actual</h2>
            <div className="h-64 mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                     <XAxis dataKey="category" stroke="#aaa" />
                     <YAxis stroke="#aaa" />
                     <Tooltip />
                     <Bar dataKey="budget" fill="#22c55e" name="Budget" />
                     <Bar dataKey="actual" fill="#ef4444" name="Actual" />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <h2 className="text-xl mb-2">All Budgets</h2>
            <ul className="space-y-1">
               {budgets.map((b, index) => (
                  <li key={b._id || index}>
                     {b.month} - {b.category}: ${b.budget}
                  </li>
               ))}
            </ul>
         </CardContent>
      </Card>
   );
}
