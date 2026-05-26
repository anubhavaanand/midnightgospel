import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// 3D Simplex Noise definition for smooth liquid cream ocean displacement
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

export const CreamOceanShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0.8,
    uColorPrimary: new THREE.Color('#FFFDD0'), // Creamy pastel yellow
    uColorSecondary: new THREE.Color('#ffcc80'), // Soft golden orange
    uColorBloom: new THREE.Color('#ffffff'), // High gloss specular white
    uSpeed: 0.5,
    uDistortion: 1.0,
    uMouse: new THREE.Vector2(-9999, -9999),
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform float uDistortion;
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vWave;
    
    ${simplexNoise3D}
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Undulating double wave ocean displacement
      float n1 = snoise(vec3(position.x * 0.15, position.y * 0.15, uTime * uSpeed * 0.4));
      float n2 = snoise(vec3(position.x * 0.3, position.y * 0.3, -uTime * uSpeed * 0.6));
      vWave = n1 * 0.6 + n2 * 0.4;
      
      // Add interactive cursor wave displacement
      float mouseDist = distance(uv, uMouse);
      float ripple = 0.0;
      if (uMouse.x > -10.0) {
        ripple = sin(mouseDist * 35.0 - uTime * 10.0) * exp(-mouseDist * 4.5) * 0.3 * uIntensity;
      }
      
      vec3 newPosition = position + normal * (vWave * uDistortion * uIntensity * 1.5 + ripple);
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
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vWave;

    ${simplexNoise3D}

    void main() {
      // Swirling liquid textures
      float swirl = snoise(vPosition * 0.2 + vec3(0.0, 0.0, uTime * uSpeed * 0.15));
      
      float mixFactor = smoothstep(-0.6, 0.6, vWave + swirl * 0.3);
      vec3 finalColor = mix(uColorPrimary, uColorSecondary, mixFactor);
      
      // Fresnel reflection for rich gloss
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 4.0);
      
      // Specular foam/cream highlight
      finalColor += uColorBloom * fresnel * uIntensity * 1.8;
      
      // Add dynamic glowing ring at cursor raycast intersection
      if (uMouse.x > -10.0) {
        float mouseDist = distance(vUv, uMouse);
        float ring = smoothstep(0.015, 0.0, abs(sin(mouseDist * 35.0 - uTime * 10.0) * exp(-mouseDist * 4.5) - 0.045));
        finalColor += uColorBloom * ring * 0.8 * uIntensity;
      }

      gl_FragColor = vec4(finalColor, 1.0);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ CreamOceanShaderMaterial });
