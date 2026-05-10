/**
 * E2: Particle Trail System - Refined Fluid Animation
 * 
 * Features:
 * - Spring physics for organic movement
 * - Smooth easing with custom curves
 * - Momentum-based particle trailing
 * - Fluid circle formation with staggered timing
 * - Breathing, pulsing, and wave effects
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@store/sceneStore';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

// Level-specific trail colors
const LEVEL_TRAIL_COLORS = [
    '#00ffff', '#ff3333', '#ffcc00', '#00aaff',
    '#ff9900', '#9900ff', '#ffffff',
];

// Configuration - base values, adjusted per device
const BASE_PARTICLE_COUNT = 150;
const CIRCLE_RADIUS = 0.5;
const STATIONARY_THRESHOLD = 0.0005;
const SPRING_STIFFNESS = 8;
const SPRING_DAMPING = 0.85;

// Smooth easing function
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Particle state interface
interface ParticleState {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    targetPosition: THREE.Vector3;
    baseAngle: number;
    ring: number;
    phase: number;
    size: number;
    targetSize: number;
}

export default function ParticleTrail() {
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const particlesRef = useRef<THREE.Points>(null);
    const { camera } = useThree();
    const config = useDeviceDetection();

    // Adjust particle count based on device
    const PARTICLE_COUNT = useMemo(() => {
        if (config.isLowEnd) return 0;
        if (config.isMobile) return Math.floor(BASE_PARTICLE_COUNT * 0.4); // 40% for mobile
        if (config.isTablet) return Math.floor(BASE_PARTICLE_COUNT * 0.6); // 60% for tablet
        return BASE_PARTICLE_COUNT; // Full for desktop
    }, [config.isLowEnd, config.isMobile, config.isTablet]);

    // Mouse tracking with smoothing
    const mousePosition = useRef(new THREE.Vector3());
    const smoothedMouse = useRef(new THREE.Vector3());
    const mouseVelocity = useRef(new THREE.Vector3());
    const prevMousePosition = useRef(new THREE.Vector3());

    // Animation state
    const circleBlend = useRef(0);
    const targetCircleBlend = useRef(0);
    const circleRotation = useRef(0);
    const stationaryTime = useRef(0);
    const globalTime = useRef(0);

    // Per-particle state for smooth individual animations
    const particleStates = useRef<ParticleState[]>([]);

    // Initialize particle states
    useEffect(() => {
        if (config.isLowEnd || PARTICLE_COUNT === 0) {
            particleStates.current = [];
            return;
        }
        particleStates.current = Array(PARTICLE_COUNT).fill(null).map((_, i) => ({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            baseAngle: (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.2,
            ring: i % 4, // 4 rings for more variation
            phase: Math.random() * Math.PI * 2, // Random phase offset
            size: 0.04,
            targetSize: 0.04,
        }));
    }, [PARTICLE_COUNT, config.isLowEnd]);

    // Generate buffer arrays
    const [positions, colors, sizes] = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const col = new Float32Array(PARTICLE_COUNT * 3);
        const siz = new Float32Array(PARTICLE_COUNT);
        return [pos, col, siz];
    }, [PARTICLE_COUNT]);

    // Update colors on level change
    useEffect(() => {
        if (config.isLowEnd || PARTICLE_COUNT === 0 || !particlesRef.current) return;
        const color = new THREE.Color(LEVEL_TRAIL_COLORS[activeLevel] || '#ffffff');
        const colorAttr = particlesRef.current.geometry.getAttribute('color') as THREE.BufferAttribute;
        if (!colorAttr) return;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Slight color variation per particle
            const hsl = { h: 0, s: 0, l: 0 };
            color.getHSL(hsl);
            const variedColor = new THREE.Color().setHSL(
                hsl.h + (Math.random() - 0.5) * 0.05,
                hsl.s,
                hsl.l + (Math.random() - 0.5) * 0.1
            );
            colorAttr.setXYZ(i, variedColor.r, variedColor.g, variedColor.b);
        }
        colorAttr.needsUpdate = true;
    }, [activeLevel, PARTICLE_COUNT, config.isLowEnd]);

    useFrame((state) => {
        if (
            config.isLowEnd ||
            PARTICLE_COUNT === 0 ||
            !particlesRef.current ||
            particleStates.current.length < PARTICLE_COUNT
        ) {
            return;
        }

        const delta = Math.min(state.clock.getDelta(), 0.05); // Cap delta to prevent jumps
        globalTime.current += delta;
        const time = globalTime.current;

        // === MOUSE TRACKING WITH SMOOTHING ===
        const mouse = state.mouse;
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        mousePosition.current.copy(camera.position.clone().add(dir.multiplyScalar(dist * 0.35)));

        // Smooth mouse position using lerp
        smoothedMouse.current.lerp(mousePosition.current, 0.15);

        // Calculate mouse velocity
        mouseVelocity.current.subVectors(mousePosition.current, prevMousePosition.current);
        prevMousePosition.current.copy(mousePosition.current);
        const speed = mouseVelocity.current.length();

        // === STATIONARY DETECTION WITH HYSTERESIS ===
        if (speed < STATIONARY_THRESHOLD) {
            stationaryTime.current += delta;
            if (stationaryTime.current > 0.3) {
                targetCircleBlend.current = 1;
            }
        } else {
            stationaryTime.current = 0;
            targetCircleBlend.current = 0;
        }

        // === SMOOTH BLEND TRANSITION ===
        // Use different speeds for entering vs exiting circle mode
        const enterSpeed = 2.5;
        const exitSpeed = 4.5;
        const blendSpeed = targetCircleBlend.current > circleBlend.current ? enterSpeed : exitSpeed;
        circleBlend.current += (targetCircleBlend.current - circleBlend.current) * delta * blendSpeed;
        circleBlend.current = Math.max(0, Math.min(1, circleBlend.current));

        // Apply easing to the blend
        const easedBlend = easeOutCubic(circleBlend.current);

        // === CIRCLE ROTATION ===
        const rotationSpeed = 1.2 + Math.sin(time * 0.5) * 0.3; // Variable speed
        circleRotation.current += delta * rotationSpeed * easedBlend;

        // === UPDATE EACH PARTICLE ===
        const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const sizeAttr = particlesRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particleStates.current[i];
            const normalizedIndex = i / PARTICLE_COUNT;

            // === TRAIL POSITION (moving mode) ===

            // Add momentum - particles continue in direction of mouse movement
            const momentumFactor = 0.3 * (1 - normalizedIndex);
            const trailTarget = smoothedMouse.current.clone()
                .add(mouseVelocity.current.clone().multiplyScalar(-momentumFactor * 20 * normalizedIndex));

            // Organic wobble
            const wobbleAmount = 0.08 * (1 - normalizedIndex);
            const wobbleX = Math.sin(time * 3 + p.phase) * wobbleAmount;
            const wobbleY = Math.cos(time * 2.5 + p.phase * 1.3) * wobbleAmount;
            const wobbleZ = Math.sin(time * 2 + p.phase * 0.7) * wobbleAmount * 0.5;

            const trailPos = new THREE.Vector3(
                trailTarget.x + wobbleX,
                trailTarget.y + wobbleY,
                trailTarget.z + wobbleZ
            );

            // === CIRCLE POSITION (stationary mode) ===
            // Staggered entry into circle - earlier particles arrive first
            const staggerDelay = normalizedIndex * 0.3;
            const staggeredBlend = easeOutCubic(Math.max(0, Math.min(1,
                (easedBlend - staggerDelay) / (1 - staggerDelay)
            )));

            // Ring configuration with variation
            const ringConfig = [
                { radius: 0.3, speed: 1.0, verticalAmp: 0.06 },
                { radius: 0.45, speed: -0.7, verticalAmp: 0.08 },
                { radius: 0.6, speed: 0.5, verticalAmp: 0.05 },
                { radius: 0.75, speed: -0.35, verticalAmp: 0.1 },
            ][p.ring];

            // Breathing effect
            const breathe = Math.sin(time * 2 + p.ring * 0.5) * 0.05;
            const ringRadius = (ringConfig.radius + breathe) * CIRCLE_RADIUS * 2;

            // Animated orbital position
            const orbitAngle = p.baseAngle + circleRotation.current * ringConfig.speed;

            // Vertical wave for 3D appearance
            const verticalWave = Math.sin(orbitAngle * 2 + time * 1.5) * ringConfig.verticalAmp;

            // Slight depth variation
            const depthWave = Math.sin(orbitAngle + time) * 0.03;

            const circlePos = new THREE.Vector3(
                smoothedMouse.current.x + Math.cos(orbitAngle) * ringRadius,
                smoothedMouse.current.y + Math.sin(orbitAngle) * ringRadius + verticalWave,
                smoothedMouse.current.z + depthWave
            );

            // === SPRING PHYSICS FOR SMOOTH INTERPOLATION ===
            // Calculate target position based on blend
            p.targetPosition.lerpVectors(trailPos, circlePos, staggeredBlend);

            // Apply spring physics
            const displacement = p.targetPosition.clone().sub(p.position);
            const springForce = displacement.multiplyScalar(SPRING_STIFFNESS * delta);
            p.velocity.add(springForce);
            p.velocity.multiplyScalar(SPRING_DAMPING);
            p.position.add(p.velocity.clone().multiplyScalar(delta * 60));

            // === SIZE ANIMATION ===
            // Trail: fading size | Circle: uniform pulsing size
            const trailSize = 0.06 * Math.pow(1 - normalizedIndex, 1.5);
            const pulsePhase = time * 3 + p.phase;
            const circleSize = 0.045 + Math.sin(pulsePhase) * 0.015;
            p.targetSize = trailSize * (1 - staggeredBlend) + circleSize * staggeredBlend;

            // Smooth size transition
            p.size += (p.targetSize - p.size) * delta * 8;

            // === APPLY TO BUFFERS ===
            posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);
            sizeAttr.setX(i, p.size);
        }

        posAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
    });

    // Disable particle trail on very low-end devices
    if (config.isLowEnd) {
        return null;
    }

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={PARTICLE_COUNT}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={PARTICLE_COUNT}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.85}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
