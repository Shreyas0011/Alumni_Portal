import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connects to MongoDB.
 * - MONGODB_URI (local mongod, Docker, or MongoDB Atlas) is the normal path.
 * - USE_MEMORY_DB=true spins up a throwaway in-memory mongod for quick local
 *   trials when MongoDB isn't installed. Data is lost when the server stops.
 */
export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (process.env.USE_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('overall360');
    console.log('[db] Using in-memory MongoDB (data resets on restart)');
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.');
  }

  // Portal collections use flexible schemas, so filters on fields like `email`
  // must not be stripped by strictQuery.
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`[db] Connected to MongoDB database "${mongoose.connection.name}"`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
