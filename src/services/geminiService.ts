import { GoogleGenAI, Type } from "@google/genai";
import { QuoteRequest } from "../types";

export const getSmartEstimate = async (data: QuoteRequest) => {
  // Use the platform-provided GEMINI_API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    You are a professional estimator for Trydentt Cleaning Services. 
    Analyze the following quote request and provide a professional estimation.
    Service Type: ${data.serviceType}
    Approx Square Footage: ${data.squareFootage}
    Details: ${data.additionalDetails}
    
    Provide an estimated hours required and 3-4 professional recommendations to ensure the best results.
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimate: {
              type: Type.STRING,
              description: "A summary of estimated time and price range.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific cleaning advice for the requested space.",
            },
          },
          required: ["estimate", "recommendations"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      estimate: "Typically 3-5 hours depending on site condition.",
      recommendations: ["Ensure all surfaces are cleared", "Provide access to water/power", "Securing pets"]
    };
  }
};
