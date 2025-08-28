"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere, Box, Points, PointMaterial } from "@react-three/drei";
import { Group, Vector3 } from "three";
import * as THREE from "three";

interface DecisionMakingProps {
  focusProgress: number;
}

function DecisionTree({ focusProgress }: { focusProgress: number }) {
  const treeRef = useRef<Group>(null!);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  
  const treeStructure = useMemo(() => {
    const nodes = [
      { position: new Vector3(0, 2, 0), level: 0, type: 'root' },
      { position: new Vector3(-2, 0, 0), level: 1, type: 'decision' },
      { position: new Vector3(2, 0, 0), level: 1, type: 'decision' },
      { position: new Vector3(-3, -2, 0), level: 2, type: 'outcome' },
      { position: new Vector3(-1, -2, 0), level: 2, type: 'outcome' },
      { position: new Vector3(1, -2, 0), level: 2, type: 'outcome' },
      { position: new Vector3(3, -2, 0), level: 2, type: 'outcome' },
    ];
    
    const connections: [number, number][] = [
      [0, 1], [0, 2], // Root to level 1
      [1, 3], [1, 4], // Left branch
      [2, 5], [2, 6], // Right branch
    ];
    
    return { nodes, connections };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (treeRef.current) {
      treeRef.current.rotation.y += 0.005 * focusProgress;
      
      // Animate nodes with different patterns based on type
      nodesRef.current.forEach((node, index) => {
        if (node) {
          const nodeData = treeStructure.nodes[index];
          let scale = 1;
          let intensity = 0;
          
          switch (nodeData.type) {
            case 'root':
              scale = 1 + Math.sin(time * 2) * 0.1 * focusProgress;
              intensity = focusProgress * (0.6 + Math.sin(time * 2) * 0.2);
              break;
            case 'decision':
              scale = 1 + Math.sin(time * 1.5 + index) * 0.08 * focusProgress;
              intensity = focusProgress * (0.4 + Math.sin(time * 1.5 + index) * 0.15);
              break;
            case 'outcome':
              scale = 1 + Math.sin(time + index * 0.5) * 0.06 * focusProgress;
              intensity = focusProgress * (0.3 + Math.sin(time + index * 0.5) * 0.1);
              break;
          }
          
          node.scale.setScalar(scale);
          const material = node.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = intensity;
        }
      });
    }
  });

  return (
    <group ref={treeRef}>
      {/* Tree nodes */}
      {treeStructure.nodes.map((node, index) => (
        <Sphere
          key={`node-${index}`}
          ref={el => { if (el) nodesRef.current[index] = el; }}
          args={[
            node.type === 'root' ? 0.25 : 
            node.type === 'decision' ? 0.2 : 0.15, 
            16, 16
          ]}
          position={node.position}
        >
          <meshStandardMaterial
            color={
              node.type === 'root' ? "#ffffff" :
              node.type === 'decision' ? "#10b981" : "#34d399"
            }
            emissive={
              node.type === 'root' ? "#f0f9ff" :
              node.type === 'decision' ? "#065f46" : "#047857"
            }
            emissiveIntensity={0}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.9}
          />
        </Sphere>
      ))}
      
      {/* Tree connections */}
      {treeStructure.connections.map(([startIndex, endIndex], index) => (
        <Line
          key={`connection-${index}`}
          points={[
            treeStructure.nodes[startIndex].position,
            treeStructure.nodes[endIndex].position
          ]}
          color="#6ee7b7"
          lineWidth={3}
          transparent
          opacity={focusProgress * 0.8}
        />
      ))}
    </group>
  );
}

function DataFlow({ focusProgress }: { focusProgress: number }) {
  const flowRef = useRef<Group>(null!);
  
  const flowPaths = useMemo(() => {
    const paths = [];
    const numPaths = 4;
    
    for (let i = 0; i < numPaths; i++) {
      const points = [];
      const startX = -4;
      const endX = 4;
      const y = (i - numPaths / 2) * 0.8;
      const amplitude = 0.5;
      
      for (let j = 0; j <= 20; j++) {
        const x = startX + (j / 20) * (endX - startX);
        const waveY = y + Math.sin((j / 20) * Math.PI * 2 + i * Math.PI / 2) * amplitude;
        const z = Math.sin((j / 20) * Math.PI + i) * 0.3;
        points.push(new Vector3(x, waveY, z));
      }
      
      paths.push(points);
    }
    
    return paths;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (flowRef.current) {
      flowRef.current.children.forEach((child, index) => {
        if (child.type === 'Line') {
          const material = (child as any).material;
          material.opacity = focusProgress * (0.6 + Math.sin(time + index) * 0.2);
          
          // Animate flow direction
          child.position.x = Math.sin(time * 0.5 + index) * 0.2 * focusProgress;
        }
      });
    }
  });

  return (
    <group ref={flowRef} position={[0, -3, 0]}>
      {flowPaths.map((path, index) => (
        <Line
          key={`flow-${index}`}
          points={path}
          color={index % 2 === 0 ? "#10b981" : "#ffffff"}
          lineWidth={2}
          transparent
          opacity={0}
          dashed
          dashSize={0.3}
          gapSize={0.2}
        />
      ))}
    </group>
  );
}

function AnalyticsGrid({ focusProgress }: { focusProgress: number }) {
  const gridRef = useRef<Group>(null!);
  
  const gridData = useMemo(() => {
    const cubes = [];
    const size = 3;
    const spacing = 0.8;
    
    for (let x = -size; x <= size; x++) {
      for (let y = -size; y <= size; y++) {
        const height = Math.random() * 0.5 + 0.1;
        cubes.push({
          position: new Vector3(x * spacing, y * spacing, 0),
          height: height,
          intensity: Math.random()
        });
      }
    }
    
    return cubes;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (gridRef.current) {
      gridRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          const cubeData = gridData[index];
          const scale = cubeData.height + Math.sin(time * 2 + index * 0.1) * 0.1 * focusProgress;
          child.scale.set(0.3, 0.3, scale);
          
          const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = focusProgress * (cubeData.intensity * 0.3 + Math.sin(time + index) * 0.1);
          material.opacity = 0.3 + focusProgress * 0.5;
        }
      });
    }
  });

  return (
    <group ref={gridRef} position={[0, 0, -2]} rotation={[Math.PI / 6, 0, 0]}>
      {gridData.map((cube, index) => (
        <Box
          key={`cube-${index}`}
          args={[0.3, 0.3, cube.height]}
          position={cube.position}
        >
          <meshStandardMaterial
            color="#9ca3af"
            emissive="#10b981"
            emissiveIntensity={0}
            transparent
            opacity={0.3}
            wireframe
          />
        </Box>
      ))}
    </group>
  );
}

function CirclingInsights({ focusProgress }: { focusProgress: number }) {
  const insightsRef = useRef<Group>(null!);
  
  const insightPoints = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      const radius = 3 + Math.random();
      const theta = (i / 30) * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(() => {
    if (insightsRef.current) {
      insightsRef.current.rotation.y += 0.01 * focusProgress;
      insightsRef.current.rotation.x += 0.005 * focusProgress;
      
      const material = (insightsRef.current.children[0] as any)?.material;
      if (material) {
        material.opacity = focusProgress * 0.8;
        material.size = 0.05 + focusProgress * 0.05;
      }
    }
  });

  return (
    <group ref={insightsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[insightPoints, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#6ee7b7"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function DecisionMaking({ focusProgress }: DecisionMakingProps) {
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
        
        <DecisionTree focusProgress={focusProgress} />
        <DataFlow focusProgress={focusProgress} />
        <AnalyticsGrid focusProgress={focusProgress} />
        <CirclingInsights focusProgress={focusProgress} />
        
        {/* Enhanced lighting */}
        <pointLight
          color="#10b981"
          intensity={focusProgress * 2}
          distance={15}
          position={[0, 2, 5]}
        />
        <pointLight
          color="#ffffff"
          intensity={focusProgress * 1}
          distance={12}
          position={[-3, -2, 3]}
        />
      </Canvas>
    </div>
  );
}