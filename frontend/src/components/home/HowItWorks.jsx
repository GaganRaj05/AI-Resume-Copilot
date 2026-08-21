import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { HOW_IT_WORKS } from '../config/landingConfig';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How It Works</SectionEyebrow>
          <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
            Set it up once. It runs every morning.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-4 lg:gap-10">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-full flex-col items-start rounded-2xl border border-[#ECEAF8] bg-white p-6"
              >
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${step.accent}17` }}
                >
                  <step.icon className="h-5.5 w-5.5" style={{ color: step.accent }} strokeWidth={2} />
                  <span
                    className="acv-display absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-white"
                    style={{ backgroundColor: step.accent }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className="mt-4 text-[15.5px] font-bold text-[#14142B]">{step.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5B5B76]">{step.body}</p>
              </motion.div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="absolute -right-[26px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#F6F5FC] p-1 lg:block">
                  <ArrowRight className="h-4 w-4 text-[#C9C4EE]" strokeWidth={2.5} />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}