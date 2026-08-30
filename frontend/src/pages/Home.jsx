import { motion } from "framer-motion";
import "../components/styles/Home.css";
import {
  Navbar,
  HeroSection,
  HowItWorks,
  ReviewsSection,
  FaqSection,
  FinalCta,
  Footer,
  StatStrip,
  ProblemSection,
  FeatureStrip
} from "../components/home/index";


import { useEffect, useState } from "react";
import WhyLocal from "../components/home/WhyDifferent";

import { useScroll} from 'framer-motion'

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-[var(--acv-accent)]"
    />
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("acv-theme");
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      // localStorage unavailable (privacy mode, SSR, etc.) — default to light
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem("acv-theme", next);
      } catch {
        // ignore write failures
      }
      return next;
    });
  };

  return (
    <div className={`acv-font min-h-screen bg-[var(--acv-bg)] ${theme === "dark" ? "dark" : ""}`}>
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <HeroSection />
      <ProblemSection/>
      <StatStrip />
      <HowItWorks />
      <WhyLocal />
      <FeatureStrip/>
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}