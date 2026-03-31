// 1. Import mongoose — our tool to talk to MongoDB
import mongoose from "mongoose";

// 2. Function that connects to the database
const connectDB = async () => {
  try {

    // 3. Use the URL from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 4. If connected, log which host we connected to
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    // 5. If connection fails, log the error and EXIT the process
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // 1 = exit with failure
  }
};

// 6. Export so server.js can use it
export default connectDB;