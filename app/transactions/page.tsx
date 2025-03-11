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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { predefinedCategories } from "@/lib/constants";
import { toast } from "sonner";

type Transaction = {
   _id?: string;
   amount: number;
   date: string;
   description: string;
   category?: string;
};

export default function TransactionsPage() {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [form, setForm] = useState<Transaction>({
      amount: 0,
      date: "",
      description: "",
      category: "",
   });
   const [error, setError] = useState("");

   // States for editing functionality
   const [editingTransactionId, setEditingTransactionId] = useState<
      string | null
   >(null);
   const [editForm, setEditForm] = useState<Transaction>({
      amount: 0,
      date: "",
      description: "",
      category: "",
   });

   // Fetch transactions on mount
   useEffect(() => {
      const fetchData = async () => {
         await fetch("/api/transactions")
            .then((res) => res.json())
            .then((data) => {
               setTransactions(data);
               console.log(data);
            })
            .catch((err) => console.error(err));
      };
      fetchData();
   }, []);

   // Add Transaction (POST)
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.amount || !form.date || !form.description) {
         setError("Please fill in all fields.");
         return;
      }
      console.log(form.amount);
      if (form.amount < 0) {
         setError("Amount cannot be negative.");
         return;
      }

      // Validate: Date should not be in the future
      const inputDate = new Date(form.date);
      const today = new Date();
      // Zero-out the time to compare only dates
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate > today) {
         setError("Date cannot be in the future.");
         return;
      }

      setError("");
      try {
         const res = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });
         const newTransaction = await res.json();
         setTransactions([...transactions, newTransaction.ops?.[0] ?? form]);
         // Reset form
         toast.success("Transaction added succesfully");
         setForm({ amount: 0, date: "", description: "", category: "" });
      } catch (error) {
         console.error(error);
      }
   };

   // Delete Transaction (DELETE)
   const handleDelete = async (id: string) => {
      try {
         console.log(id);
         await fetch(`/api/transactions/${id}`, {
            method: "DELETE",
         });
         setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (error) {
         console.error(error);
      }
   };

   // Start Editing: set the transaction to edit in state
   const handleEditClick = (transaction: Transaction) => {
      setEditingTransactionId(transaction._id || null);
      setEditForm(transaction);
   };

   // Cancel Editing
   const handleCancelEdit = () => {
      setEditingTransactionId(null);
      setEditForm({ amount: 0, date: "", description: "", category: "" });
   };

   // Update Transaction (PUT)
   const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();

      //Preventing zero or negative amount input
      if (editForm.amount <= 0) {
         toast.error("Amount should be greater than 0");
         return;
      }

      // Validate: Date should not be in the future
      const inputDate = new Date(form.date);
      const today = new Date();
      // Zero-out the time to compare only dates
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate > today) {
         toast.error("Date cannot be in the future.");
         return;
      }

      setError("");

      try {
         const res = await fetch(`/api/transactions/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
         });
         const updatedTransaction = await res.json();
         // Replace the old transaction with the updated one
         setTransactions((prev) =>
            prev.map((t) =>
               t._id === editingTransactionId ? updatedTransaction : t
            )
         );
         setEditingTransactionId(null);
         setEditForm({ amount: 0, date: "", description: "", category: "" });
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <Card className="bg-black border border-gray-800 text-white max-w-[1200px]">
         <CardHeader>
            <CardTitle className="text-2xl">Transactions</CardTitle>
            <CardDescription>
               Add, edit, and delete your transactions
            </CardDescription>
         </CardHeader>
         <CardContent>
            {/* Transaction Form */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
               {error && <p className="text-red-500">{error}</p>}

               <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                     id="amount"
                     type="number"
                     value={form.amount}
                     onChange={(e) =>
                        setForm({ ...form, amount: Number(e.target.value) })
                     }
                     className="bg-gray-900"
                  />
               </div>

               <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                     id="date"
                     type="date"
                     value={form.date}
                     onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                     }
                     className="bg-gray-900"
                  />
               </div>
               <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                     id="description"
                     type="text"
                     value={form.description}
                     onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                     }
                     className="bg-gray-900"
                  />
               </div>

               <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                     id="category"
                     value={form.category}
                     onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                     }
                     className="border border-gray-700 bg-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="">Select Category</option>
                     {predefinedCategories.map((cat) => (
                        <option key={cat} value={cat}>
                           {cat}
                        </option>
                     ))}
                  </select>
               </div>
               <Button type="submit">Add Transaction</Button>
            </form>

            <h2 className="text-xl mb-2">Transaction List</h2>
            <ul>
               {transactions.map((t, index) => {
                  const isEditing = t._id === editingTransactionId;
                  return (
                     <li
                        key={t._id || index}
                        className="bg-gray-800 p-4 rounded mb-2 transition-colors hover:bg-gray-700"
                     >
                        {isEditing ? (
                           <form onSubmit={handleUpdate} className="space-y-2">
                              <div>
                                 <Label htmlFor={`edit-amount-${index}`}>
                                    Amount
                                 </Label>
                                 <Input
                                    id={`edit-amount-${index}`}
                                    type="number"
                                    value={editForm.amount}
                                    onChange={(e) =>
                                       setEditForm({
                                          ...editForm,
                                          amount: Number(e.target.value),
                                       })
                                    }
                                    className="bg-gray-900"
                                 />
                              </div>
                              <div>
                                 <Label htmlFor={`edit-date-${index}`}>
                                    Date
                                 </Label>
                                 <Input
                                    id={`edit-date-${index}`}
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) =>
                                       setEditForm({
                                          ...editForm,
                                          date: e.target.value,
                                       })
                                    }
                                    className="bg-gray-900"
                                 />
                              </div>
                              <div>
                                 <Label htmlFor={`edit-description-${index}`}>
                                    Description
                                 </Label>
                                 <Input
                                    id={`edit-description-${index}`}
                                    type="text"
                                    value={editForm.description}
                                    onChange={(e) =>
                                       setEditForm({
                                          ...editForm,
                                          description: e.target.value,
                                       })
                                    }
                                    className="bg-gray-900"
                                 />
                              </div>
                              <div>
                                 <Label htmlFor={`edit-category-${index}`}>
                                    Category
                                 </Label>
                                 <select
                                    id={`edit-category-${index}`}
                                    value={editForm.category}
                                    onChange={(e) =>
                                       setEditForm({
                                          ...editForm,
                                          category: e.target.value,
                                       })
                                    }
                                    className="border border-gray-700 bg-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 >
                                    <option value="">Select Category</option>
                                    {predefinedCategories.map((cat) => (
                                       <option key={cat} value={cat}>
                                          {cat}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                              <div className="flex gap-2">
                                 <Button type="submit">Save</Button>
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleCancelEdit}
                                 >
                                    Cancel
                                 </Button>
                              </div>
                           </form>
                        ) : (
                           <div className="flex flex-col">
                              <p>
                                 {t.date} – ${t.amount} – {t.description}{" "}
                                 {t.category ? `[${t.category}]` : ""}
                              </p>
                              <div className="mt-2 flex gap-2">
                                 <Button
                                    size="sm"
                                    onClick={() => handleEditClick(t)}
                                 >
                                    Edit
                                 </Button>
                                 <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => t._id && handleDelete(t._id)}
                                 >
                                    Delete
                                 </Button>
                              </div>
                           </div>
                        )}
                     </li>
                  );
               })}
            </ul>
         </CardContent>
      </Card>
   );
}
