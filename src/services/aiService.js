import OpenAI from "openai";

// NVIDIA's API is OpenAI-compatible — same library, different baseURL

const SYSTEM_PROMPT = {
  role: "system",
  content: `You are a helpful, friendly AI assistant.
  You give clear and concise answers.
  If you don't know something, you say so honestly.`,
};

const generateResponse = async (messages) => {

  const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
  timeout: 10000, // 10 seconds timeout for NVIDIA API
  });

  console.log("🔑 API Key exists:", !!process.env.NVIDIA_API_KEY);
  console.log("📨 Sending to NVIDIA...");

  try {
    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct-v0.3", // free NVIDIA model
      messages: [
        SYSTEM_PROMPT,
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    console.log("✅ NVIDIA responded");
    const reply = response.choices[0].message.content;
    return reply;

  } catch (error) {
    console.error("❌ NVIDIA API Error:", error.message);
    throw error;
  }
};

export default generateResponse;