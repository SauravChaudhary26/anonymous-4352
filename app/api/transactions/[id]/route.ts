import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// PUT: Update a transaction by ID
export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
): Promise<NextResponse> {
   const { id } = params;
   const data = await request.json();
   try {
      const client = await clientPromise;
      const db = client.db("yardstick"); // Replace 'yardstick' with your actual DB name if different.
      const result = await db
         .collection("transactions")
         .updateOne({ _id: new ObjectId(id) }, { $set: data });
      return NextResponse.json(result);
   } catch (error: any) {
      return NextResponse.json(
         { message: "Error updating transaction", error: error.message },
         { status: 500 }
      );
   }
}

// DELETE: Remove a transaction by ID
export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
): Promise<NextResponse> {
   const { id } = params;
   try {
      const client = await clientPromise;
      const db = client.db("yardstick");
      const result = await db
         .collection("transactions")
         .deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json(result);
   } catch (error: any) {
      return NextResponse.json(
         { message: "Error deleting transaction", error: error.message },
         { status: 500 }
      );
   }
}
