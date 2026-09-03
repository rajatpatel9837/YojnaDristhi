const mongoose = require('mongoose');

// Disable query buffering so queries fail immediately if MongoDB is not connected
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yojnasetu', {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Running in instant fallback mode with seeded memory store.`);
    isConnected = false;
  }
};

const getDBStatus = () => (mongoose.connection && mongoose.connection.readyState === 1);

module.exports = { connectDB, getDBStatus };
