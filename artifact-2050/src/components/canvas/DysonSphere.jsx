import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Sphere } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const DysonSphere = () => {
  const cageRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Cage aur Core alag direction mein ghumenge
    if (cageRef.current) cageRef.current.rotation.y = t * 0.02;
    if (cageRef.current) cageRef.current.rotation.z = t * 0.01;
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05); // Pulsing Energy
  });

  return (
    <group onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Alien Dyson Sphere');
    }}>
      
      {/* 1. The Trapped Star (Core) */}
      <Sphere ref={coreRef} args={[3, 32, 32]}>
        <meshStandardMaterial 
            color="#00ffaa" // Alien Energy Color (Green/Cyan)
            emissive="#00ffaa"
            emissiveIntensity={5}
            toneMapped={false}
        />
      </Sphere>

      {/* 2. The Megastructure (Metal Cage) */}
      <Icosahedron ref={cageRef} args={[5, 2]}> {/* Detail level 2 */}
        <meshStandardMaterial 
            color="#111111" // Dark Metal
            roughness={0.2}
            metalness={1.0}
            wireframe={true} // Jaali jaisa dikhega
        />
      </Icosahedron>

      {/* 3. Inner Shell (Solid Darkness) */}
      <Icosahedron args={[4.8, 1]}>
         <meshStandardMaterial color="#000000" transparent opacity={0.9} side={THREE.DoubleSide} />
      </Icosahedron>

    </group>
  );
};

export default DysonSphere;