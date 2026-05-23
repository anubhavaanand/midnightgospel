import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useDialogueStore } from '../../store/useDialogueStore';

interface FloatingWord {
  id: string;
  text: string;
  spawnTime: number;
  position: [number, number, number];
  wobbleSpeed: number;
  wobbleIntensity: [number, number, number];
  scale: number;
}

export const KineticDialogue: React.FC = () => {
  const { isOpen, activeText, currentMood } = useDialogueStore();
  const [words, setWords] = useState<FloatingWord[]>([]);
  const nextWordIndexRef = useRef(0);
  const wordQueueRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger word spawning queue when dialogue text updates
  useEffect(() => {
    if (!isOpen || !activeText) {
      setWords([]);
      wordQueueRef.current = [];
      nextWordIndexRef.current = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Split text into individual words
    const newWords = activeText.split(/\s+/).filter(w => w.length > 0);
    wordQueueRef.current = newWords;
    nextWordIndexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    // Dynamic spawn interval mapping based on mood speed (e.g. speed = 1.0 yields 350ms per word)
    const baseSpawnInterval = 320;
    const spawnInterval = Math.max(120, baseSpawnInterval / (currentMood.speed || 1.0));

    timerRef.current = setInterval(() => {
      const queue = wordQueueRef.current;
      const index = nextWordIndexRef.current;

      if (index >= queue.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const wordText = queue[index];
      const wordId = `${wordText}-${index}-${Date.now()}`;

      // Spawn coordinates: starting deep in the background screen space with a small random dispersion
      const spreadX = (Math.random() - 0.5) * 6;
      const spreadY = (Math.random() - 0.5) * 3 + 1.5;
      const initialPos: [number, number, number] = [spreadX, spreadY, -18];

      const wobbleX = 0.5 + Math.random() * 0.8;
      const wobbleY = 0.3 + Math.random() * 0.5;
      const wobbleZ = 0.2 + Math.random() * 0.4;

      const newWord: FloatingWord = {
        id: wordId,
        text: wordText,
        spawnTime: Date.now(),
        position: initialPos,
        wobbleSpeed: 1.5 + Math.random() * 2.5,
        wobbleIntensity: [wobbleX, wobbleY, wobbleZ],
        scale: 0.1 + (currentMood.intensity || 0.5) * 0.3 // base scale multiplier
      };

      setWords((prev) => [...prev, newWord]);
      nextWordIndexRef.current = index + 1;
    }, spawnInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeText, isOpen, currentMood.speed, currentMood.intensity]);

  // Framerate-independent positional updates and automatic cleanup garbage collector
  useFrame(() => {
    const now = Date.now();
    const lifetime = 2800; // time in ms that words live

    setWords((prev) => {
      // Filter out words that have completed their lifetime threshold or flown past the camera
      const active = prev.filter((w) => {
        const elapsed = now - w.spawnTime;
        const currentZ = w.position[2] + (elapsed / 1000) * 8.5; // velocity Z
        return elapsed < lifetime && currentZ < 9;
      });

      // Update position coordinates for remaining active word meshes
      return active.map((w) => {
        const elapsed = (now - w.spawnTime) / 1000;
        
        // Z-axis movement flying towards camera
        const progressZ = w.position[2] + elapsed * 7.5 * (currentMood.speed || 1.0);
        
        // Organic sinusoidal wave offsets to simulate trippy frequency distortion
        const shiftX = w.position[0] + Math.sin(elapsed * w.wobbleSpeed) * w.wobbleIntensity[0] * (currentMood.intensity || 0.5);
        const shiftY = w.position[1] + Math.cos(elapsed * w.wobbleSpeed * 0.8) * w.wobbleIntensity[1] * (currentMood.intensity || 0.5);

        return {
          ...w,
          position: [shiftX, shiftY, progressZ]
        };
      });
    });
  });

  if (!isOpen || words.length === 0) return null;

  const glowColor = currentMood.colorTarget || '#FF00FF';

  return (
    <group>
      {words.map((w) => {
        const now = Date.now();
        const age = now - w.spawnTime;
        
        // Dynamic scaling: swells up as it gets closer to the camera lens
        const progress = Math.min(1.0, age / 2000);
        const scaleFactor = (0.5 + progress * 2.8) * w.scale;

        // Dynamic fading: soft fade-in, and rapid fade-out as it approaches unmount boundary
        let opacity = 1.0;
        if (age < 300) {
          opacity = age / 300; // fade in
        } else if (age > 2200) {
          opacity = Math.max(0, 1.0 - (age - 2200) / 600); // fade out
        }

        return (
          <Text
            key={w.id}
            position={w.position}
            fontSize={0.8}
            scale={[scaleFactor, scaleFactor, scaleFactor]}
            color={glowColor}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff" // Premium elegant MSDF font
            outlineWidth={0.04}
            outlineColor="#000000"
            outlineOpacity={opacity * 0.8}
            fillOpacity={opacity}
          >
            {w.text}
          </Text>
        );
      })}
    </group>
  );
};
