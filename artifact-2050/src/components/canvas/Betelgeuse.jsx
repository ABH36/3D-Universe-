import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const Betelgeuse = () => {
  const starRef = useRef();

  useFrame((state) => {
    // Ye star unstable hai, isliye zyada distort karega
    if (starRef.current) {
        starRef.current.distort = 0.6; 
    }
  });

  return (
    <group onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Betelgeuse (Red Supergiant)');
    }}>
      {/* Huge Red Star */}
      <Sphere ref={starRef} args={[5, 64, 64]}>
        <MeshDistortMaterial
          color="#ff3300"       // Deep Red
          emissive="#ff0000"    // Glowing Red
          emissiveIntensity={3} 
          roughness={0.8}
          speed={1}             // Slow boiling (Kyuki bada hai)
          distort={0.5}
        />
      </Sphere>
      
      {/* Heat Haze (Atmosphere) */}
      <Sphere args={[6, 32, 32]}>
         <meshBasicMaterial color="#ff5500" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
};

export default Betelgeuse;