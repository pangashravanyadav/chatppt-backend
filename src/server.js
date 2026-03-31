// 1. Load .env variables FIRST — before anything else
import dotenv from "dotenv";
dotenv.config();

// 1. Import express library
import express from "express";

// 2. Import cors library
import cors from "cors";

// 3. Import your DB connection function
import connectDB from "./config/db.js";

// 4. Connect to database immediately
connectDB();

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// 3. Create your app instance — this IS your server
const app = express();

// 4. Middleware: allows server to read JSON from requests
app.use(express.json());

// 5. Middleware: allows frontend (different port) to call this server
const allowedOrigins = [
  "http://localhost:3000",
  "https://chatppt-frontend-gold.vercel.app/","https://chatppt-frontend-pangashravanyadavs-projects.vercel.app/"
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// 6. Your first route — a health check
app.get("/health", (req, res)=> {
  res.json({ status: "Server is alive" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// 8. Use PORT from .env (with fallback to 5000)
const PORT = process.env.PORT || 5000;

// 8. Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
