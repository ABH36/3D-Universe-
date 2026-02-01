import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore';
import Earth from './Planet'; 
import Satellites from './Satellites';

// ✅ 1. USE LOCAL TEXTURES (High Quality & Offline)
const planetTextures = {
  mercury: '/textures/mercury.jpg',
  venus: '/textures/venus.jpg',
  mars: '/textures/mars.jpg',
  jupiter: '/textures/jupiter.jpg',
  saturn: '/textures/saturn.jpg',
  saturnRing: '/textures/saturn_ring.png'
};

const PlanetMesh = ({ planet, initialAngle }) => {
  const meshRef = useRef();
  const { setFocusTarget, timeSpeed, focusTarget } = useStore(); // Time Speed Connected
  const [hovered, setHovered] = useState(false);
  
  // Internal State to track orbit position
  // Isse smooth movement hogi jab hum time speed change karenge
  const angleRef = useRef(initialAngle);

  // Texture Load
  const texture = useTexture(planet.texture);

  useFrame((state, delta) => {
    // ✅ 2. TIME TRAVEL LOGIC
    // Delta * Speed * TimeSpeed (Slider value)
    angleRef.current += delta * planet.speed * 0.1 * timeSpeed;

    const x = Math.sin(angleRef.current) * planet.distance;
    const z = Math.cos(angleRef.current) * planet.distance;
    
    if (meshRef.current) {
        meshRef.current.position.set(x, 0, z);
        meshRef.current.rotation.y += delta * 0.5; // Self Rotation
        
        // Focus Tracking Logic
        if (planet.name === focusTarget?.name) {
            useStore.getState().focusTarget.position.copy(meshRef.current.position);
        }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Clickable Planet Sphere */}
      <Sphere 
        args={[planet.size, 64, 64]} 
        onClick={(e) => {
            e.stopPropagation();
            setFocusTarget(new THREE.Vector3(), planet.name);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        castShadow // ✅ Shadow Dega
        receiveShadow // ✅ Shadow Lega
      >
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
      </Sphere>
      
      {/* Hover Name */}
      {hovered && (
          <Text position={[0, planet.size + 1.5, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle">
              {planet.name}
          </Text>
      )}

      {/* Saturn Ring */}
      {planet.ring && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]} receiveShadow>
            <ringGeometry args={[planet.size + 1, planet.size + 3, 64]} />
            <meshStandardMaterial 
                map={useTexture(planetTextures.saturnRing)} 
                transparent 
                side={THREE.DoubleSide} 
                opacity={0.9}
            />
        </mesh>
      )}

      <Trail width={2} length={12} color={planet.trailColor} attenuation={(t) => t * t} />
    </group>
  );
};

const SolarSystem = () => {
  const planetsData = [
    { name: 'Mercury', texture: planetTextures.mercury, size: 0.8, distance: 10, speed: 1.5, trailColor: '#A5A5A5' },
    { name: 'Venus', texture: planetTextures.venus, size: 1.2, distance: 18, speed: 1.2, trailColor: '#E3BB76' },
    { name: 'Mars', texture: planetTextures.mars, size: 1.0, distance: 28, speed: 0.8, trailColor: '#FF4500' },
    { name: 'Jupiter', texture: planetTextures.jupiter, size: 4.0, distance: 45, speed: 0.4, trailColor: '#D2B48C' },
    { name: 'Saturn', texture: planetTextures.saturn, size: 3.5, distance: 65, speed: 0.3, trailColor: '#F4A460', ring: true },
  ];

  return (
    <group>
       {planetsData.map((planet, index) => (
         <PlanetMesh key={planet.name} planet={planet} initialAngle={index * 2} />
       ))}
       
       <MovingEarth />
       
       {/* Orbit Lines */}
       {planetsData.map((p, i) => (
         <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[p.distance - 0.1, p.distance + 0.1, 128]} />
            <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
         </mesh>
       ))}
    </group>
  );
};

// Earth Wrapper
const MovingEarth = () => {
    const earthGroup = useRef();
    const { setFocusTarget, timeSpeed, focusTarget } = useStore();
    const angleRef = useRef(0);
    
    useFrame((state, delta) => {
        angleRef.current += delta * 1.0 * 0.1 * timeSpeed;
        const distance = 23; 
        const x = Math.sin(angleRef.current) * distance;
        const z = Math.cos(angleRef.current) * distance;
        
        if(earthGroup.current) {
            earthGroup.current.position.set(x, 0, z);
            if (focusTarget?.name === 'Earth') {
                 useStore.getState().focusTarget.position.copy(earthGroup.current.position);
            }
        }
    });

    return (
        <group ref={earthGroup} onClick={(e) => {
            e.stopPropagation();
            setFocusTarget(new THREE.Vector3(), 'Earth');
        }}>
            <Earth />
            
            {/* ✅ NEW: SATELLITES ATTACHED TO EARTH */}
            {/* Scale adjust kiya taaki Earth ke size ke hisaab se fit ho */}
            <group scale={[1.2, 1.2, 1.2]}> 
                <Satellites />
            </group>

            <Trail width={3} length={12} color="#4ca6ff" attenuation={(t) => t * t} />
        </group>
    )
}


export default SolarSystem;