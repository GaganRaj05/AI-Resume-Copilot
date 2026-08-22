import { motion } from "framer-motion";
import "../components/styles/Home.css";
import {
  Navbar,
  HeroCopy,
  HeroVisual,
  TrustLogos,
  ProblemSection,
  HowItWorks,
  WhyDifferent,
  FeatureStrip,
  ReviewsSection,
  FaqSection,
  FinalCta,
  Footer,
} from "../components/home/index";

import { useEffect, useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("acv-theme");
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch (err) {
      console.log(err.message);
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
    <div
      className={`acv-font min-h-screen bg-[var(--acv-bg)] ${theme === "dark" ? "dark" : ""}`}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-10 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <HeroCopy />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </main>

      <TrustLogos />
      <ProblemSection />
      <HowItWorks />
      <WhyDifferent />
      <FeatureStrip />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}
