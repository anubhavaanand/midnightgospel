uniform float uBass;
uniform float uMid;
uniform float uTreble;
uniform float uTime;
uniform float uChaosIntensity; // 0.0 to 1.0 (Acceptance -> Chaos)

varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;

float noise(vec3 p) {
    return sin(p.x * 5.0 + uTime) * sin(p.y * 5.0 + uTime) * sin(p.z * 5.0 + uTime);
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;

    // Compute audio-reactive displacement
    float audioFactor = uBass * 0.5 + uMid * 0.3 + uTreble * 0.2;
    float displacement = noise(pos + uTime * 0.5) * audioFactor * uChaosIntensity;
    
    // Melt downwards (y-axis negative) based on chaos and audio
    pos.y -= displacement * 2.0;
    
    // Normal expansion
    pos += normal * displacement;

    vDisplacement = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
