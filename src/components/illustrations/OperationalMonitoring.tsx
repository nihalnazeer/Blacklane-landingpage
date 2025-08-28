"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere, Points, PointMaterial } from "@react-three/drei";
import { Group, Vector3 } from "three";
import * as THREE from "three";

interface OperationalMonitoringProps {
  focusProgress: number;
}

function CircularProgressChart({ focusProgress }: { focusProgress: number }) {
  const groupRef = useRef<Group>(null!);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  
  const progressData = useMemo(() => [
    { value: 75, color: "#10b981", radius: 2.5 },
    { value: 85, color: "#ffffff", radius: 2.0 },
    { value: 60, color: "#34d399", radius: 1.5 },
    { value: 92, color: "#6ee7b7", radius: 1.0 },
  ], []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.005 * focusProgress;
      
      // Subtle 3D tilt
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1 * focusProgress;
      groupRef.current.rotation.y = Math.cos(time * 0.4) * 0.05 * focusProgress;
    }

    // Animate individual rings
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        const data = progressData[index];
        const targetRotation = (data.value / 100) * Math.PI * 2;
        const currentRotation = ring.rotation.z;
        
        // Smooth rotation animation
        ring.rotation.z = THREE.MathUtils.lerp(
          currentRotation, 
          targetRotation * focusProgress, 
          0.05
        );
        
        // Pulsing effect
        const scale = 1 + Math.sin(time * 2 + index) * 0.05 * focusProgress;
        ring.scale.setScalar(scale);
        
        // Material updates
        const material = ring.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = focusProgress * 0.3;
        material.opacity = 0.7 + focusProgress * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {progressData.map((data, index) => (
        <group key={index}>
          {/* Background ring */}
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <ringGeometry args={[data.radius - 0.05, data.radius + 0.05, 64]} />
            <meshStandardMaterial
              color="#374151"
              transparent
              opacity={0.3}
            />
          </mesh>
          
          {/* Progress ring */}
          <mesh
            ref={el => { if (el) ringsRef.current[index] = el; }}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <ringGeometry 
              args={[
                data.radius - 0.05, 
                data.radius + 0.05, 
                64, 
                1, 
                0, 
                (data.value / 100) * Math.PI * 2
              ]} 
            />
            <meshStandardMaterial
              color={data.color}
              emissive={data.color}
              emissiveIntensity={0}
              transparent
              opacity={0.7}
            />
          </mesh>
          
          {/* Glowing end cap */}
          <Sphere
            args={[0.08, 16, 16]}
            position={[
              (data.radius + 0.05) * Math.cos((data.value / 100) * Math.PI * 2 - Math.PI / 2),
              (data.radius + 0.05) * Math.sin((data.value / 100) * Math.PI * 2 - Math.PI / 2),
              0
            ]}
          >
            <meshStandardMaterial
              color={data.color}
              emissive={data.color}
              emissiveIntensity={focusProgress * 0.8}
              transparent
              opacity={focusProgress}
            />
          </Sphere>
        </group>
      ))}
      
      {/* Center sphere */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#10b981"
          emissiveIntensity={focusProgress * 0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </group>
  );
}

function DataNodes({ focusProgress }: { focusProgress: number }) {
  const nodesRef = useRef<Group>(null!);
  
  const nodePositions = useMemo(() => [
    new Vector3(0, 0, 0),        // Center
    new Vector3(3, 2, 0),        // Top right
    new Vector3(3, -2, 0),       // Bottom right
    new Vector3(-3, 2, 0),       // Top left
    new Vector3(-3, -2, 0),      // Bottom left
    new Vector3(0, 3, 1),        // Top
    new Vector3(0, -3, 1),       // Bottom
  ], []);

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 1; i < nodePositions.length; i++) {
      lines.push([nodePositions[0], nodePositions[i]]);
    }
    // Add some inter-node connections
    lines.push([nodePositions[1], nodePositions[2]]);
    lines.push([nodePositions[3], nodePositions[4]]);
    lines.push([nodePositions[5], nodePositions[6]]);
    return lines;
  }, [nodePositions]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          const scale = 1 + Math.sin(time * 2 + index) * 0.1 * focusProgress;
          child.scale.setScalar(scale);
          
          const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = focusProgress * (0.3 + Math.sin(time * 3 + index) * 0.2);
        }
      });
    }
  });

  return (
    <group ref={nodesRef}>
      {nodePositions.map((pos, i) => (
        <Sphere key={`node-${i}`} args={[i === 0 ? 0.2 : 0.15, 16, 16]} position={pos}>
          <meshStandardMaterial
            color={i === 0 ? "#ffffff" : "#10b981"}
            emissive={i === 0 ? "#f0f9ff" : "#065f46"}
            emissiveIntensity={0}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {connections.map((connection, i) => (
        <Line
          key={`line-${i}`}
          points={connection}
          color="#6ee7b7"
          lineWidth={2}
          transparent
          opacity={focusProgress * 0.6}
          dashed={i > 3}
          dashSize={0.3}
          gapSize={0.2}
        />
      ))}
    </group>
  );
}

function ParticleSystem({ focusProgress }: { focusProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001 * focusProgress;
      
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = focusProgress * 0.6;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#34d399"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function OperationalMonitoring({ focusProgress }: OperationalMonitoringProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        style={{ background: 'transparent' }}
        camera={{ 
          position: [0, 0, 10], 
          fov: 45 
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          color="#ffffff"
        />
        
        <CircularProgressChart focusProgress={focusProgress} />
        <DataNodes focusProgress={focusProgress} />
        <ParticleSystem focusProgress={focusProgress} />
        
        {/* Accent lighting */}
        <pointLight
          color="#10b981"
          intensity={focusProgress * 2}
          distance={15}
          position={[0, 0, 5]}
        />
      </Canvas>
    </div>
  );
}