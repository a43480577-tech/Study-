import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function askAI(question: string, context?: string) {
  const prompt = `
    You are an AI Study Assistant for Class 9-12 Indian students. 
    Explain concepts in simple language (mix of Hindi and English/Hinglish if possible).
    
    Student Question: ${question}
    ${context ? `Context/Topic: ${context}` : ""}
    
    Requirements:
    1. Be encouraging and educational.
    2. Solve math problems step-by-step.
    3. Use formatting (bullet points, bold text) for readability.
    4. If the question is in Hindi, respond in Hindi. Otherwise, use English with simple Hindi explanations where appropriate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again later!";
  }
}
