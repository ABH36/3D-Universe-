import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Ring } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const CosmicEye = () => {
  const eyeRef = useRef();
  
  useFrame((state) => {
    // Aankh thodi si "Saans" legi (Pulse)
    const t = state.clock.elapsedTime;
    if (eyeRef.current) {
        eyeRef.current.rotation.z = t * 0.05; // Dheere ghumegi
    }
  });

  return (
    <group 
      ref={eyeRef} 
      rotation={[Math.PI / 2, 0, 0]} // Camera ki taraf face karega
      onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'The Cosmic Eye');
      }}
    >
      {/* 1. The Pupil (Black Hole Center) */}
      <mesh>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. The Iris (Fiery Red) */}
      <Ring args={[2, 6, 64]} position={[0, 0, -0.1]}>
         <MeshDistortMaterial 
            color="#ff3300" 
            emissive="#ff0000"
            emissiveIntensity={2}
            speed={2} 
            distort={0.4} // Aag jaisa hilega
            transparent
            opacity={0.8}
         />
      </Ring>

      {/* 3. The Outer Glow (Purple/Blue Mist) */}
      <Ring args={[6, 12, 64]} position={[0, 0, -0.2]}>
         <meshBasicMaterial 
            color="#4400ff" 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide}
         />
      </Ring>
      
      {/* 4. Eyelid Effect (Top/Bottom Darkness) */}
      <Ring args={[10, 15, 64]} position={[0, 0, 0.1]}>
         <meshBasicMaterial color="#000000" transparent opacity={0.9} />
      </Ring>
    </group>
  );
};

export default CosmicEye;