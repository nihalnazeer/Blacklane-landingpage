"use client";

import { useScroll, useTransform, MotionValue, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { Box, Line as DreiLine, Grid, Cone } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import * as THREE from "three";

// --- COLOR PALETTE ---
const layerColors = ["#333333", "#555555", "#777777"]; // Greys
const effectColor = "#006400"; // Dark green
const lineColor = "#a9a9a9"; // Light grey
const textColor = "#ffffff"; // White
const subTextColor = "#808080"; // Grey

const layerInfo = [
  {
    title: "Your Operational Systems",
    description: "Connects to multiple enterprise systems including 3D, IBM, SAP, Kafka, Oracle, Osisoft, Hadoop, Salesforce.",
    icon: "🔗",
    highlight: "Source Integration",
  },
  {
    title: "Data Foundry",
    description: "The core integration layer that funnels, processes, and unifies data from various sources.",
    icon: "⚙️",
    highlight: "Data Funnel",
  },
  {
    title: "Your Data Platform",
    description: "Powers your data platform with AWS, Azure, Snowflake, Google Cloud support for advanced analytics.",
    icon: "☁️",
    highlight: "Unified Platform",
  },
];

// --- PROP TYPES ---
interface LayerProps {
  scrollYProgress: MotionValue<number>;
  index: number;
}
interface AnimatedCameraProps {
  scrollYProgress: MotionValue<number>;
}
interface ExperienceProps {
  scrollYProgress: MotionValue<number>;
}
interface SceneProps {
  scrollYProgress: MotionValue<number>;
}
interface InfoProps {
  scrollYProgress: MotionValue<number>;
}

// --- TEXT OVERLAY COMPONENT ---
function LayerInfo({ scrollYProgress }: InfoProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(latest => {
      const zoomRanges = [[0.25, 0.4], [0.45, 0.6], [0.65, 0.8]];
      let newIndex = -1;
      for (let i = 0; i < zoomRanges.length; i++) {
        if (latest >= zoomRanges[i][0] && latest <= zoomRanges[i][1]) {
          newIndex = i;
          break;
        }
      }
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeInfo = activeIndex > -1 ? layerInfo[activeIndex] : null;

  return (
    <div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none flex items-center justify-center p-8 md:p-16">
      <AnimatePresence mode="wait">
        {activeInfo && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Icon and highlight badge */}
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="text-5xl filter drop-shadow-lg">
                {activeInfo.icon}
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-[#006400]/20 to-[#333333]/20 rounded-full border border-[#006400]/30 backdrop-blur-sm">
                <span className="text-[#006400] text-sm font-semibold">
                  {activeInfo.highlight}
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2 
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {activeInfo.title}
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {activeInfo.description}
            </motion.p>

            {/* Animated progress indicator */}
            <motion.div 
              className="mt-8 flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="h-1 bg-gradient-to-r from-[#808080] to-[#006400] rounded-full" style={{ width: `${((activeIndex + 1) / 3) * 100}%`, minWidth: '60px' }} />
              <span className="text-[#808080] text-sm font-mono">
                {String(activeIndex + 1).padStart(2, '0')}/03
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 3D COMPONENTS ---
function BottomLayer({ focusProgress }: { focusProgress: MotionValue<number> }) {
  const groupRef = useRef<Group>(null!);
  const materials = useRef<MeshStandardMaterial[]>([]);
  const nodePositions = useMemo(() => [
    new Vector3(0, 0, 0),
    new Vector3(3, 0, 1),
    new Vector3(-2, 0, 3),
    new Vector3(4, 0, -2),
    new Vector3(-4, 0, -1),
    new Vector3(2, 0, -4),
    new Vector3(-3, 0, 4),
    new Vector3(1, 0, -3),
  ], []);

  useFrame(() => {
    const clampedFocus = THREE.MathUtils.clamp(focusProgress.get(), 0, 1);
    materials.current.forEach(mat => {
      mat.emissiveIntensity = clampedFocus * 2;
      mat.opacity = 0.5 + clampedFocus * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {nodePositions.map((pos, i) => (
        <Box key={i} args={[1, 1, 1]} position={pos}>
          <meshStandardMaterial 
            ref={el => materials.current[i] = el!}
            color={effectColor} 
            wireframe 
            transparent 
            opacity={0.5} 
            emissive={effectColor}
            emissiveIntensity={0}
          />
        </Box>
      ))}
    </group>
  );
}

function FunnelLayer({ focusProgress }: { focusProgress: MotionValue<number> }) {
  const groupRef = useRef<Group>(null!);
  const numMeridians = 16;
  const numLatitudes = 10;
  const bottomRadius = 5;
  const neckRadius = 1;
  const topRadius = 8;
  const lowerHeight = 5;
  const upperHeight = 5;
  const meridianMaterials = useRef<MeshStandardMaterial[]>([]);
  const latitudeMaterials = useRef<MeshStandardMaterial[]>([]);

  useFrame(() => {
    const clampedFocus = THREE.MathUtils.clamp(focusProgress.get(), 0, 1);
    [...meridianMaterials.current, ...latitudeMaterials.current].forEach(mat => {
      mat.opacity = 0.5 + clampedFocus * 0.5;
      mat.emissiveIntensity = clampedFocus * 3;
    });
  });

  const meridianLines = [];
  for (let i = 0; i < numMeridians; i++) {
    const theta = (i / numMeridians) * Math.PI * 2;
    const lowerPoints = [
      new Vector3(bottomRadius * Math.cos(theta), -lowerHeight, bottomRadius * Math.sin(theta)),
      new Vector3(neckRadius * Math.cos(theta), 0, neckRadius * Math.sin(theta)),
    ];
    meridianLines.push(
      <DreiLine key={`lower-mer-${i}`} points={lowerPoints} lineWidth={1}>
        <meshStandardMaterial 
          ref={el => meridianMaterials.current.push(el!)}
          color={lineColor} 
          transparent 
          opacity={0.5}
          emissive={effectColor}
          emissiveIntensity={0}
        />
      </DreiLine>
    );
    const upperPoints = [
      new Vector3(neckRadius * Math.cos(theta), 0, neckRadius * Math.sin(theta)),
      new Vector3(topRadius * Math.cos(theta), upperHeight, topRadius * Math.sin(theta)),
    ];
    meridianLines.push(
      <DreiLine key={`upper-mer-${i}`} points={upperPoints} lineWidth={1}>
        <meshStandardMaterial 
          ref={el => meridianMaterials.current.push(el!)}
          color={lineColor} 
          transparent 
          opacity={0.5}
          emissive={effectColor}
          emissiveIntensity={0}
        />
      </DreiLine>
    );
  }

  const latitudeLines = [];
  for (let j = 0; j < numLatitudes; j++) {
    const hLower = -lowerHeight + (j / (numLatitudes - 1)) * lowerHeight;
    const rLower = bottomRadius + (neckRadius - bottomRadius) * ((hLower + lowerHeight) / lowerHeight);
    const lowerPoints = [];
    for (let i = 0; i < numMeridians + 1; i++) {
      const theta = (i / numMeridians) * Math.PI * 2;
      lowerPoints.push(new Vector3(rLower * Math.cos(theta), hLower, rLower * Math.sin(theta)));
    }
    latitudeLines.push(
      <DreiLine key={`lower-lat-${j}`} points={lowerPoints} lineWidth={0.5}>
        <meshStandardMaterial 
          ref={el => latitudeMaterials.current.push(el!)}
          color={lineColor} 
          transparent 
          opacity={0.5}
          emissive={effectColor}
          emissiveIntensity={0}
        />
      </DreiLine>
    );

    const hUpper = (j / (numLatitudes - 1)) * upperHeight;
    const rUpper = neckRadius + (topRadius - neckRadius) * (hUpper / upperHeight);
    const upperPoints = [];
    for (let i = 0; i < numMeridians + 1; i++) {
      const theta = (i / numMeridians) * Math.PI * 2;
      upperPoints.push(new Vector3(rUpper * Math.cos(theta), hUpper, rUpper * Math.sin(theta)));
    }
    latitudeLines.push(
      <DreiLine key={`upper-lat-${j}`} points={upperPoints} lineWidth={0.5}>
        <meshStandardMaterial 
          ref={el => latitudeMaterials.current.push(el!)}
          color={lineColor} 
          transparent 
          opacity={0.5}
          emissive={effectColor}
          emissiveIntensity={0}
        />
      </DreiLine>
    );
  }

  return <group ref={groupRef}>{[...meridianLines, ...latitudeLines]}</group>;
}

function TopLayer({ focusProgress }: { focusProgress: MotionValue<number> }) {
  const groupRef = useRef<Group>(null!);
  const materials = useRef<MeshStandardMaterial[]>([]);
  const numGrids = 4;
  const gridSizeBase = 10;
  const gridSpacing = 2;

  useFrame(() => {
    const clampedFocus = THREE.MathUtils.clamp(focusProgress.get(), 0, 1);
    materials.current.forEach(mat => {
      mat.opacity = 0.5 + clampedFocus * 0.5;
      mat.emissiveIntensity = clampedFocus * 2;
    });
  });

  const grids = [];
  for (let i = 0; i < numGrids; i++) {
    const y = i * gridSpacing;
    const size = gridSizeBase + i * 2;
    grids.push(
      <gridHelper key={i} args={[size, 20, lineColor, lineColor]} position={[0, y, 0]}>
        <meshStandardMaterial 
          ref={el => materials.current[i] = el!}
          transparent 
          opacity={0.5 - (i / numGrids) * 0.3}
          emissive={effectColor}
          emissiveIntensity={0}
        />
      </gridHelper>
    );
  }

  return <group ref={groupRef}>{grids}</group>;
}

function DrippingLines({ bottomY }: { bottomY: number }) {
  const nodePositions = useMemo(() => [
    new Vector3(0, bottomY, 0),
    new Vector3(3, bottomY, 1),
    new Vector3(-2, bottomY, 3),
    new Vector3(4, bottomY, -2),
    new Vector3(-4, bottomY, -1),
    new Vector3(2, bottomY, -4),
    new Vector3(-3, bottomY, 4),
    new Vector3(1, bottomY, -3),
  ], [bottomY]);

  const lowerHeight = 5;
  const bottomRadius = 5;
  const lines = [];
  for (let i = 0; i < nodePositions.length; i++) {
    const theta = (i / nodePositions.length) * Math.PI * 2;
    const start = new Vector3(bottomRadius * Math.cos(theta), -lowerHeight, bottomRadius * Math.sin(theta));
    const end = nodePositions[i];
    lines.push(
      <DreiLine key={i} points={[start, end]} color={lineColor} lineWidth={0.5} dashed dashSize={0.2} gapSize={0.3} transparent opacity={0.7} />
    );
  }

  return <group>{lines}</group>;
}

function Arrow() {
  return (
    <group position={[0, -1, 0]} scale={0.5}>
      <DreiLine points={[new Vector3(0, 0, 0), new Vector3(0, 5, 0)]} color={textColor} lineWidth={2} />
      <Cone args={[0.5, 1, 32]} position={[0, 5, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color={textColor} />
      </Cone>
    </group>
  );
}

function Layer({ scrollYProgress, index }: LayerProps) {
  const ref = useRef<Group>(null!);
  const layerHeight = 5;
  const spacing = 15;
  const numLayers = layerColors.length;
  const yFactor = index - (numLayers - 1) / 2;
  const initialY = yFactor * layerHeight;
  const finalY = yFactor * (layerHeight + spacing);
  const y = useTransform(scrollYProgress, [0, 0.2], [initialY, finalY]);

  const zoomRanges = [[0.25, 0.4], [0.45, 0.6], [0.65, 0.8]];
  const [start, end] = zoomRanges[index];
  const focusProgress = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = y.get();
    }
  });

  return (
    <group ref={ref}>
      {index === 0 && <BottomLayer focusProgress={focusProgress} />}
      {index === 1 && <FunnelLayer focusProgress={focusProgress} />}
      {index === 2 && <TopLayer focusProgress={focusProgress} />}
    </group>
  );
}

function AnimatedCamera({ scrollYProgress }: AnimatedCameraProps) {
  const numLayers = layerColors.length;
  const layerHeight = 5;
  const spacing = 15;
  const layerPositions = Array.from({ length: numLayers }, (_, i) => {
    const yFactor = i - (numLayers - 1) / 2;
    return yFactor * (layerHeight + spacing);
  });

  const animationKeyframes = [0, 0.25, 0.4, 0.45, 0.6, 0.65, 0.8, 1.0];
  const cameraY = useTransform(scrollYProgress, animationKeyframes, [
    0,
    0,
    layerPositions[0],
    layerPositions[1],
    layerPositions[1],
    layerPositions[2],
    layerPositions[2],
    layerPositions[2],
  ]);
  const cameraZ = useTransform(scrollYProgress, animationKeyframes, [
    15,
    15,
    8,
    15,
    8,
    15,
    8,
    15,
  ]);
  const cameraX = useTransform(scrollYProgress, [0, 1], [0, 0]);

  useFrame((state: RootState) => {
    state.camera.position.y = cameraY.get();
    state.camera.position.z = cameraZ.get();
    state.camera.position.x = cameraX.get();
    state.camera.lookAt(0, cameraY.get(), 0);
  });
  return null;
}

function Experience({ scrollYProgress }: ExperienceProps) {
  const groupRef = useRef<Group>(null!);
  const rotateY = useTransform(scrollYProgress, [0, 0.2], [-Math.PI / 8, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [Math.PI / 12, 0]);
  const bottomY = -15; // Fixed position for bottom

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotateY.get();
      groupRef.current.rotation.x = rotateX.get();
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 8, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#808080" />
      <AnimatedCamera scrollYProgress={scrollYProgress} />
      <group ref={groupRef}>
        {layerColors.map((_, i) => (
          <Layer key={i} index={i} scrollYProgress={scrollYProgress} />
        ))}
        <DrippingLines bottomY={bottomY} />
        <Arrow />
      </group>
    </>
  );
}

function Scene({ scrollYProgress }: SceneProps) {
  return (
    <Canvas
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh" }}
      camera={{ position: [0, 0, 15], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Experience scrollYProgress={scrollYProgress} />
    </Canvas>
  );
}

export default function CubeBlock() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={scrollRef} id="ai-engine" className="relative w-full h-[500vh] bg-gradient-to-br from-black via-[#333333] to-[#555555]">
      <div className="sticky top-0 h-screen w-full">
        {/* Title */}
        <motion.div
          className="absolute top-[10vh] left-1/2 transform -translate-x-1/2 text-center text-white z-20"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Data Foundry
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Fuels your data platform
          </motion.p>
        </motion.div>

        {/* Right side diagram area */}
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <Scene scrollYProgress={scrollYProgress} />
        </div>

        {/* Left side text content */}
        <LayerInfo scrollYProgress={scrollYProgress} />

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-20"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 1]) }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
          <p className="text-sm text-gray-400">Scroll to explore layers</p>
        </motion.div>
      </div>
    </div>
  );
}