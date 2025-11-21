
import { GoogleGenAI } from "@google/genai";
import { ART_STYLES, COLOR_THEMES } from "../constants";
import { GenerateOptions } from "../types";

// Initialize the Gemini client
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (options: GenerateOptions): Promise<string> => {
  try {
    const style = ART_STYLES.find((s) => s.id === options.styleId);
    const color = COLOR_THEMES.find((c) => c.id === options.colorId);

    // Construct a rich prompt
    let fullPrompt = options.prompt;
    if (style && style.id !== 'none') {
      fullPrompt += `, ${style.promptModifier}`;
    }
    if (color && color.id !== 'none') {
      fullPrompt += `, ${color.promptModifier}`;
    }
    
    // Ensure high quality keywords
    fullPrompt += ", high quality, detailed, no text, no watermark";

    console.log("Generating with prompt:", fullPrompt);
    
    const parts: any[] = [];

    // Add reference image if provided (Sketch)
    if (options.referenceImage) {
      // Remove data URL prefix if present to get raw base64
      const base64Data = options.referenceImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/png',
        }
      });
      
      // If we have an image, we might want to guide the model to follow it
      fullPrompt += ", follow the composition of the reference sketch";
    }

    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Square for general "Canvas" feel
        }
      }
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Convert base64 to a displayable URL
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("未生成图片数据，请尝试不同的描述。");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};
