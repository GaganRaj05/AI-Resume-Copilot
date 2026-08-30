import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow } from '../ui';
import { FEATURES } from '../config/landingConfig';


function StaggerGrid({ children, className = "" }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};


export default function FeatureStrip() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-xl text-center">
        <SectionEyebrow>Features</SectionEyebrow>
        <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
          Everything it does, on its own
        </h2>
      </Reveal>

      <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <motion.div key={feature.title} variants={staggerItem}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="acv-panel h-full rounded-[20px] p-6"
            >
              <motion.div
                whileHover={{ rotate: -6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--acv-border)]"
              >
                <feature.icon className="h-[19px] w-[19px] text-[var(--acv-ink)]" strokeWidth={1.8} />
              </motion.div>
              <p className="mt-4 text-[14.5px] font-semibold text-[var(--acv-ink)]">
                {feature.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--acv-ink-soft)]">
                {feature.body}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </StaggerGrid>
    </section>
  );
}