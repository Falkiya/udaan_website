import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MONGODB_URI to Vercel environment variables');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
export async function getDb() {
  const connection = await clientPromise;
  // This automatically connects to the database specified in the URI connection string
  // (usually "test" or "udaan" if appended, otherwise defaults to database name)
  return connection.db();
}
