import { useEffect, useState } from 'react';
import { ShaderPromptTemplate, generateShader } from '@utils/gemini';

/**
 * Hook to generate and manage dynamically created shaders.
 * Caches generated GLSL to avoid redundant API calls.
 */
export const useGeneratedShader = (prompt: ShaderPromptTemplate | null) => {
  const [glslCode, setGlslCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prompt) return;

    const generate = async () => {
      setLoading(true);
      setError(null);
      try {
        const code = await generateShader(prompt);
        setGlslCode(code);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [prompt]);

  return { glslCode, loading, error };
};
