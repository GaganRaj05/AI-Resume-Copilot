import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow } from '../ui';
import { FEATURE_STRIP } from '../config/landingConfig';

export default function FeatureStrip() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Features</SectionEyebrow>
          <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
            Everything the agent handles for you
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 rounded-3xl border border-[#ECEAF8] bg-[#F9F8FE] p-8 sm:grid-cols-2 lg:grid-cols-5 lg:p-10">
          {FEATURE_STRIP.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <motion.div whileHover={{ y: -3 }} className="flex flex-col items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <item.icon className="h-5 w-5 text-[#6552E8]" strokeWidth={2} />
                </div>
                <p className="text-[14.5px] font-bold text-[#14142B]">{item.title}</p>
                <p className="text-[13px] leading-relaxed text-[#5B5B76]">{item.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}