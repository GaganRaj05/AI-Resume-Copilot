import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow, CountUp } from '../ui';
import { PROBLEM_POINTS } from '../config/landingConfig';

export default function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>The Problem</SectionEyebrow>
        <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
          Job hunting shouldn&apos;t be a second job
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[#5B5B76]">
          Every serious applicant runs into the same wall — and most tools
          that promise to fix it just move the cost from your time to your
          wallet.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEM_POINTS.map((point, i) => (
          <Reveal key={point.title} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -5, boxShadow: `0 20px 40px -22px ${point.accent}66` }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-[#ECEAF8] bg-white p-6"
            >
              <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: point.accent }} />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: point.accentSoft }}
              >
                <point.icon className="h-5 w-5" style={{ color: point.accent }} strokeWidth={2} />
              </div>
              <p className="acv-display mt-4 text-[27px] font-bold text-[#14142B]">
                <CountUp value={point.stat} suffix={point.statSuffix} />
              </p>
              <p className="text-[11.5px] font-medium leading-snug text-[#8B899E]">{point.statLabel}</p>
              <p className="mt-3 text-[14.5px] font-bold text-[#14142B]">{point.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5B5B76]">{point.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}