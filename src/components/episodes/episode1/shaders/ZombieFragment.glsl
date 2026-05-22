uniform float uTime;
uniform float uChaosIntensity; // 0.0 to 1.0 (Acceptance -> Chaos)

varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;

// Palettes
const vec3 COLOR_ACCEPTANCE = vec3(0.5, 0.8, 0.9); // Harmonious pastel blue
const vec3 COLOR_DEBATE = vec3(0.8, 0.6, 0.2);     // Tension orange/yellow
const vec3 COLOR_CHAOS = vec3(0.1, 0.8, 0.3);      // Toxic green

void main() {
    // Determine base color based on narrative phase (driven by uChaosIntensity)
    vec3 color = mix(COLOR_ACCEPTANCE, COLOR_DEBATE, smoothstep(0.0, 0.5, uChaosIntensity));
    color = mix(color, COLOR_CHAOS, smoothstep(0.5, 1.0, uChaosIntensity));

    // Add audio-reactive highlight from vertex displacement
    color += vec3(vDisplacement * 2.0);

    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = diff * color;

    // Ambient
    vec3 ambient = color * 0.3;

    gl_FragColor = vec4(ambient + diffuse, 1.0);
}
