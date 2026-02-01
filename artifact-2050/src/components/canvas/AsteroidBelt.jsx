import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AsteroidBelt = () => {
  const meshRef = useRef();
  const count = 4000; // 4000 Patthar

  // Generate Random Positions
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Radius: Mars (28) aur Jupiter (45) ke beech mein (approx 32-38)
      const angle = Math.random() * Math.PI * 2;
      const radius = 32 + Math.random() * 6; // Belt ki choudayi
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2; // Thoda upar neeche

      const scale = Math.random() * 0.2 + 0.05; // Random size

      temp.push({ position: [x, y, z], scale, rotation: [Math.random(), Math.random(), Math.random()] });
    }
    return temp;
  }, []);

  useFrame((state) => {
    // Belt ko dheere dheere ghumao
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
    }
  });

  // Initial Setup (Ek baar run hoga)
  useMemo(() => {
      if (meshRef.current) {
          asteroids.forEach((data, i) => {
              dummy.position.set(...data.position);
              dummy.rotation.set(...data.rotation);
              dummy.scale.setScalar(data.scale);
              dummy.updateMatrix();
              meshRef.current.setMatrixAt(i, dummy.matrix);
          });
          meshRef.current.instanceMatrix.needsUpdate = true;
      }
  }, [asteroids]); // Dependency added

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} /> {/* Low poly rock shape */}
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </instancedMesh>
  );
};

export default AsteroidBelt;