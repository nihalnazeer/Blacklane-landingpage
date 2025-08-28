"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface DataIntegrationProps {
  focusProgress: number;
  monitorImageUrl?: string;
}

/* ----------------------- Vintage Monitor (Hub) ----------------------- */
function VintageMonitor({
  focusProgress,
  monitorImageUrl,
}: {
  focusProgress: number;
  monitorImageUrl?: string;
}) {
  const frameRef = useRef<THREE.Mesh>(null!);
  const screenRef = useRef<THREE.Mesh>(null!);
  const screenMap = monitorImageUrl ? useTexture(monitorImageUrl) : null;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (frameRef.current) {
      frameRef.current.rotation.y = Math.sin(t * 0.2) * 0.06 * focusProgress;
      frameRef.current.rotation.x = Math.cos(t * 0.15) * 0.03 * focusProgress;
    }
    if (screenRef.current) {
      const m = screenRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.2 + Math.sin(t * 2.2) * 0.6 * focusProgress;
    }
  });

  const w = 4.2, h = 3.4, d = 1.6;
  const bezel = 0.25;

  return (
    <group position={[0, -0.2, 0]}>
      <mesh ref={frameRef} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={"#e3dccf"}
          metalness={0.05}
          roughness={0.9}
        />
      </mesh>

      <mesh position={[0, 0, d * 0.5 + 0.02]}>
        <boxGeometry args={[w - bezel * 2, h - bezel * 2, 0.04]} />
        <meshStandardMaterial color={"#1a1f1d"} roughness={1} metalness={0} />
      </mesh>

      <mesh ref={screenRef} position={[0, 0, d * 0.5 + 0.04]}>
        <planeGeometry args={[w - bezel * 2 - 0.08, h - bezel * 2 - 0.08]} />
        <meshStandardMaterial
          map={screenMap}
          color={screenMap ? "#ffffff" : "#0b1f1a"}
          emissive={screenMap ? "#00ffcc" : "#0ea47a"}
          emissiveIntensity={1.2}
          transparent
          opacity={0.96}
          metalness={0.1}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[w * 0.34, -h * 0.36, d * 0.5 + 0.06]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={"#7cf7c9"}
          emissive={"#29ffb7"}
          emissiveIntensity={2}
        />
      </mesh>

      <group position={[0, -h * 0.6, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w * 0.7, 0.25, d * 0.9]} />
          <meshStandardMaterial color={"#d9d2c5"} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[w * 0.9, 0.12, d * 1.1]} />
          <meshStandardMaterial color={"#d0c8bb"} roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

/* ----------------------- Curved Connection + Flow ----------------------- */
function Connection({
  from,
  to,
  focusProgress,
  curveHeight = 1.6,
  packets = 3,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  focusProgress: number;
  curveHeight?: number;
  packets?: number;
}) {
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y += curveHeight;
    return new THREE.CatmullRomCurve3([from, mid, to]);
  }, [from, to, curveHeight]);

  const lineGeom = useMemo(() => {
    const pts = curve.getPoints(64);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, [curve]);

  const seeds = useMemo(
    () => Array.from({ length: packets }, (_, i) => Math.random() * (i + 1) / packets),
    [packets]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    packetRefs.current.forEach((m, i) => {
      if (!m) return;
      const u = (seeds[i] + (t * (0.18 + i * 0.03)) * (0.5 + focusProgress)) % 1;
      const p = curve.getPoint(u);
      m.position.copy(p);
      m.scale.setScalar(0.12 + Math.sin(t * 4 + i) * 0.03);
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 120, 0.03, 8, false]} />
        <meshStandardMaterial
          color={"#34d399"}
          emissive={"#22c59a"}
          emissiveIntensity={0.9 + focusProgress * 1.2}
          metalness={0.1}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {Array.from({ length: packets }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) packetRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={"#a7f3d0"}
            emissive={"#99ffe8"}
            emissiveIntensity={1.4}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------- Orbiting Data Nodes ----------------------- */
function DataNodes({
  focusProgress,
  target,
  count = 8,
  radius = 6,
}: {
  focusProgress: number;
  target: THREE.Vector3;
  count?: number;
  radius?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        baseAngle: (i / count) * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.25,
        height: -0.5 + Math.random() * 1.6,
        r: radius * (0.85 + Math.random() * 0.3),
      })),
    [count, radius]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const n = nodes[i];
      const a = n.baseAngle + t * n.speed * (0.6 + focusProgress);
      const x = Math.cos(a) * n.r;
      const z = Math.sin(a) * n.r;
      const y = Math.sin(a * 0.9) * 0.5 + n.height;
      child.position.set(x, y, z);

      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 3 + i) * 0.4 * (0.5 + focusProgress);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <group key={i}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#10b981" : "#ffffff"}
              emissive={i % 2 === 0 ? "#0bb38f" : "#dffdf4"}
              metalness={0.2}
              roughness={0.4}
              transparent
              opacity={0.95}
            />
          </mesh>
          <Connection
            from={new THREE.Vector3(0, 0, 0)}
            to={target}
            focusProgress={focusProgress}
            curveHeight={1.2}
            packets={3}
          />
        </group>
      ))}
    </group>
  );
}

/* ----------------------------- Scene ----------------------------- */
export default function DataIntegration({
  focusProgress,
  monitorImageUrl,
}: DataIntegrationProps) {
  const hubPoint = useMemo(() => new THREE.Vector3(0, 0, 1.0), []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 11], fov: 45, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[6, 7, 8]} intensity={1.4} />
        <pointLight position={[-7, -5, -6]} intensity={0.8} color={"#00e7b3"} />
        <hemisphereLight intensity={0.35} groundColor={"#0b0f0e"} color={"#9fffe8"} />

        <VintageMonitor focusProgress={focusProgress} monitorImageUrl={monitorImageUrl} />

        <group>
          <DataNodes focusProgress={focusProgress} target={hubPoint} count={10} radius={6.2} />
        </group>
      </Canvas>
    </div>
  );
}