import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';

interface KineticDialogueProps {
  position?: [number, number, number];
}

export const KineticDialogue: React.FC<KineticDialogueProps> = ({ position = [0, 2, 0] }) => {
  const { isOpen, activeText, currentMood, advanceNode } = useDialogueStore();
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const textRef = useRef<any>(null);

  // Auto-advance logic based on string length
  useEffect(() => {
    if (!isOpen || !activeText) return;

    // Calculate delay: 50ms per character, minimum 2 seconds
    const delay = Math.max(2000, activeText.length * 50);
    
    const timer = setTimeout(() => {
      advanceNode(activeLevelId);
    }, delay);

    return () => clearTimeout(timer);
  }, [isOpen, activeText, advanceNode, activeLevelId]);

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
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={position}>
      <Text
        ref={textRef}
        fontSize={0.6}
        color={glowColor}
        anchorX="center"
        anchorY="bottom"
        maxWidth={6}
        textAlign="center"
        font="https://fonts.gstatic.com/s/outfit/v11/0oWkYn31adA7zp0t7TxB6H8.woff"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {activeText}
      </Text>
    </Billboard>
  );
};
