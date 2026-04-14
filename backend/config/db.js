import mongoose from 'mongoose';

// Connection options for best performance & security
const options = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // timeout after 5s
  socketTimeoutMS: 45000,         // close sockets after 45s
  maxPoolSize: 10,                // max 10 connections at once
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected - Retrying...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown - close DB when server stops
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 MongoDB Closed - Server Shutdown');
  process.exit(0);
});

export default connectDB;