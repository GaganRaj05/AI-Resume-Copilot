import {useRef, useState} from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Bot, CheckCircle2, Loader2, Clock,
  ArrowRight, Download
} from 'lucide-react';
import {  PrimaryButton, SecondaryButton, Reveal, CountUp } from '../ui';
import {  OS_LABEL, HERO_BULLETS, TRUST_ROW, STATUS_STEPS } from '../config/landingConfig';
import WaitlistPopup from './forms/WaitListPopUp';

const heroLineVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const heroWordVariants = {
  hidden: { opacity: 0, y: 46, rotateX: -35 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};
const heroUnderlineVariants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
};
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full bg-[var(--acv-accent)] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-white"
    >
      <span className="acv-pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
      Runs while you sleep
    </motion.div>
  );
}

function HeroGhostMock() {
  /* Faint, grayscale ghost of the product UI sitting behind the headline —
     the same layered-card device as the reference, kept quiet so the
     type stays the loudest thing on the page. Drifts slowly on scroll for
     a touch of depth, rather than sitting dead-still. */
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yFront = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className="acv-ghost pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <motion.div style={{ y: yBack }} className="acv-panel absolute left-[6%] top-[8%] w-[220px] rounded-2xl p-3">
        <div className="h-2 w-16 rounded-full bg-[var(--acv-border)]" />
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[var(--acv-border-soft)]" />
          <div className="h-1.5 w-4/5 rounded-full bg-[var(--acv-border-soft)]" />
        </div>
      </motion.div>
      <motion.div style={{ y: yFront }} className="acv-panel absolute right-[8%] top-[4%] w-[190px] rounded-2xl p-3">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-md bg-[var(--acv-border)]" />
          <div className="h-1.5 w-20 rounded-full bg-[var(--acv-border-soft)]" />
        </div>
      </motion.div>
      <motion.div style={{ y: yFront }} className="acv-panel absolute bottom-[6%] left-[10%] w-[200px] rounded-2xl p-3">
        <div className="h-1.5 w-24 rounded-full bg-[var(--acv-border-soft)]" />
        <div className="mt-2 h-6 w-full rounded-lg bg-[var(--acv-bg-flat)]" />
      </motion.div>
      <motion.div style={{ y: yBack }} className="acv-panel absolute bottom-[10%] right-[6%] w-[170px] rounded-2xl p-3">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-12 rounded-full bg-[var(--acv-border-soft)]" />
          <div className="h-3 w-3 rounded-full bg-[var(--acv-border)]" />
        </div>
      </motion.div>
    </div>
  );
}

/** Print registration marks — small crosshairs at the hero's corners.
 *  A detail borrowed from the "stark print" brief instead of a stock
 *  dot-grid or blob backdrop. */
function CropMarks() {
  const Mark = ({ className }) => (
    <svg viewBox="0 0 18 18" className={`acv-crop-mark ${className}`} aria-hidden="true">
      <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1" />
      <circle cx="9" cy="9" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      <Mark className="left-4 top-4" />
      <Mark className="right-4 top-4" />
      <Mark className="bottom-4 left-4" />
      <Mark className="bottom-4 right-4" />
    </div>
  );
}

function LiveAnnotation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
      className="acv-float pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--acv-ink)] py-2.5 pl-2.5 pr-4 text-[12.5px] font-semibold text-[var(--acv-bg)] sm:flex"
    >
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--acv-signal-soft)]">
        <Bot className="h-3 w-3" style={{ color: "var(--acv-signal)" }} />
      </span>
      Tailoring live — zero network calls
    </motion.div>
  );
}

/** The hero's signature object: a printed "ticket" for a tailored resume,
 *  perforated edges and a rotated rubber stamp instead of a generic
 *  three-box SaaS status widget — it reads like a physical receipt the
 *  agent handed you, which is the "stark print" idea made concrete. */
function ResumeTicket() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-14 max-w-lg"
    >
      <div className="acv-panel acv-ticket relative overflow-hidden rounded-[20px]">
        <div className="flex items-center justify-between px-6 py-4">
          <p className="acv-mono flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--acv-ink-faint)]">
            <span className="acv-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--acv-signal)]" />
            Tailor receipt
          </p>
          <p className="acv-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--acv-ink-faint)]">
            No. 0042
          </p>
        </div>

        <div className="acv-perforation px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="acv-mono text-[9.5px] uppercase tracking-wider text-[var(--acv-ink-faint)]">
                Tailored for
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[var(--acv-ink)]">
                Senior Product Manager
              </p>
              <p className="acv-mono mt-1 flex items-center gap-1.5 text-[11px] text-[var(--acv-ink-faint)]">
                <Clock className="h-3 w-3" />
                Matched 9:00am · Refreshed daily
              </p>
            </div>
            <div className="acv-stamp flex h-16 w-16 flex-none rotate-[-9deg] items-center justify-center text-center">
              <span className="acv-mono text-[9px] font-bold uppercase leading-tight">
                Tailored
                <br />
                Locally
              </span>
            </div>
          </div>

          <div className="acv-mono mt-5 space-y-2 text-[11.5px]">
            {STATUS_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2.5"
              >
                {step.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 flex-none" style={{ color: "var(--acv-signal)" }} />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 flex-none animate-spin" style={{ color: "var(--acv-accent)" }} />
                )}
                <span
                  className="uppercase tracking-wide"
                  style={{ color: step.done ? "var(--acv-ink)" : "var(--acv-ink-soft)" }}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="acv-perforation flex items-center justify-between px-6 py-3.5">
          <p className="acv-mono text-[10px] uppercase tracking-wider text-[var(--acv-ink-faint)]">
            Local runtime · No network
          </p>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--acv-signal)" }}>
            <Bot className="h-3.5 w-3.5" />
            Agent online
          </span>
        </div>
      </div>

      <LiveAnnotation />
    </motion.div>
  );
}

export default function HeroSection() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, 0]);

  return (
    <section ref={heroRef} className="acv-noise relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10 lg:pb-16 lg:pt-20">
        <CropMarks />
        <HeroGhostMock />

        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <HeroBadge />

          <motion.h1
            variants={heroLineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            style={{ perspective: 700 }}
            className="acv-display mt-6 text-[54px] uppercase leading-[0.92] text-[var(--acv-ink)] sm:text-[76px] lg:text-[92px]"
          >
            <motion.span variants={heroWordVariants} className="block" style={{ transformOrigin: "50% 100%" }}>
              Apply
            </motion.span>
            <motion.span variants={heroWordVariants} className="block" style={{ transformOrigin: "50% 100%" }}>
              8x&nbsp;more
            </motion.span>
            <motion.span
              variants={heroWordVariants}
              className="relative inline-block"
              style={{ transformOrigin: "50% 100%" }}
            >
              places
              <svg
                className="absolute -bottom-2 left-0 w-full text-[var(--acv-accent)]"
                viewBox="0 0 300 18"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 12 Q 150 -4 298 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  variants={heroUnderlineVariants}
                />
              </svg>
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mx-auto mt-7 max-w-lg text-[16px] leading-relaxed text-[var(--acv-ink-soft)]"
          >
            Connect your background once. The agent scrapes job boards every
            morning at 9am, tailors your resume with local AI, and keeps a
            structured vault of every version — nothing leaves your computer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <PrimaryButton               onClick={()=>setIsPopupOpen(true)}
>
              <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </PrimaryButton>
            <SecondaryButton                 onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
>
              See how it works
              <ArrowRight className="h-4 w-4" />
            </SecondaryButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="acv-mono mt-5 text-[11.5px] uppercase tracking-wide text-[var(--acv-ink-faint)]"
          >
            Free forever · Runs fully offline · Export to PDF
          </motion.p>
        </motion.div>

        <ResumeTicket />
      </div>
      <WaitlistPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </section>
  );
}




