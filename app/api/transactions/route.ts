import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
   try {
      const client = await clientPromise;
      const db = client.db("personal_finance");
      const transactions = await db.collection("transactions").find().toArray();
      return NextResponse.json(transactions);
   } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   try {
      const { amount, date, description, category } = await req.json();
      const client = await clientPromise;
      const db = client.db("personal_finance");

      const result = await db.collection("transactions").insertOne({
         amount,
         date,
         description,
         category,
      });

      return NextResponse.json(result);
   } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
