import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Quote } from '@utils/quotes';
import { useSceneStore } from '@store/sceneStore';

interface FloatingQuoteProps extends Omit<Quote, 'level'> {
  isActive?: boolean;
}

/**
 * Interactive Floating Quote Component
 * 
 * Features:
 * - Hover effects with glow and scale
 * - Click to save quote to journal
 * - Gentle floating animation
 * - Look-at camera behavior
 */
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
  const glowRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Get quote save function and current level from store
  const saveQuote = useSceneStore((state) => state.saveQuote);
  const activeLevel = useSceneStore((state) => state.activeLevel);

  // Fade in/out logic
  const opacityRef = useRef(0);
  const targetOpacity = isActive ? 1 : 0;
  const hoverScale = useRef(1);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);

    // Save quote to journal with current level
    if (saveQuote) {
      saveQuote({ text, author, level: activeLevel });
    }

    // Visual feedback - brief pulse
    setTimeout(() => setClicked(false), 500);
  };

  useFrame((state, delta) => {
    // Smooth opacity transition
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 2);

    // Smooth hover scale
    const targetScale = hovered ? 1.15 : 1;
    hoverScale.current = THREE.MathUtils.lerp(hoverScale.current, targetScale, delta * 8);

    // Apply floating animation with rotation
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
      groupRef.current.position.x = position[0] + Math.sin(time * 0.3) * 0.1;

      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;

      // Apply hover/click scale
      const clickScale = clicked ? 1.3 : 1;
      groupRef.current.scale.setScalar(scale * hoverScale.current * clickScale);
    }

    // Update glow on hover
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered ? 0.3 : 0.05;
    }

    // Apply opacity to text materials
    if (textRef.current) {
      textRef.current.fillOpacity = opacityRef.current;
      textRef.current.outlineOpacity = opacityRef.current * 0.5;
      // Change color on hover
      textRef.current.color = hovered ? '#00FFFF' : clicked ? '#FF007F' : 'white';
    }
    if (authorRef.current) {
      authorRef.current.fillOpacity = opacityRef.current;
      authorRef.current.color = hovered ? '#FF007F' : '#00FFFF';
    }
  });

  if (!isActive && opacityRef.current < 0.01) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Background glow panel */}
      <mesh ref={glowRef} position={[0, -0.2, -0.5]}>
        <planeGeometry args={[7, 2.5]} />
        <meshBasicMaterial
          color={clicked ? "#FF007F" : "#00FFFF"}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Quote text */}
      <Text
        ref={textRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.5}
        maxWidth={6}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor={hovered ? "#FF007F" : "#2E004F"}
        color="white"
      >
        "{text}"
      </Text>

      {/* Author text */}
      <Text
        ref={authorRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.25}
        position={[0, -0.9, 0]}
        color="#00FFFF"
        anchorX="center"
        anchorY="top"
      >
        — {author}
      </Text>

      {/* Click hint (visible on hover) */}
      {hovered && (
        <Text
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          fontSize={0.15}
          position={[0, -1.3, 0]}
          color="#FF007F"
          anchorX="center"
          anchorY="top"
          fillOpacity={0.7}
        >
          Click to save to journal
        </Text>
      )}

      {/* Saved indicator */}
      {clicked && (
        <mesh position={[3, 0.5, 0]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      )}
    </group>
  );
}
