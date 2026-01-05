export const backgroundVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uAccent;
  uniform float uDistortion;
  uniform float uSpeed;
  uniform float uAudio;
  varying vec2 vUv;

  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i*.4 + uTime*.4 * uSpeed);

        d = sin(d*8. + uTime)/8.;
        d = abs(d);

        d = pow(0.01 / d, 1.2 + (uAudio * 0.5));

        finalColor += col * d;
    }

    // 4D Ribbon effect overlay
    float ribbon = sin(uv0.x * 5.0 + uTime * uSpeed) * 0.5 + sin(uv0.y * 3.0 + uTime * 0.8 * uSpeed) * 0.5;
    vec3 ribbonCol = mix(uColorA, uAccent, ribbon * 0.5 + 0.5);
    
    finalColor = mix(finalColor, ribbonCol, 0.1 * uDistortion);
    
    // Vignette
    float v = 1.0 - smoothstep(0.5, 1.8, length(uv0));
    gl_FragColor = vec4(finalColor * v, 1.0);
  }
`;
