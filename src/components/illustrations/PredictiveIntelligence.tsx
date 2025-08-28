"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, Points, PointMaterial } from "@react-three/drei";
import { Group, Vector3 } from "three";
import * as THREE from "three";

interface PredictiveIntelligenceProps {
  focusProgress: number;
}

interface NetworkNode {
  position: Vector3;
  layer: number;
}

function HelixStructure({ focusProgress }: { focusProgress: number }) {
  const helixRef = useRef<Group>(null!);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  
  const helixPoints = useMemo(() => {
    const points = [];
    const spherePositions = [];
    const numPoints = 60;
    const radius = 2;
    const height = 4;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 4; // Two full spirals
      const y = (i / numPoints) * height - height / 2;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      
      points.push(new Vector3(x, y, z));
      
      // Add spheres at key points
      if (i % 6 === 0) {
        spherePositions.push(new Vector3(x, y, z));
      }
    }
    
    return { points, spherePositions };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (helixRef.current) {
      helixRef.current.rotation.y += 0.01 * focusProgress;
      
      // Animate spheres
      spheresRef.current.forEach((sphere, index) => {
        if (sphere) {
          const scale = 1 + Math.sin(time * 2 + index * 0.5) * 0.2 * focusProgress;
          sphere.scale.setScalar(scale);
          
          const material = sphere.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = focusProgress * (0.3 + Math.sin(time * 3 + index) * 0.2);
        }
      });
    }
  });

  return (
    <group ref={helixRef}>
      {/* Helix line */}
      <Line
        points={helixPoints.points}
        color="#10b981"
        lineWidth={3}
        transparent
        opacity={focusProgress * 0.8}
      />
      
      {/* Data points on helix */}
      {helixPoints.spherePositions.map((pos, index) => (
        <Sphere
          key={index}
          ref={el => { if (el) spheresRef.current[index] = el; }}
          args={[0.1, 16, 16]}
          position={pos}
        >
          <meshStandardMaterial
            color={index % 2 === 0 ? "#10b981" : "#ffffff"}
            emissive={index % 2 === 0 ? "#065f46" : "#f0f9ff"}
            emissiveIntensity={0}
            transparent
            opacity={0.9}
          />
        </Sphere>
      ))}
    </group>
  );
}

function PredictiveWaves({ focusProgress }: { focusProgress: number }) {
  const wavesRef = useRef<Group>(null!);
  
  const waveGeometries = useMemo(() => {
    const waves = [];
    for (let wave = 0; wave < 3; wave++) {
      const points = [];
      const numPoints = 50;
      const amplitude = 1.5 + wave * 0.5;
      
      for (let i = 0; i < numPoints; i++) {
        const x = (i / numPoints) * 8 - 4;
        const y = Math.sin((i / numPoints) * Math.PI * 4 + wave * Math.PI / 3) * amplitude;
        const z = wave * 0.5 - 1;
        points.push(new Vector3(x, y, z));
      }
      waves.push(points);
    }
    return waves;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (wavesRef.current) {
      wavesRef.current.children.forEach((child, index) => {
        if (child.type === 'Line') {
          const material = (child as any).material;
          material.opacity = focusProgress * (0.6 - index * 0.1);
          
          // Animate wave position
          child.position.x = Math.sin(time * 0.5 + index) * 0.3 * focusProgress;
        }
      });
    }
  });

  return (
    <group ref={wavesRef}>
      {waveGeometries.map((wave, index) => (
        <Line
          key={index}
          points={wave}
          color={index === 0 ? "#10b981" : index === 1 ? "#34d399" : "#6ee7b7"}
          lineWidth={2}
          transparent
          opacity={0}
        />
      ))}
    </group>
  );
}

function NeuralNetwork({ focusProgress }: { focusProgress: number }) {
  const networkRef = useRef<Group>(null!);
  
  const networkData = useMemo(() => {
    // Create layers of neurons
    const layers = [
      { nodes: 4, x: -3 },
      { nodes: 6, x: -1 },
      { nodes: 6, x: 1 },
      { nodes: 3, x: 3 }
    ];
    
    const nodes: NetworkNode[] = [];
    const connections: [number, number][] = [];
    
    layers.forEach((layer, layerIndex) => {
      const startIndex = nodes.length;
      
      for (let i = 0; i < layer.nodes; i++) {
        const y = (i - (layer.nodes - 1) / 2) * 0.8;
        nodes.push({
          position: new Vector3(layer.x, y, 0),
          layer: layerIndex
        });
      }
      
      // Connect to next layer
      if (layerIndex < layers.length - 1) {
        const currentLayerNodes = nodes.slice(startIndex);
        const nextLayer = layers[layerIndex + 1];
        const nextStartIndex = nodes.length;
        
        currentLayerNodes.forEach((_, currentNodeIndex) => {
          for (let j = 0; j < nextLayer.nodes; j++) {
            connections.push([startIndex + currentNodeIndex, nextStartIndex + j]);
          }
        });
      }
    });
    
    return { nodes, connections };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (networkRef.current) {
      networkRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          const pulseScale = 1 + Math.sin(time * 3 + index) * 0.1 * focusProgress;
          child.scale.setScalar(pulseScale);
        }
      });
    }
  });

  return (
    <group ref={networkRef} scale={0.8}>
      {/* Neural nodes */}
      {networkData.nodes.map((node, index) => (
        <Sphere
          key={`node-${index}`}
          args={[0.08, 16, 16]}
          position={node.position}
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#10b981"
            emissiveIntensity={focusProgress * 0.4}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* Neural connections */}
      {networkData.connections.map(([startIndex, endIndex], index) => (
        <Line
          key={`connection-${index}`}
          points={[networkData.nodes[startIndex].position, networkData.nodes[endIndex].position]}
          color="#34d399"
          lineWidth={1}
          transparent
          opacity={focusProgress * 0.4}
        />
      ))}
    </group>
  );
}

function FloatingDataPoints({ focusProgress }: { focusProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002 * focusProgress;
      
      // Animate individual particles
      const positions = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < 80; i++) {
        const originalY = positions.getY(i);
        positions.setY(i, originalY + Math.sin(time + i * 0.1) * 0.05 * focusProgress);
      }
      positions.needsUpdate = true;
      
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = focusProgress * 0.7;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6ee7b7"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function PredictiveIntelligence({ focusProgress }: PredictiveIntelligenceProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        style={{ background: 'transparent' }}
        camera={{ 
          position: [0, 0, 12], 
          fov: 45 
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />
        
        <HelixStructure focusProgress={focusProgress} />
        <PredictiveWaves focusProgress={focusProgress} />
        <NeuralNetwork focusProgress={focusProgress} />
        <FloatingDataPoints focusProgress={focusProgress} />
        
        {/* Dynamic lighting */}
        <pointLight
          color="#10b981"
          intensity={focusProgress * 3}
          distance={20}
          position={[0, 0, 8]}
        />
        <pointLight
          color="#ffffff"
          intensity={focusProgress * 1.5}
          distance={15}
          position={[-5, 5, 5]}
        />
      </Canvas>
    </div>
  );
}