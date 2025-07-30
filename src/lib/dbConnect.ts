import mongoose from 'mongoose';

/**
 * Global is used here to maintain the connection state across hot reloads in development.
 * This prevents multiple connections from being created when Next.js rerenders components.
 */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Connection object shared across requests
const mongooseCache = global.mongooseCache || { conn: null, promise: null };

/**
 * Connect to MongoDB
 * @returns MongoDB connection
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If we already have a connection, use it
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // If a connection is being established, wait for it
  if (!mongooseCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds when connecting
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Create new connection promise
    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        mongooseCache.promise = null; // Reset promise to allow retry
        throw error;
      });
  }

  try {
    // Await connection
    mongooseCache.conn = await mongooseCache.promise;
    return mongooseCache.conn;
  } catch (error) {
    // Reset promise on error to allow retry on next request
    mongooseCache.promise = null;
    throw error;
  }
}

// Save connection object to global for reuse across hot reloads
global.mongooseCache = mongooseCache;

export default dbConnect;
