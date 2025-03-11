import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// DELETE: Remove a transaction by ID
export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
): Promise<NextResponse> {
   const { id } = params;
   try {
      const client = await clientPromise;
      const db = client.db("personal_finance");
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
