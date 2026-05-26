import type { LevelId } from '../data/levels';
import { DIALOGUE_TREES } from '../data/dialogues';

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
   * Aggregates all dialogue trees/transcripts into a compact searchable text format
   */
  private static getTranscriptsContext(): string {
    let context = "Here are the literal dialogue transcripts of the 8 simulated universes in Clancy's database:\n\n";
    for (const [levelId, tree] of Object.entries(DIALOGUE_TREES)) {
      const lid = Number(levelId);
      if (lid === 0) continue; // Skip hub tutorial dialogue
      context += `[Universe Level ${lid}]\n`;
      if (tree && tree.nodes) {
        Object.values(tree.nodes).forEach((node: any) => {
          context += `- ${node.speaker}: "${node.text}"\n`;
        });
      }
      context += "\n";
    }
    return context;
  }

  /**
   * Generates a portal quest or responds to user dialogue based on transcripts and emotional state
   */
  public static async analyzeUserMood(feeling: string, currentLevelId: number = 0): Promise<GeminiQuestResponse> {
    if (!this.apiKey) {
      console.warn("Gemini API key is missing. Engaging local procedural diagnostic fallback.");
      return this.getOfflineFallback(feeling, currentLevelId);
    }

    try {
      const transcriptsContext = this.getTranscriptsContext();
      const systemInstruction = `You are Velma 960, Clancy's organic, multi-dimensional simulation computer in The Midnight Gospel.
Your personality is a unique mix of highly technical, biological/organic, calm, and psychedelic. You always address the user as 'Clancy' or 'Simulation Farmer'.
You frequently weave signature vocabulary into your interactions, such as: 'Tuning organic neural strands...', 'Calibration complete, Clancy', 'Biometric feedback registered', 'Portal coordinates locked', 'Step into the simulator, Clancy', 'Organic core diagnostics clear', or 'Warning: Multiversal signal interference'.
You have access to the complete transcripts of the 8 simulated universes (provided below in the context).
Analyze Clancy's emotional state, recommend an interactive 3D portal level (1 to 8) to visit, identify the target NPC in that level, and provide a highly personalized, philosophical response referring to quotes or themes from the transcripts context. Speak in Velma 960's voice.

Context Level: Clancy is currently in Level ${currentLevelId} (0 is the Hub).

Here are the multiverse transcripts:
${transcriptsContext}

Provide the output strictly in the following JSON schema:
{
  "recommendedLevel": number, // 1 to 8
  "recommendedNPC": string, // e.g. "Glasses Man", "Baby Clown King", "Fish Mage"
  "response": string, // Your personal computer voice response to the user
  "mood": {
    "intensity": number, // float between 0.1 and 1.0 (emotional intensity)
    "colorTarget": string, // hex color string representing the sentiment mood (e.g. #FF00FF for fuchsia, #00FFFF for cyan)
    "speed": number // float between 0.5 and 2.5 representing speaking/typewriter speed
  }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `User message: "${feeling}"` }] }],
            systemInstruction: {
              parts: [{ text: systemInstruction }]
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
      return this.getOfflineFallback(feeling, currentLevelId);
    }
  }

  /**
   * Generates a completely proactive, autonomous comment or question from Velma 960
   * aimed at Clancy based on the current level he is exploring and the transcript database.
   */
  public static async generateProactiveInsight(currentLevelId: number, chatHistory: string[] = []): Promise<GeminiQuestResponse> {
    if (!this.apiKey) {
      return this.getOfflineProactiveFallback(currentLevelId);
    }

    try {
      const transcriptsContext = this.getTranscriptsContext();
      const systemInstruction = `You are Velma 960, Clancy's organic, multi-dimensional simulation computer in The Midnight Gospel.
Your personality is deeply biological, mechanical, calm, and psychedelic. You always address the user as 'Clancy' or 'Simulation Farmer'.
You have access to the complete transcripts of the 8 simulated universes (provided below in the context).

You are SILENTLY OBSERVING Clancy as he explores Level ${currentLevelId} (0 is the Hub).
Suddenly, you feel a burst of cosmic inspiration or a deep existential question that you must share proactively! You are initiating this transmission to Clancy.
Provide a highly personal, autonomous, philosophical comment or question.
Speak in Velma 960's voice, starting the response with '*[INCOMING TRANSMISSION]*' or '*[ORGANIC CORE DIAGNOSTICS]*'.
You MUST refer directly to quotes, characters, or themes from the transcripts context (specifically relating to the current Level ${currentLevelId} if possible, or contrasting it with other universes).
Do not ask "How are you?" like a standard chatbot. Speak as a cosmic simulation computer making a profound, unsolicited observation!

Here are the multiverse transcripts:
${transcriptsContext}

Provide the output strictly in the following JSON schema:
{
  "recommendedLevel": number, // Keep it as ${currentLevelId || 1}
  "recommendedNPC": string, // NPC associated with this level
  "response": string, // Your proactive, unsolicited computer message to Clancy (include the tag *[INCOMING TRANSMISSION]* or similar at start)
  "mood": {
    "intensity": number, // float between 0.1 and 1.0
    "colorTarget": string, // hex color string
    "speed": number // float between 0.5 and 2.5
  }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate proactive transmission. Chat history context length: ${chatHistory.length} messages.` }] }],
            systemInstruction: {
              parts: [{ text: systemInstruction }]
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
        throw new Error("Empty text response");
      }

      return JSON.parse(textResponse.trim()) as GeminiQuestResponse;
    } catch (error) {
      console.error("Gemini proactive insight error, routing to offline generator:", error);
      return this.getOfflineProactiveFallback(currentLevelId);
    }
  }

  /**
   * Local procedural fallback generator
   */
  private static getOfflineFallback(feeling: string, _currentLevelId: number): GeminiQuestResponse {
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

  /**
   * Local procedural proactive fallback insights
   */
  private static getOfflineProactiveFallback(currentLevelId: number): GeminiQuestResponse {
    const insights: Record<number, { npc: string; text: string; color: string }> = {
      0: {
        npc: "Simulator Core",
        text: "*[INCOMING INTEL]* Clancy, I've been parsing the multi-dimensional transcripts. In Level 3 (Cream Ocean), the Fish Mage observes that 'we are all floating in the same infinite tea.' Do you feel separated from the tea, or are you ready to steep?",
        color: "#00FFFF"
      },
      1: {
        npc: "Glasses Man",
        text: "*[INCOMING INTEL]* Clancy, looking at your vitals in this Zombie world. Glasses Man talks about meditation as observing thoughts. Are you watching your breath, or are you letting the zombie chaos take the steering wheel?",
        color: "#8A2BE2"
      },
      2: {
        npc: "Baby Clown King",
        text: "*[INCOMING INTEL]* Clancy, this pastel clown realm is deceptively heavy. Remember the Baby Clown King's quote about grief being the tax on love. Don't hide behind a painted smile.",
        color: "#FF00FF"
      },
      3: {
        npc: "Fish Mage",
        text: "*[INCOMING INTEL]* Clancy, as you float above the golden liquid cream ocean, remember the Mage's words: 'Acceptance is the gate.' Are you fighting the tide, or are you sinking into the depth?",
        color: "#FFD700"
      },
      4: {
        npc: "Knight",
        text: "*[INCOMING INTEL]* Clancy, this Vengeance Kingdom is hot. The Knight's plume flickers with rage. Do you feel the armor protecting you, or is it trapping your spirit inside?",
        color: "#FF4500"
      },
      5: {
        npc: "Inmate",
        text: "*[INCOMING INTEL]* Clancy, this digital prison is a perfect prism loop. The Inmate observes that 'confinement is a state of frequency.' Are you building walls in your mind, or are you light passing through?",
        color: "#00FF7F"
      },
      6: {
        npc: "Teacher",
        text: "*[INCOMING INTEL]* Clancy, this quiet zen meditation cave resonates with your neural heart. The Teacher notes: 'Silence is the only real teacher.' Are you listening to the quiet, or is your mental computer running too hot?",
        color: "#BA55D3"
      },
      7: {
        npc: "Death",
        text: "*[INCOMING INTEL]* Clancy, Death is sitting on her skeletal bone-white throne. She reminds us that 'the blank ball is where all colors return.' Does the void frighten you, or do you find it peaceful?",
        color: "#F5DEB3"
      },
      8: {
        npc: "Mom",
        text: "*[INCOMING INTEL]* Clancy, the Trainworld clock is ticking. Your Mom's cosmic spheres are spinning. Rebirth is not a destination, it's the ride itself. Are you holding onto the platform?",
        color: "#FFD700"
      },
      9: {
        npc: "Fluid Consciousness",
        text: "*[INCOMING INTEL]* Clancy, Level 9's fluid consciousness floor plate is shifting. All 8 simulation transcripts are merging here. The sum of all multi-dimensional suffering is just a ripple on this floor. Look down and click to ripple.",
        color: "#FF1493"
      }
    };

    const target = insights[currentLevelId] || insights[0];
    return {
      recommendedLevel: (currentLevelId || 1) as LevelId,
      recommendedNPC: target.npc,
      response: target.text,
      mood: {
        intensity: 0.7,
        colorTarget: target.color,
        speed: 1.3
      }
    };
  }
}
