import {  Check, Minus } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { BRAND, COMPARISON_ROWS } from '../config/landingConfig';
import {motion} from 'framer-motion'


function ComparisonCell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4" style={{ color: "var(--acv-signal)" }} />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-[var(--acv-ink-faint)]" />;
  }
  return <span>{value}</span>;
}
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


export default function WhyDifferent() {
  return (
    <section id="why-local" className="bg-[var(--acv-bg-flat)] py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
            <SectionEyebrow>Why local</SectionEyebrow>
            <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
              Cloud tools rent you a resume
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-[var(--acv-ink-soft)] lg:mx-0">
              Every other tailoring tool asks you to hand your career history
              to a server. {BRAND} skips that trade — everything below runs
              on your machine, or it doesn't run.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-[1fr_auto] items-end gap-x-6 border-b border-[var(--acv-border-soft)] pb-3 text-[11.5px] font-semibold uppercase tracking-wide text-[var(--acv-ink-faint)]">
              <span />
              <div className="flex items-center gap-8">
                <span className="w-24 text-center sm:w-28">Cloud tools</span>
                <span className="w-24 text-center text-[var(--acv-ink)] sm:w-28">{BRAND}</span>
              </div>
            </div>
            <StaggerGrid>
              {COMPARISON_ROWS.map((row) => (
                <motion.div
                  key={row.label}
                  variants={staggerItem}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-6 border-b border-[var(--acv-border-soft)] py-4 text-[13.5px]"
                >
                  <span className="font-medium text-[var(--acv-ink)]">{row.label}</span>
                  <div className="flex items-center gap-8">
                    <span className="w-24 text-center text-[var(--acv-ink-faint)] sm:w-28">
                      <ComparisonCell value={row.cloud} />
                    </span>
                    <span className="w-24 text-center font-semibold text-[var(--acv-ink)] sm:w-28">
                      <ComparisonCell value={row.local} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </StaggerGrid>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
