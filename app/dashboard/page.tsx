"use client";

import { useState, useEffect } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import {
   ResponsiveContainer,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   PieChart,
   Pie,
   Cell,
} from "recharts";

type Transaction = {
   _id?: string;
   amount: number;
   date: string;
   description: string;
   category?: string;
};

export default function DashboardPage() {
   const [transactions, setTransactions] = useState<Transaction[]>([]);

   useEffect(() => {
      fetch("/api/transactions")
         .then((res) => res.json())
         .then((data) => setTransactions(data))
         .catch((err) => console.error(err));
   }, []);

   // 1. Calculate total expenses
   const totalExpenses = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
   );

   // 2. Recent transactions (last 5)
   const recentTransactions = [...transactions].reverse().slice(0, 5);

   // 3. Monthly expense data for a bar chart
   //    Group by YYYY-MM
   const formatDate = (date: string) => {
      const d = new Date(date);
      return `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`; // MM-YYYY format
   };

   const monthlyMap: Record<string, number> = {};
   transactions.forEach((t) => {
      const month = formatDate(t.date); // Format date correctly
      monthlyMap[month] = (monthlyMap[month] || 0) + Number(t.amount);
   });

   const monthlyData = Object.entries(monthlyMap).map(([month, expense]) => ({
      month,
      expense,
   }));

   // 4. Category breakdown for a pie chart
   const categoryMap: Record<string, number> = {};
   transactions.forEach((t) => {
      if (t.category) {
         categoryMap[t.category] =
            (categoryMap[t.category] || 0) + Number(t.amount);
      }
   });
   const categoryData = Object.entries(categoryMap).map(([cat, value]) => ({
      name: cat,
      value,
   }));

   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA46BE"];

   return (
      <div className="space-y-8">
         {/* Summary Card */}
         <Card className="bg-black border border-gray-800 text-white">
            <CardHeader>
               <CardTitle className="text-2xl">Dashboard</CardTitle>
               <CardDescription>Your financial overview</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-lg mb-2">
                  Total Expenses: ${totalExpenses.toFixed(2)}
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                  {/* Monthly Expenses Bar Chart */}
                  <div className="h-64">
                     <h2 className="mb-2">Monthly Expenses</h2>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                           <XAxis dataKey="month" stroke="#aaa" />
                           <YAxis stroke="#aaa" />
                           <Tooltip />
                           <Bar dataKey="expense" fill="#38bdf8" />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>

                  {/* Category Breakdown Pie Chart */}
                  <div className="h-64">
                     <h2 className="mb-2">Category Breakdown</h2>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={categoryData}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                           >
                              {categoryData.map((entry, index) => (
                                 <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                 />
                              ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Recent Transactions Card */}
         <Card className="bg-black border border-gray-800 text-white">
            <CardHeader>
               <CardTitle>Recent Transactions</CardTitle>
               <CardDescription>Last 5 entries</CardDescription>
            </CardHeader>
            <CardContent>
               <ul className="space-y-1">
                  {recentTransactions.map((t, index) => (
                     <li key={t._id || index}>
                        {t.date} – ${t.amount} – {t.description}{" "}
                        {t.category && `[${t.category}]`}
                     </li>
                  ))}
               </ul>
            </CardContent>
         </Card>
      </div>
   );
}
