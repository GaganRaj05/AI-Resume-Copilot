import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow } from '../ui';
import { HOW_IT_WORKS } from '../config/landingConfig';
import {useRef} from 'react'
import { useScroll } from 'framer-motion';

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



export default function HowItWorks() {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.7", "end 0.4"],
  });

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-xl text-center">
        <SectionEyebrow>How it works</SectionEyebrow>
        <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
          Four steps, then it runs itself
        </h2>
      </Reveal>

      <div ref={trackRef} className="relative mt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--acv-border)] lg:block" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px origin-top -translate-x-1/2 bg-[var(--acv-accent)] lg:block"
          style={{ scaleY: scrollYProgress }}
        />

        <StaggerGrid className="relative border-t border-[var(--acv-border-soft)]">
          {HOW_IT_WORKS.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={step.title}
                variants={staggerItem}
                className={`flex flex-col items-center gap-8 border-b border-[var(--acv-border-soft)] py-12 sm:gap-12 lg:flex-row ${
                  reversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex flex-1 items-center justify-center lg:justify-normal">
                  <div className="flex items-center gap-5">
                    <span className="acv-display select-none text-[64px] leading-none text-[var(--acv-border)] sm:text-[88px]">
                      0{i + 1}
                    </span>
                    <motion.div
                      whileHover={{ rotate: -6, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="relative flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-bg)]"
                    >
                      <step.icon className="h-6 w-6 text-[var(--acv-ink)]" strokeWidth={1.6} />
                    </motion.div>
                  </div>
                </div>
                <div className={`flex-1 text-center lg:text-left ${reversed ? "lg:text-right" : ""}`}>
                  <p className="text-[20px] font-semibold text-[var(--acv-ink)] sm:text-[24px]">
                    {step.title}
                  </p>
                  <p
                    className={`mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-[var(--acv-ink-soft)] lg:mx-0 ${
                      reversed ? "lg:ml-auto" : ""
                    }`}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}