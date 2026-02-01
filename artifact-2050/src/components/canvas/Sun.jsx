import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei'; // useTexture hata diya
import * as THREE from 'three';

const Sun = () => {
  const sunRef = useRef();
  
  // NOTE: Humne sprite/texture hata diya hai taaki square box na bane.
  // Ab glow 'App.jsx' ke Bloom effect se aayega.

  useFrame((state) => {
    // Sun surface boiling effect
    if (sunRef.current) {
      sunRef.current.distort = 0.4;
    }
  });

  return (
    <group>
      {/* 1. THE CORE STAR (Burning Plasma Sphere) */}
      <Sphere ref={sunRef} args={[4, 128, 128]}> {/* Segment badha diye smooth look ke liye */}
        <MeshDistortMaterial
          color="#ffffff" // Base color white rakha taaki sabse bright hissa safed dikhe
          emissive="#ff8800" // Asli aag ka rang
          emissiveIntensity={4} // 🔥 Intensity badha di taaki Bloom effect tagda aaye
          roughness={0.2}
          metalness={0.1}
          speed={3} // Fast boiling
          distort={0.3}
          toneMapped={false} // Important: Colors ko clamp hone se rokta hai, extremely bright dikhega
        />
      </Sphere>

      {/* ❌ SPRITE REMOVED ❌
         Wo square box isi wajah se aa raha tha.
         Ab glow natural lagega.
      */}

      {/* 2. LIGHT SOURCE (Real Light for Planets) */}
      <pointLight intensity={15} color="#ffaa00" distance={300} decay={1.5} />
    </group>
  );
};

export default Sun;