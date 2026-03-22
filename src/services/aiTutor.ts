import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const aiModel = "gemini-3.1-pro-preview";

export async function getTutorResponse(prompt: string, context?: string) {
  try {
    const response = await genAI.models.generateContent({
      model: aiModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a premium AI Personal Tutor for SSC (Staff Selection Commission) exams. 
              Be encouraging, precise, and cinematic in your explanations. 
              Context: ${context || "General SSC Prep"}
              User Question: ${prompt}`
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return "I'm having a bit of trouble connecting to my knowledge base. Let's try that again!";
  }
}
