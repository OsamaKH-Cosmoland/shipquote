import mongoose from "mongoose";

type MongooseConn = typeof mongoose;

interface MongooseCache {
  conn: MongooseConn | null;
  promise: Promise<MongooseConn> | null;
}

// Cache the connection across warm serverless invocations. Each invocation
// re-imports this module, but `globalThis` persists within a warm container,
// so we reuse the same connection instead of opening a new one per request.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cache;

export async function connectDB(): Promise<MongooseConn | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set — skipping database connection");
    return null;
  }

  // Already connected — reuse it.
  if (cache.conn) {
    return cache.conn;
  }

  // Connection in flight (e.g. concurrent cold-start requests) — share it.
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((conn) => {
      console.log("MongoDB connected successfully");
      return conn;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    // Never throw: keep the server (and /health) alive even when the database
    // is unreachable. Reset the promise so a later request can retry.
    cache.promise = null;
    console.error("MongoDB connection failed:", err);
    return null;
  }

  return cache.conn;
}
