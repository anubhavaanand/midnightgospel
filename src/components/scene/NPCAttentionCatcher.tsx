import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';
import type { LevelId } from '../../data/levels';

interface NPCAttentionCatcherProps {
  npcPosition: [number, number, number];
  npcName: string;
  targetLevelId: LevelId;
}

export const NPCAttentionCatcher: React.FC<NPCAttentionCatcherProps> = ({ npcPosition, npcName, targetLevelId }) => {
  const [inRange, setInRange] = useState(false);
  const { isOpen, openDialogue } = useDialogueStore();
  
  // Cache the Vector3 to prevent garbage collection hits every frame
  const npcPosVec = useRef(new THREE.Vector3(...npcPosition));

  useFrame((state) => {
    // Stop evaluating distance if we are actively in the dialogue
    if (isOpen) {
      if (inRange) setInRange(false);
      return;
    }

    const distance = state.camera.position.distanceTo(npcPosVec.current);
    const threshold = 5.0; // 5 units proximity

    if (distance < threshold && !inRange) {
      setInRange(true);
    } else if (distance >= threshold && inRange) {
      setInRange(false);
    }
  });

  // Only mount the HTML payload when in range to save memory
  if (!inRange || isOpen) return null;

  return (
    <group position={npcPosition}>
      {/* Position the bubble slightly above the NPC head (y + 2.5) */}
      <Html center distanceFactor={8} position={[0, 2.5, 0]}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            openDialogue(targetLevelId);
          }}
          className="bg-fuchsia-600/90 hover:bg-fuchsia-500 text-white rounded-lg px-4 py-2 text-sm font-bold cursor-pointer animate-bounce whitespace-nowrap shadow-lg border border-fuchsia-300 backdrop-blur-sm transition-colors"
          style={{ userSelect: 'none', pointerEvents: 'auto' }}
        >
          Talk to {npcName}
        </div>
      </Html>
    </group>
  );
};
