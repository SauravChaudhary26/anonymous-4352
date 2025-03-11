import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

export async function PUT(req: NextRequest) {
   try {
      const { _id, amount, date, description, category } = await req.json();
      const client = await clientPromise;
      const db = client.db("personal_finance");

      const result = await db.collection("transactions").findOneAndReplace(
         { _id: new ObjectId(_id) },
         {
            amount,
            date,
            description,
            category,
         },
         { returnDocument: "after" }
      );
      return NextResponse.json(result);
   } catch (error: any) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
