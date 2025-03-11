import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      const { id } = await req.json();

      // Convert the id string to a MongoDB ObjectId:
      const objectId = new ObjectId(id);

      const client = await clientPromise;
      const db = client.db("personal_finance");

      const result = await db
         .collection("transactions")
         .findOneAndDelete({ _id: objectId });

      return NextResponse.json(result);
   } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
         errorMessage = error.message;
         console.log(errorMessage);
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}
