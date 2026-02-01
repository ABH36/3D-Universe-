import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { useStore } from '../../../stores/use3DStore';

// Custom Shader Material
const FluidShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uColor1: new THREE.Color('#000000'), // Deep Black
    uColor2: new THREE.Color('#0a0a0a'), // Dark Grey
    uColor3: new THREE.Color('#00ffff'), // Cyan
    uColor4: new THREE.Color('#ff00ff'), // Magenta
    uIntensity: 1.0,
    uSpeed: 0.5,
    uDistortion: 1.0,
    uRippleStrength: 0.3,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (FBM + Domain Warping)
  `
    precision highp float;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3; uniform vec3 uColor4;
    uniform float uIntensity; uniform float uSpeed; uniform float uDistortion; uniform float uRippleStrength;
    varying vec2 vUv;

    // Simplex Noise & FBM Functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float f = 0.0;
      float w = 0.5;
      for (int i = 0; i < 5; i++) {
        f += w * snoise(p);
        p *= 2.0;
        w *= 0.5;
      }
      return f;
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= uResolution.x / uResolution.y;
      
      float t = uTime * uSpeed;
      
      // Mouse Interaction (Ripples)
      vec2 mouse = uMouse * 2.0 - 1.0;
      mouse.x *= uResolution.x / uResolution.y;
      float d = distance(uv, mouse);
      float ripple = sin(d * 10.0 - t * 5.0) * exp(-d * 3.0) * uRippleStrength;
      
      // Domain Warping
      vec2 q = vec2(fbm(uv + t * 0.1), fbm(uv + vec2(5.2, 1.3) + t * 0.1));
      vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.2), fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.2));
      
      float f = fbm(uv + 4.0 * r + ripple * 0.5);
      
      // Color Mixing
      vec3 color = mix(uColor1, uColor2, f);
      color = mix(color, uColor3, length(q));
      color = mix(color, uColor4, r.x);
      
      // Vignette
      color *= 1.0 - length(vUv - 0.5) * 0.5;
      
      gl_FragColor = vec4(color * uIntensity, 1.0);
    }
  `
);

extend({ FluidShaderMaterial });

const FluidBackground = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport, size } = useThree();
  const { fluidParams } = useStore(); // Connect to Brain

  // Mouse Listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!materialRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(x, y), 0.1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      
      // Sync with Store
      materialRef.current.uniforms.uSpeed.value = fluidParams.speed;
      materialRef.current.uniforms.uDistortion.value = fluidParams.distortion;
      materialRef.current.uniforms.uRippleStrength.value = fluidParams.rippleStrength;
      materialRef.current.uniforms.uIntensity.value = fluidParams.intensity;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}> {/* Thoda aur peeche push kiya */}
      {/* FIX: Args ko Hardcode karke bada kar diya (500, 500) taaki full screen cover ho */}
      <planeGeometry args={[500, 500, 1, 1]} /> 
      <fluidShaderMaterial ref={materialRef} transparent={false} />
    </mesh>
  );
};

export default FluidBackground;