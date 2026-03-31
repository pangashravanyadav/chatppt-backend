import Message from "../models/Message.js";
import generateResponse from "../services/aiService.js";

export const sendMessage = async (req, res) => {
  try {
    // STEP 1: Get data from request body
    const { content, conversationId } = req.body;
    const userId = req.user._id;  // set by protect middleware

    // STEP 2: Validate — don't process empty messages
    if (!content || !conversationId) {
      return res.status(400).json({ 
        error: "content and conversationId are required" 
      });
    }

    // STEP 3: Save user's message to database
    await Message.create({
      role: "user",
      content,
      conversationId,
      userId,
    });

    // STEP 4: Fetch last 10 messages from this conversation
    //         (gives AI context/memory of the conversation)
    const history = await Message.find({ conversationId, userId })
      .sort({ createdAt: 1 })   // oldest first
      .limit(10)
      .select("role content -_id"); // only get role and content fields

    // STEP 5: Format history for OpenAI
    //         (OpenAI needs exactly: [{role, content}])
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // STEP 6: Send to AI — gets reply back
    const aiReply = await generateResponse(formattedHistory);

    // STEP 7: Save AI's reply to database
    const aiMessage = await Message.create({
      role: "assistant",
      content: aiReply,
      conversationId,
      userId,
    });

    // STEP 8: Send response back to client
    res.json({
      success: true,
      message: aiMessage,
    });

  } catch (error) {
    console.error("❌ Chat Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};