"use client";

import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import DataIntegration from "./illustrations/DataIntegration";
import OperationalMonitoring from "./illustrations/OperationalMonitoring";
import PredictiveIntelligence from "./illustrations/PredictiveIntelligence";
import DecisionMaking from "./illustrations/DecisionMaking";

// Type assertions for components
const TypedDataIntegration = DataIntegration as React.ComponentType<{ focusProgress: number }>;
const TypedOperationalMonitoring = OperationalMonitoring as React.ComponentType<{ focusProgress: number }>;
const TypedPredictiveIntelligence = PredictiveIntelligence as React.ComponentType<{ focusProgress: number }>;
const TypedDecisionMaking = DecisionMaking as React.ComponentType<{ focusProgress: number }>;

const sections = [
  {
    title: "Data Integration",
    desc: "Seamlessly unify data streams from multiple enterprise systems into a cohesive, real-time analytics foundation.",
    component: TypedDataIntegration,
    tilt: true
  },
  {
    title: "Operational Monitoring",
    desc: "Advanced real-time tracking and intelligent visualization of critical operational metrics and performance indicators.",
    component: TypedOperationalMonitoring,
    tilt: false
  },
  {
    title: "Predictive Intelligence",
    desc: "Harness the power of advanced machine learning algorithms to forecast trends and anticipate market opportunities.",
    component: TypedPredictiveIntelligence,
    tilt: false
  },
  {
    title: "Decision Making",
    desc: "Transform complex data insights into strategic, actionable decisions with our intelligent recommendation engine.",
    component: TypedDecisionMaking,
    tilt: false
  },
];

interface SectionInfoProps {
  scrollYProgress: any;
}

function SectionInfo({ scrollYProgress }: SectionInfoProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest: number) => {
      const sectionRanges = [
        [0.1, 0.3],   // Section 0
        [0.3, 0.5],   // Section 1
        [0.5, 0.7],   // Section 2
        [0.7, 0.9],   // Section 3
      ];
      
      let newIndex = -1;
      for (let i = 0; i < sectionRanges.length; i++) {
        if (latest >= sectionRanges[i][0] && latest <= sectionRanges[i][1]) {
          newIndex = i;
          break;
        }
      }
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeSection = activeIndex > -1 ? sections[activeIndex] : null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-start p-8 md:p-16 lg:p-24">
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: -60, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-white w-1/2 max-w-2xl"
          >
            <motion.div
              className="mb-2 text-xs font-semibold tracking-[0.3em] text-emerald-400 uppercase opacity-80"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {String(activeIndex + 1).padStart(2, '0')} / 04
            </motion.div>
            
            <motion.h2 
              className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight tracking-tight"
              style={{
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.02em'
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-emerald-100 bg-clip-text text-transparent">
                {activeSection.title}
              </span>
            </motion.h2>
            
            <motion.div
              className="w-12 h-[1px] bg-gradient-to-r from-emerald-400 to-transparent mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            
            <motion.p 
              className="text-base lg:text-lg text-gray-300 leading-relaxed font-light tracking-wide opacity-90"
              style={{
                fontFamily: '"Inter", sans-serif',
                lineHeight: '1.7'
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              {activeSection.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedIllustrationProps {
  scrollYProgress: any;
}

function AnimatedIllustration({ scrollYProgress }: AnimatedIllustrationProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focusProgress, setFocusProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest: number) => {
      const sectionRanges = [
        [0.1, 0.3],   // Section 0
        [0.3, 0.5],   // Section 1
        [0.5, 0.7],   // Section 2
        [0.7, 0.9],   // Section 3
      ];
      
      let newIndex = -1;
      let progress = 0;
      
      for (let i = 0; i < sectionRanges.length; i++) {
        const [start, end] = sectionRanges[i];
        if (latest >= start && latest <= end) {
          newIndex = i;
          const sectionProgress = (latest - start) / (end - start);
          
          if (sectionProgress <= 0.2) {
            progress = sectionProgress / 0.2;
          } else if (sectionProgress <= 0.8) {
            progress = 1;
          } else {
            progress = 1 - ((sectionProgress - 0.8) / 0.2);
          }
          break;
        }
      }
      
      setActiveIndex(newIndex);
      setFocusProgress(Math.max(0, Math.min(1, progress)));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeSection = activeIndex > -1 ? sections[activeIndex] : null;

  return (
    <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none flex items-center justify-center">
      <div className="relative w-full max-w-lg h-96 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSection && (
            <motion.div
              key={activeIndex}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                rotateZ: activeSection.tilt ? 45 : 0
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateZ: activeSection.tilt ? 45 : 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8,
                rotateZ: activeSection.tilt ? 45 : 0
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1]
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <activeSection.component focusProgress={focusProgress} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function IllustratorBlock() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={scrollRef} className="relative w-full h-[400vh] bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950/20">
      <div className="sticky top-0 h-screen w-full">
        {/* Fixed title in top-left */}
        <div className="absolute top-8 left-8 z-30">
          <h1
            className="text-2xl font-light text-white tracking-wide"
            style={{
              fontFamily: '"Inter", "SF Pro Display", sans-serif',
              fontWeight: 200,
              letterSpacing: '0.05em'
            }}
          >
            <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Blacklane Foundry
            </span>
          </h1>
        </div>

        {/* Subtle background grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Section info overlay */}
        <div className="absolute top-0 left-0 w-full h-screen flex items-center z-10">
          <SectionInfo scrollYProgress={scrollYProgress} />
        </div>

        {/* Illustrations without containers */}
        <div className="absolute top-0 left-0 w-full h-screen z-5">
          <AnimatedIllustration scrollYProgress={scrollYProgress} />
        </div>

        {/* Minimal progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-3">
            <div className="text-[10px] text-gray-600 font-mono tracking-widest">PROGRESS</div>
            <div className="w-32 h-[1px] bg-gray-800 relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-white"
                style={{
                  width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}