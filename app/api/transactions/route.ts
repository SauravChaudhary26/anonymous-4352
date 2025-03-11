import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(): Promise<NextResponse> {
   try {
      const client = await clientPromise;
      const db = client.db("personal_finance");
      const transactions = await db.collection("transactions").find().toArray();
      return NextResponse.json(transactions);
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
   } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
         errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
   try {
      const { _id, amount, date, description, category } = await req.json();

      if (!ObjectId.isValid(_id)) {
         return NextResponse.json(
            { message: "Invalid transaction ID" },
            { status: 400 }
         );
      }

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

      if (!result) {
         return NextResponse.json(
            { message: "Transaction not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(result);
   } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
         errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}
