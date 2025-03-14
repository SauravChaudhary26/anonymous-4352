import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
   throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

interface GlobalMongo {
   _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = globalThis as GlobalMongo;

if (process.env.NODE_ENV === "development") {
   if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
   }
   clientPromise = globalWithMongo._mongoClientPromise;
} else {
   client = new MongoClient(uri, options);
   clientPromise = client.connect();
}

export default clientPromise;
