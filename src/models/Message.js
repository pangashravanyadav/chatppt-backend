// 1. Import mongoose
import mongoose from 'mongoose';

// 2. Define the SHAPE of a message document
const messageSchema = new mongoose.Schema(
  {

    // Who sent the message: either "user" or "assistant"
    role: {
      type: String,
      enum: ['user', 'assistant'], // only these two values allowed
      required: true,
    },

    // The actual message text
    content: {
      type: String,
      required: true,
      trim: true, // remove extra whitespace
    },

    // Which conversation this message belongs to
    // (Important for Phase 6 — multiple conversations)
    conversationId: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    // 3. Automatically adds createdAt and updatedAt fields
    timestamps: true, 
  }
);

// 4. Create the model from the schema
const Message = mongoose.model("Message", messageSchema);

// 5. Export it
export default Message;