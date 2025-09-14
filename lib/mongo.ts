import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");
const dbName = process.env.DB_NAME || "MCQs";

let cached = (global as any)._mongo as
  | { client: MongoClient | null; promise: Promise<MongoClient> | null }
  | undefined;

if (!cached) {
  cached = (global as any)._mongo = { client: null, promise: null };
}

export async function getDb(): Promise<Db> {
  if (!cached!.promise) {
    const client = new MongoClient(uri, { maxPoolSize: 8 });
    cached!.promise = client.connect();
  }
  const client = await cached!.promise!;
  return client.db(dbName);
}