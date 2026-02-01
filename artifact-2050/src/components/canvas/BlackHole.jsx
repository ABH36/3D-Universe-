import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore';

const BlackHole = () => {
  const diskRef = useRef();
  const { setGlitch } = useStore();
  const { camera } = useThree();

  // Noise texture for the Ring
  const noiseTexture = useTexture('/textures/noise.png'); // Ya online link agar local nahi hai: 'https://i.imgur.com/TWOJc5x.png'
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate the Fire Ring
    if (diskRef.current) {
        diskRef.current.rotation.z -= 0.02; 
        noiseTexture.offset.y = time * 0.5;
        noiseTexture.offset.x = time * 0.1;
    }

    // Glitch Effect Logic
    const holePos = new THREE.Vector3(-100, 10, -100); 
    const distance = camera.position.distanceTo(holePos);
    if (distance < 40) {
        const intensity = Math.min(1, (40 - distance) / 20);
        setGlitch(intensity);
    } else {
        setGlitch(0);
    }
  });

  return (
    <group> 
      
      {/* 1. THE EVENT HORIZON (Absolute Black Core) */}
      {/* Isko sabse upar hona chahiye taaki ye ring ke andar ka hissa cover kare */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </Sphere>

      {/* 2. ACCRETION DISK (Glowing Fire Ring) */}
      <mesh ref={diskRef} rotation={[1.6, 0, 0]}>
        {/* Ring Geometry: innerRadius=3, outerRadius=8 */}
        <ringGeometry args={[3, 8, 64]} /> 
        <meshBasicMaterial 
            map={noiseTexture}
            color="#ff5500"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false} // Taaki ye black hole ke piche na chupa de
        />
      </mesh>

      {/* 3. GRAVITATIONAL LENS (Light Bending Bubble) */}
      <Sphere args={[4.5, 64, 64]}>
        <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            roughness={0}
            transmission={1}
            ior={2.5} 
            chromaticAberration={0.5} 
            color="#ffffff"
            toneMapped={false}
        />
      </Sphere>
    </group>
  );
};

export default BlackHole;