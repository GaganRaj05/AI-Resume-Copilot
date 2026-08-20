import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import {
  FileText,
  Bot,
  Sparkles,
  CheckCircle2,
  Loader2,
  Download,
  ArrowRight,
  BrainCircuit,
  Target,
  HardDrive,
  FolderKanban,
  Clock,
  ShieldCheck,
  Search,
  Layers,
  Lock,
  AlertTriangle,
  EyeOff,
  Ban,
  Gauge,
  MonitorDown,
  Wand2,
  ListChecks,
  Star,
  Quote,
  ChevronDown,
  Globe,
  MessageCircle,
  Rss,
  Mail,
  X,
  Check,
} from "lucide-react";
import "./landing.css";

/* ------------------------------------------------------------------ */
/*  Config — edit these to rebrand quickly                             */
/* ------------------------------------------------------------------ */
const BRAND = "AgentCV";
const OS_LABEL = "Windows";

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why AgentCV", href: "#why-different" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const HERO_BULLETS = [
  { icon: BrainCircuit, title: "Understands you & the job" },
  { icon: Target, title: "Tailored for every role" },
  { icon: HardDrive, title: "Runs 100% locally" },
  { icon: FolderKanban, title: "Structured resume vault" },
];

const TRUST_ROW = [
  { icon: CheckCircle2, label: "Free Forever" },
  { icon: CheckCircle2, label: "Runs Fully Offline" },
  { icon: CheckCircle2, label: "Export to PDF" },
];

/* Pseudo-logo wall — abstract monogram marks, not real trademarks */
const COMPANIES = [
  { name: "Nimbus Health", mark: "N", color: "#6552E8" },
  { name: "Fintra", mark: "F", color: "#17A34A" },
  { name: "Orbital Labs", mark: "O", color: "#E8895C" },
  { name: "Voxel", mark: "V", color: "#3B82F6" },
  { name: "Redline Studio", mark: "R", color: "#DB4C6B" },
  { name: "Northgate", mark: "N", color: "#0EA5A5" },
  { name: "Cinderbyte", mark: "C", color: "#A855F7" },
  { name: "Fieldstone", mark: "F", color: "#CA8A04" },
];

const STATUS_STEPS = [
  { label: "Analyzing Background", done: true },
  { label: "Scraping Job Boards", done: true },
  { label: "Tailoring Resume", done: true },
  { label: "Generating Resume", done: false },
];

const PROBLEM_POINTS = [
  {
    icon: Clock,
    stat: "10+ hrs",
    statLabel: "lost every week",
    title: "Manually tailoring every resume",
    body: "Rewriting bullet points for each posting turns a job search into a second unpaid job.",
  },
  {
    icon: Ban,
    stat: "75%",
    statLabel: "filtered before a human sees them",
    title: "Rejected by ATS bots",
    body: "Generic, one-size-fits-all resumes get screened out long before a recruiter opens them.",
  },
  {
    icon: EyeOff,
    stat: "Hours late",
    statLabel: "to every good posting",
    title: "Job posts you never see",
    body: "By the time you remember to check the boards manually, the best roles are already buried.",
  },
  {
    icon: AlertTriangle,
    stat: "$29–99/mo",
    statLabel: "for a cloud subscription",
    title: "Tools that bill you monthly",
    body: "Most \u201cAI resume\u201d products are SaaS wrappers that store your data on someone else's server.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: MonitorDown,
    title: "Install & connect",
    body: "Download the agent and point it at your resume and career background once.",
  },
  {
    icon: Search,
    title: "Agent scrapes job boards",
    body: "Runs automatically every day at 9am — or on demand — across the boards you choose.",
  },
  {
    icon: Wand2,
    title: "AI tailors it, locally",
    body: "Each match gets a resume rewritten and optimized against that exact job description, on your machine.",
  },
  {
    icon: ListChecks,
    title: "Review & apply",
    body: "Browse your structured resume vault, pick the version, export to PDF, and apply.",
  },
];

const COMPARISON_ROWS = [
  { label: "Monthly subscription", cloud: "$29–99/mo", local: "Free, forever" },
  { label: "Where your data lives", cloud: "Their servers", local: "Your machine, only" },
  { label: "Job discovery", cloud: "Paste manually", local: "Auto-scraped daily" },
  { label: "Works without internet", cloud: false, local: true },
  { label: "Resume history", cloud: "Capped by plan", local: "Unlimited local vault" },
];

const FEATURE_STRIP = [
  { icon: Sparkles, title: "AI-Powered Agent", body: "Works independently to understand your background and tailor your resume." },
  { icon: Search, title: "Local Job Scraper", body: "Checks job boards every day at 9am, or on demand whenever you trigger it." },
  { icon: Target, title: "Role-Specific Tailoring", body: "Highlights the right skills and experience for every job it finds." },
  { icon: Layers, title: "Structured Resume Vault", body: "Every tailored version saved and organized by role, ready to export." },
  { icon: Lock, title: "Private by Design", body: "Your data and API calls never leave your machine." },
];

const REVIEWS = [
  {
    name: "Priya M.",
    role: "Data Analyst, job-searching",
    quote: "I stopped rewriting my resume at midnight. The agent has it ready before I've had coffee, tailored to whatever came in overnight.",
    rating: 5,
    color: "#6552E8",
  },
  {
    name: "Marcus T.",
    role: "Product Designer",
    quote: "The fact that nothing leaves my laptop is the actual selling point for me, not just a footnote. It just works quietly in the background.",
    rating: 5,
    color: "#17A34A",
  },
  {
    name: "Elena R.",
    role: "Backend Engineer",
    quote: "Went from applying to 3 roles a week to having a tailored, ready resume for every relevant posting the agent finds. No more copy-paste fatigue.",
    rating: 4,
    color: "#E8895C",
  },
];

const FAQ_ITEMS = [
  {
    q: "Does my data ever leave my computer?",
    a: `No. ${BRAND} runs inference locally — your background, job descriptions, and generated resumes stay on your machine unless you explicitly choose to export or share them.`,
  },
  {
    q: "What job boards does the scraper support?",
    a: "You choose which boards and search terms to track from the app's settings. The scraper runs on your schedule — 9am daily by default, or on demand.",
  },
  {
    q: "Do I need my own AI or API key?",
    a: "No — the agent ships with a local model that runs out of the box. If you'd rather use a hosted model for higher-quality output, you can optionally plug in your own API key.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There's no subscription. You're running the agent on your own hardware, so there's no server cost for us to pass on to you.",
  },
  {
    q: "What if I'm not on Windows?",
    a: "The current release is Windows-only. macOS and Linux builds are on the roadmap — join the mailing list from the footer to get notified.",
  },
  {
    q: "Can I edit a tailored resume before applying?",
    a: "Yes. Every generated version opens in an editable view before export, so you can fine-tune wording or formatting before it's saved to your vault.",
  },
];

/* ------------------------------------------------------------------ */
/*  Shared building blocks                                             */
/* ------------------------------------------------------------------ */

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E4F8EA] px-4 py-1.5 text-[13px] font-medium text-[#128238]">
      {children}
    </span>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#6552E8]">
      {children}
    </p>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#17A34A] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(23,163,74,0.55)] transition-colors hover:bg-[#128238] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17A34A] " +
        className
      }
      {...props}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, className = "", href, ...props }) {
  const sharedClassName =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1DFF3] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#14142B] transition-colors hover:border-[#C9C4EE] hover:bg-[#F9F8FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6552E8] " +
    className;
  const sharedMotionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.a href={href} className={sharedClassName} {...sharedMotionProps} {...props}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={sharedClassName} {...sharedMotionProps} {...props}>
      {children}
    </motion.button>
  );
}

/** Reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, y = 18, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Animated count-up, plays once when scrolled into view */
function CountUp({ value, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState("0");
  const numeric = parseFloat(String(value).replace(/[^\d.]/g, "")) || 0;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplay(Number.isInteger(numeric) ? Math.round(v).toString() : v.toFixed(1));
      },
    });
    return () => controls.stop();
  }, [inView, numeric]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ECEAF8] bg-[#F6F5FC]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1] shadow-md">
            <FileText className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="acv-display text-[15px] font-bold text-[#14142B]">{BRAND}</p>
            <p className="text-[11.5px] font-semibold text-[#6552E8]">Local Resume Agent</p>
          </div>
        </div>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-[#3F3D56] transition hover:text-[#14142B]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <PrimaryButton className="px-5 py-2.5 text-[13.5px]">
          <Download className="h-4 w-4" strokeWidth={2.5} />
          Download for {OS_LABEL}
        </PrimaryButton>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero copy (left column) — compact                                  */
/* ------------------------------------------------------------------ */

function HeroCopy() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Pill>
          <Sparkles className="h-3.5 w-3.5" />
          Local-First · Autonomous · Free Forever
        </Pill>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="acv-display mt-5 text-[38px] font-bold leading-[1.1] tracking-tight text-[#14142B] sm:text-[44px]"
      >
        Your AI Agent.
        <br />
        Runs on{" "}
        <span className="bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
          Your Machine.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.16 }}
        className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[#5B5B76]"
      >
        Download the agent, connect your background once. It scrapes job
        boards every morning at 9am, tailors your resume with local AI, and
        builds a structured library of every version — nothing leaves your
        computer.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.26 }}
        className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5"
      >
        {HERO_BULLETS.map((item) => (
          <div key={item.title} className="flex items-center gap-2">
            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#EDEBFC]">
              <item.icon className="h-3.5 w-3.5 text-[#6552E8]" strokeWidth={2.25} />
            </div>
            <p className="text-[13px] font-semibold text-[#14142B]">{item.title}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34 }}
        className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <PrimaryButton>
          <Download className="h-4.5 w-4.5" strokeWidth={2.5} />
          Download for {OS_LABEL}
        </PrimaryButton>
        <SecondaryButton href="#how-it-works">
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
          <div key={item.label} className="flex items-center gap-1.5 text-[13px] font-medium text-[#5B5B76]">
            <item.icon className="h-4 w-4 text-[#17A34A]" />
            {item.label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero visual (right column) — compact two-row composition           */
/* ------------------------------------------------------------------ */

function InputCard({ iconBg, chipIcon: ChipIcon, title, chipLabel, buttonLabel, buttonColor, footnote }) {
  return (
    <div className="w-full max-w-[168px] rounded-xl border border-[#ECEAF8] bg-white p-3 shadow-[0_8px_20px_-12px_rgba(20,20,43,0.18)]">
      <p className="text-[11.5px] font-semibold text-[#14142B]">{title}</p>
      <div className="mt-2 flex items-center gap-1.5 rounded-md bg-[#F7F6FC] px-2 py-1.5">
        <div className={`flex h-5 w-5 flex-none items-center justify-center rounded ${iconBg}`}>
          <ChipIcon className="h-3 w-3 text-white" strokeWidth={2.5} />
        </div>
        <span className="truncate text-[10.5px] font-medium text-[#3F3D56]">{chipLabel}</span>
      </div>
      <button
        className="mt-2 w-full rounded-md px-2.5 py-1.5 text-[10.5px] font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonLabel}
      </button>
      {footnote && (
        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#8B899E]">
          <Clock className="h-2.5 w-2.5" />
          {footnote}
        </p>
      )}
    </div>
  );
}

function StatusList() {
  return (
    <div className="flex w-full max-w-[168px] flex-col gap-1.5">
      {STATUS_STEPS.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          className="flex items-center justify-between gap-2 rounded-lg border border-[#ECEAF8] bg-white px-2.5 py-2 shadow-[0_4px_12px_-8px_rgba(20,20,43,0.2)]"
        >
          <span className="text-[10.5px] font-medium text-[#3F3D56]">{step.label}</span>
          {step.done ? (
            <CheckCircle2 className="h-3.5 w-3.5 flex-none text-[#17A34A]" />
          ) : (
            <Loader2 className="acv-spin h-3.5 w-3.5 flex-none text-[#6552E8]" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function AgentNode() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="acv-glow-pulse flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E4F8EA] to-white ring-1 ring-[#CDEFDA]">
        <Bot className="h-6 w-6 text-[#17A34A]" strokeWidth={1.75} />
      </div>
      <p className="flex items-center gap-1 text-[11px] font-semibold text-[#14142B]">
        <Sparkles className="h-3 w-3 text-[#6552E8]" />
        AI Agent
      </p>
    </div>
  );
}

function OutputResumeCard() {
  return (
    <div className="relative w-full max-w-[240px] rounded-xl border border-[#ECEAF8] bg-white p-4 shadow-[0_16px_36px_-16px_rgba(20,20,43,0.28)]">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="acv-float absolute -top-4 right-2"
      >
        <Pill>
          <Sparkles className="h-3 w-3" />
          Ready
        </Pill>
      </motion.div>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 flex-none rounded-full bg-gradient-to-br from-[#C9C4EE] to-[#6552E8]" />
        <div>
          <p className="text-[12.5px] font-bold text-[#14142B]">Alex Johnson</p>
          <p className="text-[10.5px] text-[#8B899E]">Product Manager</p>
        </div>
      </div>

      <p className="mt-3 text-[9px] font-bold tracking-wide text-[#8B899E]">PROFESSIONAL SUMMARY</p>
      <p className="mt-1 text-[10px] leading-relaxed text-[#3F3D56]">
        PM with 6+ years building user-centric products that drive growth,
        leading cross-functional teams end to end.
      </p>

      <p className="mt-2.5 text-[9px] font-bold tracking-wide text-[#8B899E]">SKILLS</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {["Strategy", "Data Analysis", "Roadmapping", "SQL"].map((skill) => (
          <span key={skill} className="rounded-md bg-[#F7F6FC] px-1.5 py-0.5 text-[9px] font-medium text-[#5B5B76]">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function StoredResumeThumbs() {
  return (
    <div className="mt-3 flex max-w-[240px] gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`relative h-12 w-10 flex-none rounded-md border bg-white p-1 ${
            i === 1 ? "border-2 border-[#6552E8]" : "border-[#ECEAF8]"
          }`}
        >
          <div className="h-1 w-4 rounded-sm bg-[#E1DFF3]" />
          <div className="mt-1 space-y-0.5">
            <div className="h-0.5 w-full rounded-sm bg-[#F0EFF8]" />
            <div className="h-0.5 w-full rounded-sm bg-[#F0EFF8]" />
          </div>
          {i === 1 && (
            <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#6552E8]">
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
    <svg width="36" height="24" viewBox="0 0 36 24" className="hidden flex-none text-[#C9C4EE] sm:block">
      <line
        x1="2" y1="12" x2="30" y2="12"
        stroke="currentColor" strokeWidth="2"
        className="acv-dash-path"
      />
      <path d="M24 6 L32 12 L24 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroVisual() {
  return (
    <div className="rounded-[24px] border border-[#ECEAF8] bg-white/60 p-4 sm:p-6">
      {/* Row 1 — inputs -> agent -> status */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
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
      <div className="mt-5 flex flex-col items-center border-t border-dashed border-[#E1DFF3] pt-5">
        <OutputResumeCard />
        <StoredResumeThumbs />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trusted-by logo wall                                               */
/* ------------------------------------------------------------------ */

function LogoMark({ name, mark, color }) {
  return (
    <div className="flex flex-none items-center gap-2 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {mark}
      </div>
      <span className="acv-display whitespace-nowrap text-[15px] font-semibold text-[#3F3D56]">{name}</span>
    </div>
  );
}

function TrustLogos() {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <div className="border-y border-[#ECEAF8] bg-[#F6F5FC] py-10">
      <Reveal>
        <p className="text-center text-[13px] font-medium text-[#8B899E]">
          Trusted by job seekers who&apos;ve landed offers at companies like
        </p>
      </Reveal>
      <div className="relative mx-auto mt-6 max-w-6xl overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F6F5FC] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F6F5FC] to-transparent" />
        <div className="acv-marquee-track flex w-max gap-12 px-4">
          {doubled.map((company, i) => (
            <LogoMark key={`${company.name}-${i}`} {...company} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The Problem                                                        */
/* ------------------------------------------------------------------ */

function ProblemSection() {
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
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-full rounded-2xl border border-[#ECEAF8] bg-white p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDEEEA]">
                <point.icon className="h-5 w-5 text-[#E8895C]" strokeWidth={2} />
              </div>
              <p className="acv-display mt-4 text-[24px] font-bold text-[#14142B]">
                <CountUp value={point.stat} />
              </p>
              <p className="text-[11.5px] font-medium text-[#8B899E]">{point.statLabel}</p>
              <p className="mt-3 text-[14px] font-bold text-[#14142B]">{point.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5B5B76]">{point.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How it Works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How It Works</SectionEyebrow>
          <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
            Set it up once. It runs every morning.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-start">
                <div className="acv-display flex h-11 w-11 items-center justify-center rounded-full bg-[#14142B] text-[15px] font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDEBFC]">
                  <step.icon className="h-5 w-5 text-[#6552E8]" strokeWidth={2} />
                </div>
                <p className="mt-4 text-[15.5px] font-bold text-[#14142B]">{step.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5B5B76]">{step.body}</p>
              </div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="absolute right-[-18px] top-[22px] hidden h-px w-9 border-t-2 border-dashed border-[#E1DFF3] lg:block" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why It's Different                                                 */
/* ------------------------------------------------------------------ */

function WhyDifferent() {
  return (
    <section id="why-different" className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>Why It&apos;s Different</SectionEyebrow>
        <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
          Not another cloud subscription
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[#5B5B76]">
          {BRAND} is an agent you run, not a service you rent.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-2xl border border-[#ECEAF8] bg-white">
        <div className="grid grid-cols-3 border-b border-[#ECEAF8] bg-[#F9F8FE] text-[13px] font-bold text-[#14142B]">
          <div className="px-5 py-4">&nbsp;</div>
          <div className="border-l border-[#ECEAF8] px-5 py-4 text-center text-[#8B899E]">Typical Cloud Tools</div>
          <div className="acv-display flex items-center justify-center gap-1.5 border-l border-[#ECEAF8] bg-[#EDEBFC] px-5 py-4 text-center text-[#6552E8]">
            <Bot className="h-4 w-4" />
            {BRAND}
          </div>
        </div>
        {COMPARISON_ROWS.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 text-[13.5px] ${i !== COMPARISON_ROWS.length - 1 ? "border-b border-[#F0EFF8]" : ""}`}
          >
            <div className="px-5 py-4 font-medium text-[#3F3D56]">{row.label}</div>
            <div className="flex items-center justify-center border-l border-[#F0EFF8] px-5 py-4 text-center text-[#8B899E]">
              {typeof row.cloud === "boolean" ? (
                row.cloud ? <Check className="h-4 w-4 text-[#8B899E]" /> : <X className="h-4 w-4 text-[#D1487A]" />
              ) : (
                row.cloud
              )}
            </div>
            <div className="flex items-center justify-center border-l border-[#F0EFF8] bg-[#FAFAFE] px-5 py-4 text-center font-semibold text-[#128238]">
              {typeof row.local === "boolean" ? (
                row.local ? <Check className="h-4 w-4 text-[#17A34A]" /> : <X className="h-4 w-4 text-[#D1487A]" />
              ) : (
                row.local
              )}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom feature strip                                               */
/* ------------------------------------------------------------------ */

function FeatureStrip() {
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

/* ------------------------------------------------------------------ */
/*  Reviews                                                             */
/* ------------------------------------------------------------------ */

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "fill-[#F5A623] text-[#F5A623]" : "text-[#E1DFF3]"}`}
        />
      ))}
    </div>
  );
}

function ReviewsSection() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionEyebrow>Reviews</SectionEyebrow>
        <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
          Job seekers, not marketers
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <Reveal key={review.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-full flex-col rounded-2xl border border-[#ECEAF8] bg-white p-6"
            >
              <Quote className="h-6 w-6 text-[#E1DFF3]" strokeWidth={2.5} />
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#3F3D56]">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: review.color }}
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-[#14142B]">{review.name}</p>
                  <p className="text-[11.5px] text-[#8B899E]">{review.role}</p>
                </div>
                <div className="ml-auto">
                  <Stars count={review.rating} />
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ (animated accordion)                                           */
/* ------------------------------------------------------------------ */

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#ECEAF8] py-5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold text-[#14142B]">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#F7F6FC]"
        >
          <ChevronDown className="h-4 w-4 text-[#6552E8]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[13.5px] leading-relaxed text-[#5B5B76]">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="acv-display mt-3 text-[32px] font-bold leading-tight text-[#14142B] sm:text-[38px]">
            Questions, answered
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#14142B] to-[#2A2456] px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6552E8] opacity-30 blur-3xl" />
          <Gauge className="mx-auto h-9 w-9 text-[#8B78F0]" strokeWidth={1.75} />
          <h2 className="acv-display relative mt-4 text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            Stop tailoring resumes by hand
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#C9C4EE]">
            Download the agent, connect your background, and let it work
            every morning while you focus on interviews.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton>
              <Download className="h-4.5 w-4.5" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </PrimaryButton>
            <SecondaryButton className="border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10">
              Read the Docs
              <ArrowRight className="h-4 w-4" />
            </SecondaryButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Download", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-[#ECEAF8] bg-[#F6F5FC]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1]">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.25} />
              </div>
              <p className="acv-display text-[15px] font-bold text-[#14142B]">{BRAND}</p>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-[#5B5B76]">
              A local, autonomous resume agent. Runs on your machine, scrapes
              jobs daily, tailors your resume — no cloud, no subscription.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Globe, MessageCircle, Rss, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E1DFF3] text-[#5B5B76] transition hover:border-[#6552E8] hover:text-[#6552E8]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12.5px] font-bold uppercase tracking-wide text-[#8B899E]">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[13.5px] font-medium text-[#3F3D56] transition hover:text-[#6552E8]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#ECEAF8] pt-6 sm:flex-row">
          <p className="text-[12.5px] text-[#8B899E]">© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-[#8B899E]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#17A34A]" />
            Built local-first. Your data stays yours.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="acv-font min-h-screen bg-[#F6F5FC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-10 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <HeroCopy />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </main>

      <TrustLogos />
      <ProblemSection />
      <HowItWorks />
      <WhyDifferent />
      <FeatureStrip />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}