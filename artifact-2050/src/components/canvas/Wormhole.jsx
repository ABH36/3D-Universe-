import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const Wormhole = () => {
  const meshRef = useRef();

  useFrame((state) => {
    // Wormhole throb karega (Dhak-Dhak)
    const t = state.clock.elapsedTime;
    if(meshRef.current) {
        meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
    }
  });

  return (
    <group onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Interstellar Wormhole');
    }}>
      {/* The Portal Sphere */}
      <Sphere ref={meshRef} args={[10, 64, 64]}>
        <MeshTransmissionMaterial
            backside
            backsideThickness={10}
            thickness={5}
            roughness={0}
            transmission={1} // Pura glass jaisa
            ior={2.5}        // High Refraction (Light bending)
            chromaticAberration={1.5} // Rainbow edges
            color="#aa00ff"  // Purple tint
            distortion={1.5} // Space warp effect
            distortionScale={0.5}
            temporalDistortion={0.5}
        />
      </Sphere>

      {/* Stability Rings (Sci-Fi feel) */}
      <mesh rotation={[1.5, 0, 0]}>
         <torusGeometry args={[14, 0.2, 16, 100]} />
         <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default Wormhole;