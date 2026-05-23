import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

interface ProximityProps {
  npcPosition: [number, number, number];
  npcName: string;
  targetLevelId: number;
}

export const NPCAttentionCatcher: React.FC<ProximityProps> = ({ npcPosition, npcName, targetLevelId }) => {
  const bubbleRef = useRef<THREE.Group>(null);
  const [inRange, setInRange] = useState(false);
  const activeQuest = useDialogueStore((state) => state.activeQuest);

  useFrame((state) => {
    const cameraPos = state.camera.position;
    const npcPosVec = new THREE.Vector3(...npcPosition);
    const distance = cameraPos.distanceTo(npcPosVec);

    const isRecommended = activeQuest?.recommendedNPC === npcName && activeQuest?.recommendedLevel === targetLevelId;
    const nextInRange = distance < 5 && isRecommended;
    
    setInRange((prev) => {
      if (prev !== nextInRange) {
        return nextInRange;
      }
      return prev;
    });
  });

  if (!inRange) return null;

  return (
    <group ref={bubbleRef} position={npcPosition}>
      <Html center distanceFactor={8}>
        <div className="bg-fuchsia-600 text-white rounded-lg px-3 py-1.5 text-xs animate-bounce whitespace-nowrap shadow-lg border border-white/20">
          Clancy! I hear your heart is heavy. Come talk!
        </div>
      </Html>
    </group>
  );
};
