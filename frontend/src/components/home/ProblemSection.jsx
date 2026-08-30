import { motion } from 'framer-motion';
import { Reveal, SectionEyebrow, CountUp } from '../ui';
import { TRUST_POINTS } from '../config/landingConfig';
const BRAND = "AgentCV";

import { ArrowRight, Lock } from 'lucide-react';


function CropMarks() {
  const Mark = ({ className }) => (
    <svg
      viewBox="0 0 18 18"
      className={`acv-crop-mark ${className}`}
      aria-hidden="true"
    >
      <line
        x1="9"
        y1="0"
        x2="9"
        y2="18"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="0"
        y1="9"
        x2="18"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="9"
        cy="9"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 hidden sm:block"
      aria-hidden="true"
    >
      <Mark className="left-4 top-4" />
      <Mark className="right-4 top-4" />
      <Mark className="bottom-4 left-4" />
      <Mark className="bottom-4 right-4" />
    </div>
  );
}

function TrustPanel() {
  return (
    <div className="relative">
      <CropMarks />
      <Reveal delay={0.1} className="acv-panel acv-pop relative overflow-hidden rounded-[28px] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--acv-border)]">
              <Lock className="h-3.5 w-3.5 text-[var(--acv-ink)]" strokeWidth={2} />
            </span>
            <span className="acv-mono text-[11.5px] font-semibold uppercase tracking-wide text-[var(--acv-ink-faint)]">
              security.log
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--acv-ink-faint)]">
            <span
              className="acv-pulse-dot h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--acv-signal)" }}
            />
            local only
          </span>
        </div>

        <div className="mt-5">
          {TRUST_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 border-t border-[var(--acv-border-soft)] py-3.5 first:border-t-0"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-[var(--acv-border)] bg-[var(--acv-bg)]">
                <point.icon className="h-4 w-4 text-[var(--acv-ink)]" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13.5px] font-semibold text-[var(--acv-ink)]">
                    {point.title}
                  </p>
                  <span className="acv-chip flex-none rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--acv-signal)]">
                    {point.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--acv-ink-soft)]">
                  {point.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="acv-neo-inset mt-6 flex items-center justify-between rounded-2xl px-4 py-3">
          <span className="acv-mono text-[11px] text-[var(--acv-ink-faint)]">
            bytes uploaded / session
          </span>
          <span className="acv-display text-[18px] text-[var(--acv-ink)]">
            <CountUp value="0" />
          </span>
        </div>
      </Reveal>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section id="trust" className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="text-center lg:text-left">
          <SectionEyebrow>About trust</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
            Security you can verify, not just believe
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-[var(--acv-ink-soft)] lg:mx-0">
            {BRAND} isn't a black box you're asked to trust. Your data is
            encrypted on disk, nothing is logged or sent off-device, the
            tailoring engine is open source, and every action still asks
            for your say-so before it runs.
          </p>
          <a
            href="https://github.com"
            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--acv-ink)] underline decoration-[var(--acv-border)] underline-offset-4 transition hover:decoration-[var(--acv-accent)]"
          >
            View the source on GitHub
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Reveal>

        <TrustPanel />
      </div>
    </section>
  );
}

