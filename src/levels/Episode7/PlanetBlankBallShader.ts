import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Bone-like plate organic simplex noise 3D generator
const simplexNoise3D = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

export const PlanetBlankBallShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0.6,
    uColorPrimary: new THREE.Color('#fafafa'), // Bone-white
    uColorSecondary: new THREE.Color('#e0e0e0'), // Slate-gray/bone shadow
    uColorBloom: new THREE.Color('#ffea00'), // Soft sacred gold glow
    uSpeed: 0.5,
    uDistortion: 0.8,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform float uDistortion;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vBone;
    
    ${simplexNoise3D}
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Craggy skeletal plate displacement
      float n1 = snoise(vec3(position.x * 0.1, position.y * 0.1, uTime * uSpeed * 0.35));
      float n2 = snoise(vec3(position.x * 0.22, position.y * 0.22, -uTime * uSpeed * 0.5));
      vBone = n1 * 0.7 + n2 * 0.3;
      
      vec3 newPosition = position + normal * vBone * uDistortion * uIntensity * 1.5;
      vPosition = newPosition;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform vec3 uColorBloom;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vBone;

    ${simplexNoise3D}

    void main() {
      // Swirling bone dust textures
      float dust = snoise(vPosition * 0.3 + vec3(0.0, 0.0, uTime * uSpeed * 0.15));
      
      float mixFactor = smoothstep(-0.4, 0.4, vBone + dust * 0.35);
      vec3 finalColor = mix(uColorPrimary, uColorSecondary, mixFactor);
      
      // Eerie sacred gold light beams
      float beams = smoothstep(0.2, 0.7, snoise(vPosition * 0.1 + vec3(0.0, uTime * uSpeed * 0.5, 0.0)));
      finalColor += uColorBloom * beams * 0.25 * uIntensity;
      
      // Specular highlight edge
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 4.0);
      
      finalColor += uColorBloom * fresnel * uIntensity * 0.9;
      
      gl_FragColor = vec4(finalColor, 1.0);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ PlanetBlankBallShaderMaterial });
