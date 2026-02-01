import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Sun = () => {
  const sunRef = useRef();
  
  // Imgur link for glow (Ensure ye link sahi ho)
  const glowTexture = useTexture('/textures/sun_glow.png');

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.distort = 0.4;
    }
  });

  return (
    <group>
      {/* 1. THE CORE STAR (Yellow/Orange Ball) */}
      <Sphere ref={sunRef} args={[4, 64, 64]}> 
        <MeshDistortMaterial
          color="#ffaa00"
          emissive="#ff0000"
          emissiveIntensity={1}
          roughness={1}
          speed={2} 
          distort={0.3}
        />
      </Sphere>

      {/* 2. THE GLOW (Corona) - FIXED SQUARE ISSUE */}
      <sprite scale={[24, 24, 1]}> {/* Scale thoda badhaya */}
        <spriteMaterial 
          map={glowTexture}
          color="#ff5500" 
          transparent={true}      // Zaroori hai
          opacity={0.6} 
          blending={THREE.AdditiveBlending} // Black background ko gayab karta hai
          depthWrite={false}      // ✅ MAGIC FIX: Isse square box gayab ho jayega
        />
      </sprite>

      {/* 3. LIGHT SOURCE */}
      <pointLight intensity={20} color="#ffaa00" distance={200} decay={1.5} />
    </group>
  );
};

export default Sun;