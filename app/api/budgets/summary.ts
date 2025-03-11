import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

// Define the SummaryItem interface
interface SummaryItem {
   category: string;
   budget: number;
   actual: number;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
   }

   try {
      const client = await clientPromise;
      const db = client.db();
      const { month } = req.query;

      if (!month) return res.status(400).json({ error: "Month is required" });

      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const budgetCategories = await db
         .collection("budgets")
         .distinct("category", { month: month as string });

      const expenseCategories = await db
         .collection("transactions")
         .distinct("category", {
            amount: { $lt: 0 }, // Negative amounts indicate expenses
            date: { $gte: startDate, $lt: endDate },
         });

      const allCategories = [
         ...new Set([...budgetCategories, ...expenseCategories]),
      ];

      const summary: SummaryItem[] = await Promise.all(
         allCategories.map(async (category) => {
            const budgetDoc = await db
               .collection("budgets")
               .findOne({ category, month: month as string });
            const budget = budgetDoc ? (budgetDoc as any).budgetAmount : 0;

            const actualResult = await db
               .collection("transactions")
               .aggregate([
                  {
                     $match: {
                        category,
                        amount: { $lt: 0 },
                        date: { $gte: startDate, $lt: endDate },
                     },
                  },
                  {
                     $group: {
                        _id: null,
                        total: { $sum: { $abs: "$amount" } },
                     },
                  },
               ])
               .toArray();
            const actual = actualResult.length > 0 ? actualResult[0].total : 0;

            return { category, budget, actual };
         })
      );

      return res.status(200).json(summary);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
   }
}
