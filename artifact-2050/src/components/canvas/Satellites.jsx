import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Satellites = () => {
  const meshRef = useRef();
  const issRef = useRef();
  const count = 200; // 200 Satellites

  // Generate Random Satellites
  const data = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Earth ke paas (Radius 1.5 se 2.5 ke beech)
      // Note: Earth ka size humne SolarSystem mein 1 rakha tha?
      // Hamein scale match karna padega.
      const r = 1.5 + Math.random() * 1; 
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp.push({ position: [x, y, z], speed: Math.random() * 0.02 + 0.005 });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate all satellites
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.z = time * 0.02;
    }

    // ISS Movement (Specific Orbit)
    if (issRef.current) {
        issRef.current.position.x = Math.sin(time * 0.5) * 2;
        issRef.current.position.z = Math.cos(time * 0.5) * 2;
        issRef.current.position.y = Math.sin(time) * 0.5;
        issRef.current.lookAt(0, 0, 0);
    }
  });

  // Setup Instances
  useMemo(() => {
    if (meshRef.current) {
        data.forEach((item, i) => {
            dummy.position.set(...item.position);
            dummy.scale.setScalar(0.02); // Tiny dots
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [data]);

  return (
    <group>
      {/* 200 Satellites */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ff00" wireframe /> {/* Matrix style look */}
      </instancedMesh>

      {/* The ISS (International Space Station) */}
      <mesh ref={issRef}>
        <boxGeometry args={[0.1, 0.05, 0.2]} />
        <meshStandardMaterial color="white" emissive="cyan" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

export default Satellites;