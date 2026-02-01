import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const BinarySystem = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    if (groupRef.current) {
        // Pura system gol ghumega
        groupRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Binary Star System');
    }}>
      
      {/* Star 1: Hot Blue Star */}
      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      {/* Star 2: Cool Yellow Star */}
      <mesh position={[-4, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Gravity Connection (Visual Line) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
         <cylinderGeometry args={[0.1, 0.1, 8, 8]} />
         <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>

    </group>
  );
};

export default BinarySystem;