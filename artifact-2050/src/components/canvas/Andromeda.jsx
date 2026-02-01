import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore';

const Andromeda = () => {
  const pointsRef = useRef();
  
  // Galaxy Parameters
  const parameters = {
    count: 5000,    // 50,000 stars (High Detail)
    size: 0.5,
    radius: 100,     // Galaxy Size
    branches: 3,    // Spiral Arms
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030', // Core color (Reddish)
    outsideColor: '#1b3984', // Arm color (Blueish)
  };

  const particles = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY; // Flat Galaxy
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Colors mix
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Galaxy dheere dheere ghumegi
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group 
      onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Andromeda Galaxy');
      }}
    >
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={parameters.count} array={particles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={parameters.count} array={particles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={parameters.size} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          vertexColors={true}
        />
      </points>
      
      {/* Glow Center */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#ffaa55" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default Andromeda;