// app/api/budgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
   try {
      const client = await clientPromise;
      const db = client.db("personal_finance");
      const budgets = await db.collection("budgets").find().toArray();
      return NextResponse.json(budgets);
   } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   try {
      const { category, month, budget } = await req.json();
      const client = await clientPromise;
      const db = client.db("personal_finance");

      const result = await db.collection("budgets").insertOne({
         category,
         month,
         budget: Number(budget),
      });

      return NextResponse.json(result);
   } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
