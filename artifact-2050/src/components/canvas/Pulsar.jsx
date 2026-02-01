import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore';

const Pulsar = () => {
  const pulsarRef = useRef();
  const beamsRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // 1. Bohot Tez Rotation (Dangerous feel)
    if (pulsarRef.current) pulsarRef.current.rotation.y += 0.05;
    if (beamsRef.current) beamsRef.current.rotation.z -= 0.2; // Beams spinning fast
    if (beamsRef.current) beamsRef.current.rotation.x = Math.sin(time * 2) * 0.2; // Wobble effect
  });

  return (
    <group>
      {/* --- CORE (The Neutron Star) --- */}
      <Sphere ref={pulsarRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={5} 
            toneMapped={false} 
        />
      </Sphere>

      {/* --- BEAMS (Radiation Jets) --- */}
      <group ref={beamsRef}>
        {/* Beam 1 (Up) */}
        <Cone args={[1, 40, 32]} position={[0, 20, 0]}>
            <meshBasicMaterial color="#0088ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </Cone>
        {/* Beam 2 (Down) */}
        <Cone args={[1, 40, 32]} position={[0, -20, 0]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#0088ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </Cone>
      </group>

      {/* --- CLICK AREA (Invisible Big Sphere for easier clicking) --- */}
      <mesh visible={false} onClick={(e) => {
          e.stopPropagation();
          useStore.getState().setFocusTarget(new THREE.Vector3(), 'Pulsar');
      }}>
          <sphereGeometry args={[10, 16, 16]} />
          <meshBasicMaterial />
      </mesh>
    </group>
  );
};

export default Pulsar;