import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/chat
router.post("/",protect, sendMessage);

export default router;