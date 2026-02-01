import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const LocalBubble = () => {
  const bubbleRef = useRef();

  useFrame((state) => {
    // Bubble dheere dheere saans lega (Expand/Contract slightly)
    if (bubbleRef.current) {
        const t = state.clock.elapsedTime;
        bubbleRef.current.rotation.y = t * 0.01;
        // Subtle pulsing
        const scale = 1 + Math.sin(t * 0.5) * 0.005;
        bubbleRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* RADIUS: 15,000 
         (Andromeda 4000 par hai, toh ye usse bada hona chahiye)
      */}
      <mesh ref={bubbleRef}>
        <sphereGeometry args={[15000, 128, 128]} />
        
        {/* Magic Material: Glassy + Glowing */}
        <MeshTransmissionMaterial
          backside
          backsideThickness={50} // Andar se mota dikhega
          thickness={100} 
          roughness={0}
          transmission={1} // Pura transparent
          ior={1.5}        // Glass refraction
          chromaticAberration={1} // Rainbow edges (Soap bubble look)
          color="#aaeeff"  // Light Blue tint
          emissive="#0044ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Outer Glow Ring (Taaki door se chamke) */}
      <mesh scale={[1.01, 1.01, 1.01]}>
         <sphereGeometry args={[15000, 64, 64]} />
         <meshBasicMaterial 
            color="#0088ff" 
            transparent 
            opacity={0.1} 
            side={THREE.BackSide} 
            blending={THREE.AdditiveBlending} 
         />
      </mesh>
    </group>
  );
};

export default LocalBubble;