import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow, CountUp } from '../ui';
import { PROBLEM_POINTS } from '../config/landingConfig';

export default function ProblemSection() {
  return (
    <section className="acv-dotgrid relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>The Problem</SectionEyebrow>
        <h2 className="acv-display mt-4 text-[32px] font-bold leading-tight text-[var(--acv-ink)] sm:text-[38px]">
          Job hunting shouldn&apos;t be a{" "}
          <span className="acv-serif bg-gradient-to-r from-[#D1487A] to-[#E8895C] bg-clip-text text-transparent">
            second job
          </span>
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--acv-ink-soft)]">
          Every serious applicant runs into the same wall — and most tools that
          promise to fix it just move the cost from your time to your wallet.
        </p>
      </Reveal>

      <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEM_POINTS.map((point, i) => (
          <Reveal key={point.title} delay={i * 0.08}>
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: `0 20px 40px -22px ${point.accent}66`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-surface)] p-6"
            >
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: point.accent }}
              />

              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${point.accent}29, ${point.accent}0A)`,
                }}
              >
                <point.icon
                  className="h-[23px] w-[23px]"
                  style={{ color: point.accent }}
                  strokeWidth={1.8}
                />
              </div>

              <p className="acv-display mt-4 text-[27px] font-bold text-[var(--acv-ink)]">
                {point.stat === "29" ? "$" : ""}
                <CountUp value={point.stat} suffix={point.statSuffix} />
              </p>
              <p className="text-[11.5px] font-medium leading-snug text-[var(--acv-ink-faint)]">
                {point.statLabel}
              </p>
              <p className="mt-3 text-[14.5px] font-bold text-[var(--acv-ink)]">
                {point.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--acv-ink-soft)]">
                {point.body}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}