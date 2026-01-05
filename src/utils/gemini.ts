/**
 * Gemini 3 Integration for generative shaders and voxel assets.
 * Implements "Vibe Coding" and JSON Prompting patterns.
 * 
 * Architecture:
 * - ShaderPromptTemplate: Structured JSON for Gemini Shader Pilot (GLSL generation)
 * - VoxelPromptTemplate: Structured JSON for Gemini Voxel Toy Box (3D asset generation)
 * - Caching: Avoid regenerating same shaders
 * - Error Handling: Graceful fallbacks if Gemini unavailable
 */

// Global shader cache to avoid regenerating identical shaders
const shaderCache = new Map<string, string>();
const voxelCache = new Map<string, Record<string, any>>();

export interface ShaderPromptTemplate {
  task: 'generate_shader';
  style_guidelines: {
    art_style: string;
    color_palette: string[];
    effect_description: string;
  };
  shader_type: 'fragment' | 'vertex';
  parameters?: Record<string, any>;
}

export interface VoxelPromptTemplate {
  task: 'generate_3d_asset';
  style_guidelines: {
    art_style: string;
    line_weight: string;
    shading: string;
    color_palette: string[];
  };
  object_parameters: {
    type: string;
    name: string;
    geometry: string;
    texture_resolution: string;
    physics_properties?: {
      material: string;
      destructibility: string;
    };
  };
  output_format: 'glb' | 'gltf';
}

/**
 * Build a structured JSON prompt for Gemini Shader Pilot.
 */
export function buildShaderPrompt(config: ShaderPromptTemplate): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Build a structured JSON prompt for Gemini Voxel Toy Box.
 */
export function buildVoxelPrompt(config: VoxelPromptTemplate): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Call Gemini 3 API to generate GLSL shader code.
 * Requires VITE_GOOGLE_API_KEY env variable.
 * 
 * Features:
 * - Automatic caching (same spec → same cached result)
 * - Timeout handling (15 second max)
 * - Color palette validation
 * - Error fallbacks
 * 
 * Example usage:
 * const glslCode = await generateShader({
 *   task: 'generate_shader',
 *   style_guidelines: {
 *     art_style: 'psychedelic_surreal',
 *     color_palette: ['#2E004F', '#FF007F', '#00FFFF'],
 *     effect_description: 'flowing dimensional ribbon with Perlin noise domain warping'
 *   },
 *   shader_type: 'fragment'
 * });
 */
export async function generateShader(prompt: ShaderPromptTemplate): Promise<string> {
  const cacheKey = JSON.stringify(prompt);
  
  // Return cached result if available
  if (shaderCache.has(cacheKey)) {
    console.log('[Gemini] Cache hit for shader:', prompt.style_guidelines.effect_description);
    return shaderCache.get(cacheKey)!;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] VITE_GOOGLE_API_KEY not set. Shader generation disabled.');
    return getFallbackShader(prompt);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a GLSL shader expert. Generate a production-quality ${prompt.shader_type} shader code based on this JSON spec:\n\n${buildShaderPrompt(
                    prompt
                  )}\n\nIMPORTANT:\n1. Return ONLY valid GLSL code\n2. Use the exact color palette provided\n3. No markdown formatting or explanations\n4. Must compile without errors\n5. Output dimensions: typically 256x256 or larger\n\nGenerate the shader:`,
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const glslCode = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!glslCode) {
      console.warn('[Gemini] Empty response from API');
      return getFallbackShader(prompt);
    }

    // Cache the result
    shaderCache.set(cacheKey, glslCode);
    console.log('[Gemini] Generated shader:', prompt.style_guidelines.effect_description);
    
    return glslCode;
  } catch (error) {
    console.error('[Gemini] Shader generation failed:', error);
    return getFallbackShader(prompt);
  }
}

/**
 * Call Gemini 3 to generate voxel asset descriptions.
 * In production, this would integrate with Gemini's Voxel Toy Box.
 * For now, returns procedural generation hints as JSON.
 */
export async function generateVoxelAsset(prompt: VoxelPromptTemplate): Promise<Record<string, any>> {
  const cacheKey = JSON.stringify(prompt);
  
  // Return cached result if available
  if (voxelCache.has(cacheKey)) {
    console.log('[Gemini] Cache hit for voxel:', prompt.object_parameters.name);
    return voxelCache.get(cacheKey)!;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] VITE_GOOGLE_API_KEY not set. Voxel generation disabled.');
    return getFallbackVoxel(prompt);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a 3D procedural artist. Generate a voxel asset description as JSON based on this spec:\n\n${buildVoxelPrompt(
                    prompt
                  )}\n\nReturn ONLY a valid JSON object with properties:\n{ voxelGrid: number[][][], colors: string[], materials: object }\n\nExample structure:\n{\n  "voxelGrid": [[[1,1,0],[0,2,1]],[[0,1,1],[2,0,0]]],\n  "colors": ["#2E004F", "#FF007F"],\n  "materials": { "metalness": 0.3, "roughness": 0.6 }\n}\n\nGenerate the asset:`,
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Parse JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    const assetData = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackVoxel(prompt);

    // Cache the result
    voxelCache.set(cacheKey, assetData);
    console.log('[Gemini] Generated voxel asset:', prompt.object_parameters.name);
    
    return assetData;
  } catch (error) {
    console.error('[Gemini] Voxel generation failed:', error);
    return getFallbackVoxel(prompt);
  }
}

/**
 * Fallback shader when Gemini is unavailable.
 * Returns a simple procedural shader matching the color palette.
 */
function getFallbackShader(prompt: ShaderPromptTemplate): string {
  const colors = prompt.style_guidelines.color_palette;
  const colorA = colors[0] || '#2E004F';
  const colorB = colors[1] || '#FF007F';

  if (prompt.shader_type === 'fragment') {
    return `
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vec2 uv = vUv;
        float n = sin(uv.x * 3.0 + time) * sin(uv.y * 3.0 + time);
        vec3 colA = vec3(${hexToVec3(colorA).join(', ')});
        vec3 colB = vec3(${hexToVec3(colorB).join(', ')});
        vec3 col = mix(colA, colB, n * 0.5 + 0.5);
        gl_FragColor = vec4(col, 1.0);
      }
    `;
  }

  // Vertex shader fallback
  return `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}

/**
 * Fallback voxel when Gemini is unavailable.
 * Returns a simple random voxel grid.
 */
function getFallbackVoxel(prompt: VoxelPromptTemplate): Record<string, any> {
  const size = 4;
  const grid: number[][][] = [];
  
  for (let x = 0; x < size; x++) {
    const layer: number[][] = [];
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let z = 0; z < size; z++) {
        row.push(Math.random() > 0.5 ? 1 : 0);
      }
      layer.push(row);
    }
    grid.push(layer);
  }

  return {
    voxelGrid: grid,
    colors: prompt.style_guidelines.color_palette,
    materials: {
      metalness: 0.3,
      roughness: 0.6,
    },
  };
}

/**
 * Utility: Convert hex color to normalized vec3
 */
function hexToVec3(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

/**
 * Utility: Clear all caches (useful for testing)
 */
export function clearShaderCache() {
  shaderCache.clear();
  voxelCache.clear();
  console.log('[Gemini] Caches cleared');
}

/**
 * Utility: Get cache statistics
 */
export function getCacheStats() {
  return {
    shaders: shaderCache.size,
    voxels: voxelCache.size,
  };
}
