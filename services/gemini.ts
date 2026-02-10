import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("未找到 API Key。");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            text: "请生成该音频文件的逐字稿。请使用 Markdown 格式。",
          },
          {
            inlineData: {
              mimeType: "audio/mp4", // Common container for m4a
              data: base64Audio,
            },
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Lower temperature for more accurate transcription
      },
    });

    return response.text || "未能生成逐字稿。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "转写音频时失败。");
  }
};