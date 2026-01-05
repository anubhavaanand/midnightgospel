import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Quote } from '@utils/quotes';

interface FloatingQuoteProps extends Omit<Quote, 'level'> {
  isActive?: boolean;
}

export default function FloatingQuote({
  text,
  author,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  isActive = true
}: FloatingQuoteProps) {
  const textRef = useRef<any>(null);
  const authorRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Fade in/out logic
  const opacityRef = useRef(0);
  const targetOpacity = isActive ? 1 : 0;

  useFrame((state, delta) => {
    // Smooth opacity transition
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 2);

    // Apply floating animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }

    // Apply opacity to text materials
    if (textRef.current) {
      textRef.current.fillOpacity = opacityRef.current;
      textRef.current.outlineOpacity = opacityRef.current * 0.5;
    }
    if (authorRef.current) {
      authorRef.current.fillOpacity = opacityRef.current;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <Text
        ref={textRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.5}
        maxWidth={6}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#2E004F"
        color="white"
      >
        {text}
      </Text>

      <Text
        ref={authorRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.25}
        position={[0, -0.8, 0]}
        color="#00FFFF"
        anchorX="center"
        anchorY="top"
        fontStyle="italic"
      >
        — {author}
      </Text>
    </group>
  );
}
