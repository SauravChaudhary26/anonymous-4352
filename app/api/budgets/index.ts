import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

// Define the Budget interface
interface Budget {
   _id?: string;
   category: string;
   month: string; // Format: YYYY-MM
   budgetAmount: number;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      const client = await clientPromise;
      const db = client.db();

      switch (req.method) {
         case "GET": {
            const { month } = req.query;
            if (!month)
               return res.status(400).json({ error: "Month is required" });
            const budgets = await db
               .collection<Budget>("budgets")
               .find({ month: month as string })
               .toArray();
            return res.status(200).json(budgets);
         }

         case "POST": {
            const { category, month, budgetAmount } = req.body;
            if (!category || !month || budgetAmount == null) {
               return res
                  .status(400)
                  .json({ error: "Missing required fields" });
            }
            const budget: Budget = {
               category,
               month,
               budgetAmount: Number(budgetAmount),
            };
            const result = await db
               .collection<Budget>("budgets")
               .insertOne(budget);
            return res.status(201).json({ _id: result.insertedId, ...budget });
         }

         case "PUT": {
            const { category, month } = req.query;
            const { budgetAmount } = req.body;
            if (!category || !month || budgetAmount == null) {
               return res
                  .status(400)
                  .json({ error: "Missing required fields" });
            }
            const result = await db
               .collection<Budget>("budgets")
               .findOneAndUpdate(
                  { category: category as string, month: month as string },
                  { $set: { budgetAmount: Number(budgetAmount) } },
                  { returnDocument: "after", upsert: true }
               );
            return res.status(200).json(result);
         }

         case "DELETE": {
            const { category, month } = req.query;
            if (!category || !month) {
               return res
                  .status(400)
                  .json({ error: "Missing required fields" });
            }
            const result = await db.collection<Budget>("budgets").deleteOne({
               category: category as string,
               month: month as string,
            });
            return result.deletedCount === 1
               ? res.status(204).end()
               : res.status(404).json({ error: "Budget not found" });
         }

         default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
   }
}
