'use client';

import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="header-gradient backdrop-blur-lg rounded-full shadow-lg border border-white/20 py-3 px-6 flex items-center justify-between">
          {/* Company Logo/Name */}
          <div className="flex items-center">
            {/* You can replace this with your logo image if you have one. */}
            {/* <Image
              src="/logo.png"
              alt="Blacklane Logo"
              width={120}
              height={40}
            /> */}
            <span className="text-black font-bold text-xl tracking-tight">
              Blacklane.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-black font-medium">
            <a href="#" className="hover:text-gray-800 transition-colors">Who We Are</a>
            <a href="#" className="hover:text-gray-800 transition-colors">What We Do</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Future of Data</a>
            <a href="#" className="hover:text-gray-800 transition-colors">News</a>
          </nav>

          {/* Call-to-action Button with Arrow and Gradient */}
          <button className="button-gradient text-black font-semibold py-2 px-6 rounded-full transition-colors hover:bg-black hover:text-white flex items-center space-x-2">
            <span>Get in touch</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Global CSS for slow-moving gradient animations */}
      <style>{`
        .header-gradient {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.6),
            rgba(200, 200, 200, 0.5),
            rgba(100, 100, 100, 0.5),
            rgba(80, 80, 80, 0.4)
          );
          background-size: 300% 300%;
          animation: gradient 12s ease-in-out infinite;
        }

        .button-gradient {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 1),
            rgba(200, 200, 200, 0.9),
            rgba(150, 150, 150, 0.8)
          );
          background-size: 200% 200%;
          animation: gradient 8s ease-in-out infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default Header;