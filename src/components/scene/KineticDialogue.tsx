import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';
import { PositionalDialogueAudio } from '../audio/PositionalDialogueAudio';

interface KineticDialogueProps {
  position?: [number, number, number];
}

/**
 * KineticDialogue Component
 * Renders spatial 3D text using SDF for absolute sharpness.
 * Prints text character-by-character (typewriter style) with mood-driven speed.
 * Generates mood-reactive spatial retro synth blips during printing.
 * Wobbles the physical billboard based on narrative mood intensity.
 */
export const KineticDialogue: React.FC<KineticDialogueProps> = ({ position = [0, 2, 0] }) => {
  const { isOpen, activeText, currentMood, advanceNode } = useDialogueStore();
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const textRef = useRef<any>(null);

  const [displayedText, setDisplayedText] = useState('');
  const [tickCount, setTickCount] = useState(0);

  // Typewriter effect synced with activeText changes and mood speed
  useEffect(() => {
    if (!isOpen || !activeText) {
      setDisplayedText('');
      setTickCount(0);
      return;
    }

    setDisplayedText('');
    setTickCount(0);

    let index = 0;
    const baseSpeed = 40; // Default ms per character
    const speed = baseSpeed / (currentMood.speed || 1.0);

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + activeText.charAt(index));
      setTickCount((prev) => prev + 1);
      index++;

      if (index >= activeText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, activeText, currentMood.speed]);

  // Auto-advance logic triggered after the typewriter finishes printing
  useEffect(() => {
    if (!isOpen || !activeText || displayedText.length < activeText.length) return;

    // Grace period for user reading: at least 2 seconds, scaled by text length
    const delay = Math.max(2000, activeText.length * 30);
    
    const timer = setTimeout(() => {
      advanceNode(activeLevelId);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, activeText, displayedText, advanceNode, activeLevelId]);

  // Framerate-independent mood wobble (position only — no scale to keep SDF text sharp)
  useFrame(({ clock }) => {
    if (textRef.current && currentMood.intensity) {
      const t = clock.getElapsedTime();
      const intensity = currentMood.intensity;
      textRef.current.position.y = Math.sin(t * 2) * 0.1 * intensity;
    }
  });

  if (!isOpen || !activeText) return null;

  const glowColor = currentMood.colorTarget || '#FF00FF';

  return (
    <>
      <PositionalDialogueAudio position={position} tickCount={tickCount} />
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={position}>
        <Text
          ref={textRef}
          fontSize={0.6}
          color={glowColor}
          anchorX="center"
          anchorY="bottom"
          maxWidth={6}
          textAlign="center"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {displayedText}
        </Text>
      </Billboard>
    </>
  );
};
