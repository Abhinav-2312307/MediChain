import React, { useRef, useLayoutEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Security from "../components/Security";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  const scrollRef = useRef(null);

  const locoScrollRef = useRef(null);

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) {
        return;
      }

      // Initialize Locomotive Scroll
      locoScrollRef.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        tablet: { smooth: true },
        smartphone: { smooth: true },
      });
    }, 100); // 100ms delay to wait for React's render

    return () => {
      clearTimeout(timer);

      if (locoScrollRef.current) {
        locoScrollRef.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div ref={scrollRef} data-scroll-container id="main-scroll-container">
      <Navbar locoScrollRef={locoScrollRef} />
      {/* to be removed later  */}
      <div className="mt-6 w-full flex justify-center">
        <div className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 shadow-md text-center text-sm font-semibold animate-in fade-in">
          ⚠️ For now, only the <strong>Patient Portal</strong> is functional.
          Doctor & Hospital portals are under development
        </div>
      </div>

      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <CTASection />
      <Footer />
    </div>
  );
}
