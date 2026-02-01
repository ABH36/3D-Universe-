import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const UniverseBackground = () => {
  const galaxyRef = useRef();
  
  // 1. Load Texture
  const galaxyTexture = useTexture('/textures/milkyway.jpg');
  // Color correction taaki Galaxy ke colors washed out na lagein
  galaxyTexture.colorSpace = THREE.SRGBColorSpace; 

  useFrame((state, delta) => {
    // 2. Slow Cinematic Rotation
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.005; // Bohot dheere (Realistic)
    }
  });

  return (
    <group>
      {/* LAYER 1: THE DEEP MILKY WAY (Infinite Background) */}
      <mesh ref={galaxyRef} scale={[400, 400, 400]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          map={galaxyTexture} 
          side={THREE.BackSide} 
          transparent 
          opacity={1} // Full visibility for deep colors
          fog={false}
          toneMapped={false} // Colors bright rahenge
        />
      </mesh>
      
      {/* LAYER 2: DISTANT STARS (Hazaron Taare) */}
      <Stars 
        radius={300} 
        depth={60} 
        count={10000} 
        factor={5} 
        saturation={0.5} 
        fade 
        speed={0.5} 
      />

      {/* LAYER 3: FLOATING SPACE DUST (Ye hai wo 'Travel' feel) 
         Jab camera aage badhega, ye particles peeche jayenge.
      */}
      <Sparkles 
        count={500} 
        scale={50} // Bada area cover karega
        size={3} 
        speed={0.2} 
        opacity={0.5} 
        color="#ffffff" 
      />
    </group>
  );
};

export default UniverseBackground;