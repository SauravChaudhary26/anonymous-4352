import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(): Promise<NextResponse> {
   try {
      const client = await clientPromise;
      const db = client.db("personal_finance");
      const budgets = await db.collection("budgets").find().toArray();
      return NextResponse.json(budgets);
   } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
         errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      const { category, month, budget } = await req.json();

      if (!category || !month || budget === undefined) {
         return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
         );
      }

      const client = await clientPromise;
      const db = client.db("personal_finance");

      const result = await db.collection("budgets").insertOne({
         category,
         month,
         budget: Number(budget),
      });

      return NextResponse.json(result);
   } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
         errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}
