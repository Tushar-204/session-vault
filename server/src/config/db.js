import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler
 * Establishes Mongoose connection with error handling and lifecycle event listeners.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sessionvault';
    
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Runtime Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Mongoose connection lost.');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[Database] Mongoose disconnected through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};
