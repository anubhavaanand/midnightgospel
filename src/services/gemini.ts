import type { LevelId } from '../data/levels';

export interface GeminiQuestResponse {
  recommendedLevel: LevelId;
  recommendedNPC: string;
  response: string;
  mood: {
    intensity: number;
    colorTarget: string;
    speed: number;
  };
}

export class GeminiService {
  private static apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  /**
   * Generates a portal quest based on user's feeling
   */
  public static async analyzeUserMood(feeling: string): Promise<GeminiQuestResponse> {
    if (!this.apiKey) {
      console.warn("Gemini API key is missing from environment. Engaging local diagnostic fallback.");
      return this.getOfflineFallback(feeling);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: feeling }] }],
            systemInstruction: {
              parts: [{
                text: `You are Clancy's organic, multi-dimensional simulation computer in The Midnight Gospel.
Analyze the user's emotional state, recommend an interactive 3D portal level (1 to 8) and target NPC, and speak in a helpful, psychedelic computer persona.
Provide the output strictly in the following JSON schema:
{
  "recommendedLevel": number, // 1 to 8
  "recommendedNPC": string, // e.g. "Glasses Man", "Baby Clown King"
  "response": string, // Clancy's computer voice
  "mood": {
    "intensity": number, // float between 0.1 and 1.0
    "colorTarget": string, // hex color string (e.g. #FF00FF, #00FFFF)
    "speed": number // float between 0.5 and 2.5
  }
}`
              }]
            },
            generationConfig: {
              responseMimeType: 'application/json',
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const rawData = await response.json();
      const textResponse = rawData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error("Empty text response from Google Gemini");
      }

      return JSON.parse(textResponse.trim()) as GeminiQuestResponse;
    } catch (error) {
      console.error("Gemini service error, routing to offline portal generator:", error);
      return this.getOfflineFallback(feeling);
    }
  }

  /**
   * Local procedural fallback generator
   */
  private static getOfflineFallback(feeling: string): GeminiQuestResponse {
    const fLower = feeling.toLowerCase();
    let level: LevelId = 1;
    let npc = "Glasses Man";
    let color = "#8A2BE2"; // Purple aura
    let responseText = "Simulation diagnostics clear. My organic sensors detect minor cosmic distortion in your timeline. Portal open.";

    if (fLower.includes("sad") || fLower.includes("lonely") || fLower.includes("heavy") || fLower.includes("anxious")) {
      level = 2;
      npc = "Baby Clown King";
      color = "#FF00FF"; // Soft Fuchsia
      responseText = "Diagnostics indicate elevated heart-heaviness. Calibrating portal coordinates to pastel meadows. Step through.";
    } else if (fLower.includes("angry") || fLower.includes("mad") || fLower.includes("rage")) {
      level = 3;
      npc = "Trudy the Fish";
      color = "#FF3366"; // Fire red/pink
      responseText = "Elevated temperature levels identified. Directing portal trajectory to calm water depths. Trudy is ready to listen.";
    }

    return {
      recommendedLevel: level,
      recommendedNPC: npc,
      response: responseText,
      mood: {
        intensity: 0.6,
        colorTarget: color,
        speed: 1.2
      }
    };
  }
}
