import {useState} from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, Bot, CheckCircle2, Loader2, Clock,
  ArrowRight, Download
} from 'lucide-react';
import { Pill, PrimaryButton, SecondaryButton, Reveal, CountUp } from '../ui';
import { BRAND, OS_LABEL, HERO_BULLETS, TRUST_ROW, STATUS_STEPS } from '../config/landingConfig';
import WaitlistPopup from './forms/WaitListPopUp';
// Hero Copy Component
function HeroCopy() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Pill>
          <Sparkles className="h-3.5 w-3.5" />
          Local-First · Autonomous · Free Forever
        </Pill>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="acv-display mt-5 text-[38px] font-bold leading-[1.1] tracking-tight text-[var(--acv-ink)] sm:text-[44px]"
      >
        Your AI Agent.
        <br />
        Runs on{" "}
        <span className="acv-serif bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
          Your Machine.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.16 }}
        className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[var(--acv-ink-soft)]"
      >
        Download the agent, connect your background once. It scrapes job boards
        every morning at 9am, tailors your resume with local AI, and builds a
        structured library of every version — nothing leaves your computer.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.26 }}
        className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5"
      >
        {HERO_BULLETS.map((item) => (
          <div key={item.title} className="flex items-center gap-2">
            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#6552E8]/12">
              <item.icon
                className="h-3.5 w-3.5 text-[#6552E8]"
                strokeWidth={2.25}
              />
            </div>
            <p className="text-[13px] font-semibold text-[var(--acv-ink)]">
              {item.title}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34 }}
        className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <PrimaryButton onClick={()=>setIsPopupOpen(true)}>
          <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Download for {OS_LABEL}
        </PrimaryButton >
        <SecondaryButton href="#how-it-works" onClick={()=>setIsPopupOpen(true)}>
          See How It Works
          <ArrowRight className="h-4 w-4" />
        </SecondaryButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2"
      >
        {TRUST_ROW.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--acv-ink-soft)]"
          >
            <item.icon className="h-4 w-4 text-[#17A34A]" />
            {item.label}
          </div>
        ))}
      </motion.div>
      <WaitlistPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </div>
  );
}

// Hero Visual Components
function HudFrame({ className = "" }) {
  /* Four corner brackets — the "targeting reticle" framing device */
  const corner = "absolute h-3 w-3 border-[#8B78F0]";
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

function InputCard({
  iconBg,
  chipIcon: ChipIcon,
  title,
  chipLabel,
  buttonLabel,
  buttonColor,
  footnote,
}) {
  return (
    <div className="acv-mono w-full max-w-[168px] rounded-lg border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9D96D9]">
        {title}
      </p>
      <div className="mt-2 flex items-center gap-1.5 rounded-md border border-white/5 bg-black/20 px-2 py-1.5">
        <div
          className={`flex h-5 w-5 flex-none items-center justify-center rounded ${iconBg}`}
        >
          <ChipIcon className="h-3 w-3 text-white" strokeWidth={2.5} />
        </div>
        <span className="truncate text-[10px] text-[#D8D5F0]">{chipLabel}</span>
      </div>
      <button
        className="mt-2 w-full rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
        style={{
          backgroundColor: buttonColor,
          boxShadow: `0 0 16px -4px ${buttonColor}`,
        }}
      >
        {buttonLabel}
      </button>
      {footnote && (
        <p className="mt-1.5 flex items-center gap-1 text-[9.5px] text-[#726CAA]">
          <Clock className="h-2.5 w-2.5" />
          {footnote}
        </p>
      )}
    </div>
  );
}

function StatusList() {
  return (
    <div className="acv-mono flex w-full max-w-[172px] flex-col gap-1.5">
      {STATUS_STEPS.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-2 ${
            step.done
              ? "border-[#2A5A3E] bg-[#12271B]"
              : "border-[#3B2E7A] bg-[#1A1440]"
          }`}
        >
          <span
            className={`text-[9.5px] uppercase tracking-wide ${step.done ? "text-[#7FD9A4]" : "text-[#B8AFF0]"}`}
          >
            {step.label}
            {!step.done && <span className="acv-blink">_</span>}
          </span>
          {step.done ? (
            <CheckCircle2 className="h-3.5 w-3.5 flex-none text-[#34D399]" />
          ) : (
            <Loader2 className="acv-spin h-3.5 w-3.5 flex-none text-[#8B78F0]" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function AgentNode() {
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="relative flex h-[76px] w-[76px] items-center justify-center">
        {/* Rotating dashed rings */}
        <div className="acv-orbit-slow absolute inset-0 rounded-full border border-dashed border-[#8B78F0]/40" />
        <div className="acv-orbit-fast absolute inset-[8px] rounded-full border border-dashed border-[#34D399]/30" />
        {/* Orbiting particles */}
        <div className="acv-orbit-slow absolute inset-0">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#8B78F0] shadow-[0_0_8px_2px_rgba(139,120,240,0.7)]" />
        </div>
        <div
          className="acv-orbit-fast absolute inset-[8px]"
          style={{ animationDirection: "reverse" }}
        >
          <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-[#34D399] shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
        </div>
        {/* Core */}
        <div className="acv-glow-pulse-dark flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2A2456] to-[#12102B] ring-1 ring-[#8B78F0]/50">
          <Bot className="h-5 w-5 text-[#B8AFF0]" strokeWidth={1.75} />
        </div>
      </div>
      <p className="acv-mono flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#D8D5F0]">
        <Sparkles className="h-3 w-3 text-[#8B78F0]" />
        Agent Core
      </p>
    </div>
  );
}
function OutputResumeCard() {
  return (
    <div className="relative w-full max-w-[240px] rounded-lg bg-white p-4 shadow-[0_0_0_1px_rgba(139,120,240,0.5),0_20px_45px_-16px_rgba(139,120,240,0.55)]">
      <HudFrame className="-inset-2" />
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="acv-float absolute -top-4 right-2"
      >
        <span className="acv-mono inline-flex items-center gap-1.5 rounded-full bg-[#12271B] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#34D399] shadow-[0_0_16px_-2px_rgba(52,211,153,0.6)]">
          <Sparkles className="h-3 w-3" />
          Ready
        </span>
      </motion.div>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 flex-none rounded-full bg-gradient-to-br from-[#C9C4EE] to-[#6552E8]" />
        <div>
          <p className="text-[12.5px] font-bold text-[#14142B]">Alex Johnson</p>
          <p className="text-[10.5px] text-[#8B899E]">Product Manager</p>
        </div>
      </div>

      <p className="mt-3 text-[9px] font-bold tracking-wide text-[#8B899E]">
        PROFESSIONAL SUMMARY
      </p>
      <p className="mt-1 text-[10px] leading-relaxed text-[#3F3D56]">
        PM with 6+ years building user-centric products that drive growth,
        leading cross-functional teams end to end.
      </p>

      <p className="mt-2.5 text-[9px] font-bold tracking-wide text-[#8B899E]">
        SKILLS
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {["Strategy", "Data Analysis", "Roadmapping", "SQL"].map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-[#F7F6FC] px-1.5 py-0.5 text-[9px] font-medium text-[#5B5B76]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function StoredResumeThumbs() {
  return (
    <div className="mt-4 flex max-w-[240px] gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`relative h-12 w-10 flex-none rounded-md border bg-white/95 p-1 ${
            i === 1
              ? "border-2 border-[#8B78F0] shadow-[0_0_10px_-1px_rgba(139,120,240,0.7)]"
              : "border-white/10"
          }`}
        >
          <div className="h-1 w-4 rounded-sm bg-[#E1DFF3]" />
          <div className="mt-1 space-y-0.5">
            <div className="h-0.5 w-full rounded-sm bg-[#F0EFF8]" />
            <div className="h-0.5 w-full rounded-sm bg-[#F0EFF8]" />
          </div>
          {i === 1 && (
            <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#8B78F0]">
              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FlowArrow() {
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 0 36 24"
      className="hidden flex-none sm:block"
    >
      <defs>
        <linearGradient id="acv-flow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B78F0" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <line
        x1="2"
        y1="12"
        x2="30"
        y2="12"
        stroke="url(#acv-flow-grad)"
        strokeWidth="2"
        className="acv-dash-path"
      />
      <path
        d="M24 6 L32 12 L24 18"
        fill="none"
        stroke="#34D399"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

 function HeroVisual() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#3B2E7A]/60 bg-gradient-to-br from-[#0B0B1F] via-[#12102B] to-[#1A1440] p-4 shadow-[0_30px_60px_-25px_rgba(101,82,232,0.45)] sm:p-6">
      {/* Ambient grid + glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,120,240,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,120,240,0.5) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#6552E8] opacity-30 blur-3xl" />
      <div className="acv-scanline pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#8B78F0]/10 to-transparent" />

      {/* Status chrome */}
      <div className="acv-mono relative mb-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#726CAA]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399]" />
          Agent Online
        </span>
        <span>Local Runtime · No Network</span>
      </div>

      {/* Row 1 — inputs -> agent -> status */}
      <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
        <div className="flex flex-col items-center gap-3">
          <InputCard
            iconBg="bg-[#17A34A]"
            chipIcon={FileText}
            title="Your Background"
            chipLabel="profile.json"
            buttonLabel="Upload"
            buttonColor="#17A34A"
          />
          <InputCard
            iconBg="bg-[#6552E8]"
            chipIcon={FileText}
            title="Job Description"
            chipLabel="Senior Product Manager"
            buttonLabel="Auto-Scraped"
            buttonColor="#6552E8"
            footnote="Refreshed daily 9am"
          />
        </div>

        <FlowArrow />
        <AgentNode />
        <FlowArrow />

        <StatusList />
      </div>

      {/* Row 2 — output */}
      <div className="relative mt-5 flex flex-col items-center border-t border-dashed border-white/10 pt-6">
        <OutputResumeCard />
        <StoredResumeThumbs />
      </div>
    </div>
  );
}

export {HeroVisual, HeroCopy}