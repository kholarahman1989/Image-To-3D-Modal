
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows, SkeletonHelper } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterState } from '../types';

interface CharacterSceneProps {
  state: CharacterState;
}

const HumanoidMesh: React.FC<{ state: CharacterState }> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Simple humanoid structure: head, torso, limbs
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Torso */}
      <mesh position={[0, 1.2 * state.height, 0]} castShadow>
        <boxGeometry args={[0.5 * state.width, 0.8 * state.height, 0.3 * state.depth]} />
        <meshStandardMaterial 
          color={state.skinColor} 
          roughness={state.roughness} 
          metalness={state.metalness} 
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.8 * state.height, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color={state.skinColor} 
          roughness={state.roughness} 
          metalness={state.metalness} 
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.4 * state.width, 1.4 * state.height, 0]} castShadow>
        <capsuleGeometry args={[0.08 * (1 + state.muscleMass), 0.6 * state.height]} />
        <meshStandardMaterial color={state.skinColor} />
      </mesh>
      <mesh position={[-0.4 * state.width, 1.4 * state.height, 0]} castShadow>
        <capsuleGeometry args={[0.08 * (1 + state.muscleMass), 0.6 * state.height]} />
        <meshStandardMaterial color={state.skinColor} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.15 * state.width, 0.4 * state.height, 0]} castShadow>
        <capsuleGeometry args={[0.1 * (1 + state.muscleMass), 0.8 * state.height]} />
        <meshStandardMaterial color={state.skinColor} />
      </mesh>
      <mesh position={[-0.15 * state.width, 0.4 * state.height, 0]} castShadow>
        <capsuleGeometry args={[0.1 * (1 + state.muscleMass), 0.8 * state.height]} />
        <meshStandardMaterial color={state.skinColor} />
      </mesh>

      {/* Skeleton Visualization */}
      {state.showSkeleton && (
        <group position={[0, 1, 0]}>
          {/* Main spine */}
          <mesh position={[0, 0, 0]}>
             <cylinderGeometry args={[0.01, 0.01, 2 * state.height]} />
             <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Shoulder bridge */}
          <mesh position={[0, 0.4 * state.height, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.01, 0.01, 1 * state.width]} />
             <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Hip bridge */}
          <mesh position={[0, -0.4 * state.height, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.01, 0.01, 0.4 * state.width]} />
             <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const CharacterScene: React.FC<CharacterSceneProps> = ({ state }) => {
  return (
    <div className="w-full h-full bg-[#0a0f1d] relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={10} 
          target={[0, 0.5, 0]} 
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Character */}
        <HumanoidMesh state={state} />
        
        {/* Ground */}
        <ContactShadows opacity={0.5} scale={10} blur={2.4} far={0.8} />
        <Grid 
          infiniteGrid 
          fadeDistance={20} 
          sectionSize={1} 
          cellSize={0.5} 
          sectionColor="#334155" 
          cellColor="#1e293b" 
        />
      </Canvas>
    </div>
  );
};
