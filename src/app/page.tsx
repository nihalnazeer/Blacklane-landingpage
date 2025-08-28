import Hero from '../components/Hero';
import CubeBlock from '../components/CubeBlock';
import HowWeWork from '../components/HowWeWork';
import IllustrationBlock from '../components/IllustrationBlock';
import WhatWeDoPage  from '@/components/Whatwedo';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Hero />
      
      {/* The HowWeWork component replaces the static section */}
      
      <IllustrationBlock />
      <HowWeWork />
      <WhatWeDoPage />
    </main>
  );
}