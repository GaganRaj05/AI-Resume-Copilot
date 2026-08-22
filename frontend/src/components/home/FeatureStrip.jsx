import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow } from '../ui';
import { FEATURE_STRIP } from '../config/landingConfig';

export default function FeatureStrip() {
  return (
    <section id="features" className="bg-[var(--acv-surface)] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow index="04">Features</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[32px] font-bold leading-tight text-[var(--acv-ink)] sm:text-[38px]">
            Everything the agent handles{" "}
            <span className="acv-serif bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
              for you
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 rounded-3xl border border-[var(--acv-border)] bg-[var(--acv-surface-alt)] p-8 sm:grid-cols-2 lg:grid-cols-3 lg:p-10">
          {FEATURE_STRIP.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3 }}
                className="group flex flex-col items-start gap-3"
              >
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--acv-surface)] shadow-sm"
                >
                  <item.icon
                    className="h-5 w-5 text-[#6552E8]"
                    strokeWidth={2}
                  />
                </motion.div>
                <p className="text-[14.5px] font-bold text-[var(--acv-ink)]">
                  {item.title}
                </p>
                <p className="text-[13px] leading-relaxed text-[var(--acv-ink-soft)]">
                  {item.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}