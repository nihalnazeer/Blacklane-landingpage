import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What We Do | Operational Intelligence',
  description: 'Mastering Operational Intelligence for future growth.',
};

export default function WhatWeDoPage() {
  const services = [
    {
      title: "Streamline Financial Control",
      description: "Digitize and unify financial data to ensure accurate cash flow monitoring and better decision-making across projects."
    },
    {
      title: "Build Intelligent Dashboards",
      description: "Create real-time command centers that visualize KPIs, turning raw data into actionable insights for your leadership."
    },
    {
      title: "Predict and Optimize",
      description: "Leverage advanced forecasting models for cash flow, risk, and resource allocation to move from reactive to predictive control."
    },
    {
      title: "Sustain with Strategic Partnership",
      description: "Beyond tools we partner with you long-term to continuously optimize and co-create your growth roadmap."
    }
  ];

  return (
    <section className="bg-black text-white py-24 sm:py-32">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 md:mb-20">
          <p className="text-sm text-gray-400 mb-4">What we do</p>
          <h1 className="text-5xl md:text-6xl font-bold">
            Mastering <span className="font-light">Operational Intelligence</span>
          </h1>
          <p className="mt-6 max-w-4xl text-gray-300">
            We turn fragmented operational data into a single source of truth, giving you real-time visibility, predictive insights, and measurable financial impact. For us, it means expertise in analytics, precision in engineering, and a vision for your future growth.
          </p>
        </div>

        {/* Services Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service) => (
            <div key={service.title}>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}