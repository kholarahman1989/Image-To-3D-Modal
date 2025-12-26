
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateCharacterConcept = async (prompt: string, base64Image?: string) => {
  try {
    const parts: any[] = [
      { text: `Analyze this character concept/image: ${prompt}. Extract 3D modeling parameters and return JSON. Match the schema provided.` }
    ];

    if (base64Image) {
      // Remove data:image/xxx;base64, prefix if exists
      const cleanBase64 = base64Image.split(',')[1] || base64Image;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for safety, browser file picker handles various
          data: cleanBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            backstory: { type: Type.STRING },
            attributes: {
              type: Type.OBJECT,
              properties: {
                height: { type: Type.NUMBER, description: "Value from 0.5 to 2.0" },
                width: { type: Type.NUMBER, description: "Value from 0.5 to 2.0" },
                skinColor: { type: Type.STRING, description: "Hex color code" },
                muscleMass: { type: Type.NUMBER, description: "Value from 0 to 1" }
              }
            }
          },
          required: ["name", "description", "attributes"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
