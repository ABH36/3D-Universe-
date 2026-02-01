import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Multiverse = () => {
  const meshRef = useRef();
  const count = 2000; // 2000 Universes!

  const data = useMemo(() => {
    const temp = [];
    const colors = [];
    // Bubble Colors: Blue, Purple, Cyan, Gold
    const colorPalette = ['#00aaff', '#5500ff', '#00ffff', '#ffaa00', '#ffffff'];

    for (let i = 0; i < count; i++) {
      // Distance: Hamare bubble (15,000) ke baad shuru honge
      // 30,000 se lekar 10 Lakh (1,000,000) units door tak
      const r = 30000 + Math.random() * 1000000; 
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Scale: Hamare bubble (15,000) ke barabar ya bade
      const scale = 10000 + Math.random() * 10000; 

      const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      
      temp.push({ position: [x, y, z], scale });
      colors.push(color.r, color.g, color.b);
    }
    return { temp, colors: new Float32Array(colors) };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    // Pura Multiverse ghumega
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.0005;
    }
  });

  useMemo(() => {
    if (meshRef.current) {
        data.temp.forEach((item, i) => {
            dummy.position.set(...item.position);
            dummy.scale.setScalar(item.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [data]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 32, 32]}>
        <instancedBufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </sphereGeometry>
      {/* Shiny Bubble Material for all */}
      <meshPhysicalMaterial 
        vertexColors={true} 
        transmission={0.6}
        roughness={0}
        thickness={100}
        emissive="white"
        emissiveIntensity={0.2}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
};

export default Multiverse;