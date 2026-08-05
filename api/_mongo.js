import { MongoClient } from 'mongodb';

// Support multiple common environment variable names for MongoDB
const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGODB_CONNECTION_STRING || process.env.STORAGE_URI;

if (!uri) {
  throw new Error('Please add your MongoDB connection string (MONGODB_URI) to Vercel environment variables');
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
  return connection.db();
}
