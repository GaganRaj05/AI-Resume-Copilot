import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  Bot,
  Sparkles,
  CheckCircle2,
  Loader2,
  Download,
  ArrowRight,
  Target,
  Search,
  Wand2,
  ListChecks,
  Layers,
  Lock,
  Star,
  ChevronDown,
  Globe,
  MessageCircle,
  Rss,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  Check,
  Minus,
  ShieldCheck,
  Clock,
} from "lucide-react";
import "./Landing.css";

/* ------------------------------------------------------------------ */
/*  Config — edit these to rebrand quickly                             */
/* ------------------------------------------------------------------ */
const BRAND = "AgentCV";
const OS_LABEL = "Windows";

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why Local", href: "#why-local" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
];

const STAT_HIGHLIGHTS = [
  { value: "9", suffix: "am", label: "boards scraped, daily" },
  { value: "0", suffix: "", label: "requests sent off-device" },
  { value: "0", suffix: "/mo", label: "cost, ever" },
  { value: "100", suffix: "%", label: "tailoring done locally" },
];

const STATUS_STEPS = [
  { label: "Reading job post", done: true },
  { label: "Matching your background", done: true },
  { label: "Rewriting bullets", done: false },
];

const TICKER_ITEMS = [
  "Runs 100% Locally",
  "Zero Cloud Bills",
  "Free Forever",
  "Scrapes Jobs Daily at 9am",
  "Your Data Never Leaves Your Machine",
];

const HOW_IT_WORKS = [
  {
    icon: Download,
    title: "Install & connect",
    body: "Download the agent, point it at your resume and career background. Five minutes, once.",
  },
  {
    icon: Search,
    title: "It scrapes job boards",
    body: "Every morning at 9am, or on demand, across whatever boards and search terms you set.",
  },
  {
    icon: Wand2,
    title: "AI tailors it, locally",
    body: "Each match gets a resume rewritten against that exact job description, on your machine.",
  },
  {
    icon: ListChecks,
    title: "Review & apply",
    body: "Open your resume vault, pick the version, export to PDF, apply.",
  },
];

const COMPARISON_ROWS = [
  { label: "Monthly cost", cloud: "$29–99/mo", local: "Free, forever" },
  { label: "Where your data lives", cloud: "Their servers", local: "Your machine only" },
  { label: "Finding new roles", cloud: "You paste them in", local: "Scraped daily at 9am" },
  { label: "Works offline", cloud: false, local: true },
  { label: "Resume history", cloud: "Capped by plan", local: "Unlimited local vault" },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-powered agent",
    body: "Understands your background once, then tailors every match on its own.",
  },
  {
    icon: Target,
    title: "Role-specific tailoring",
    body: "Surfaces the right skills and experience for each posting it finds.",
  },
  {
    icon: Layers,
    title: "Structured resume vault",
    body: "Every version saved and organized by company, ready to export.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your data and API calls never leave your machine — no exceptions.",
  },
];

const REVIEWS = [
  {
    name: "Priya M.",
    role: "Data Analyst",
    quote:
      "I stopped rewriting my resume at midnight. It's ready before I've had coffee, tailored to whatever came in overnight.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Product Designer",
    quote:
      "Nothing leaving my laptop is the actual selling point, not a footnote. It just works quietly in the background.",
    rating: 5,
  },
  {
    name: "Jordan K.",
    role: "DevOps Engineer",
    quote:
      "No dashboard, no login, no monthly bill — just an agent that runs on my schedule.",
    rating: 5,
  },
  {
    name: "Sofia D.",
    role: "UX Researcher",
    quote:
      "The 9am scrape means I open my laptop to resumes already tailored for anything new overnight.",
    rating: 4,
  },
];

const FAQ_ITEMS = [
  {
    q: "Does my data ever leave my computer?",
    a: `No. ${BRAND} runs inference locally — your background, job descriptions, and generated resumes stay on your machine unless you choose to export or share them.`,
  },
  {
    q: "What job boards does the scraper support?",
    a: "You choose which boards and search terms to track from the app's settings. It runs on your schedule — 9am daily by default, or on demand.",
  },
  {
    q: "Do I need my own AI or API key?",
    a: "No — the agent ships with a local model that runs out of the box. You can optionally plug in your own API key for higher-quality output.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There's no subscription. You're running the agent on your own hardware, so there's no server cost to pass on to you.",
  },
  {
    q: "Can I edit a tailored resume before applying?",
    a: "Yes. Every generated version opens in an editable view before export, so you can fine-tune it before it's saved to your vault.",
  },
];

/* ------------------------------------------------------------------ */
/*  Shared building blocks                                             */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ children }) {
  return (
    <span className="acv-chip acv-mono inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--acv-ink-soft)]">
      {children}
    </span>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={
        "acv-shine inline-flex items-center justify-center gap-2 rounded-full bg-[var(--acv-ink)] px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-bg)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acv-ink)] " +
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
    "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--acv-border-strong)] px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-ink)] transition hover:bg-[var(--acv-ink)] hover:text-[var(--acv-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acv-ink)] " +
    className;
  const sharedMotionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 420, damping: 24 },
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
function Reveal({ children, delay = 0, y = 16, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
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
      duration: 1.2,
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

/** Choreographed stagger — parent fades children in one after another as
 *  the group scrolls into view, instead of each card animating on its own. */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/** Hero headline — each line/word flies up and settles in sequence as the
 *  hero scrolls into view, rather than the whole heading fading in at once. */
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

/** Thin reading-progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-[var(--acv-accent)]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="acv-chip relative flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full text-[var(--acv-ink-medium)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute"
          >
            <Moon className="h-4 w-4" strokeWidth={2.25} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute"
          >
            <Sun className="h-4 w-4" strokeWidth={2.25} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MenuToggle({ open, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Toggle menu"
      className="acv-chip relative flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full text-[var(--acv-ink)] lg:hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="absolute"
          >
            <X className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="absolute"
          >
            <Menu className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--acv-accent)]"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-b border-[var(--acv-border-soft)] bg-[var(--acv-bg)] lg:hidden"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col gap-1 px-6 py-4"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.label}
                variants={staggerItem}
                href={link.href}
                onClick={onClose}
                className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-[var(--acv-ink-medium)] transition hover:bg-[var(--acv-bg-flat)] hover:text-[var(--acv-ink)]"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TickerBar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-b border-[var(--acv-border-soft)] bg-[var(--acv-bg-flat)] py-2">
      <div className="acv-ticker-track acv-mono flex w-max items-center gap-8 whitespace-nowrap px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--acv-ink-faint)]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            {item}
            <span className="h-1 w-1 rounded-full bg-[var(--acv-accent)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`acv-nav-surface sticky top-0 z-40 transition-shadow ${
        scrolled ? "is-scrolled shadow-[0_1px_0_var(--acv-border)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acv-ink)]">
            <FileText className="h-4 w-4 text-[var(--acv-bg)]" strokeWidth={2.25} />
          </span>
          <span className="acv-display text-[16px] tracking-tight text-[var(--acv-ink)]">
            {BRAND}
          </span>
        </a>

        <div className="acv-chip hidden items-center gap-1 rounded-full p-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13.5px] font-semibold text-[var(--acv-ink-medium)] transition hover:text-[var(--acv-ink)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <PrimaryButton className="hidden px-5 py-2.5 text-[13px] sm:inline-flex">
            Download
            <ArrowRight className="h-3.5 w-3.5" />
          </PrimaryButton>
          <MenuToggle open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <TickerBar />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

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

function HeroSection() {
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
            <PrimaryButton>
              <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </PrimaryButton>
            <SecondaryButton href="#how-it-works">
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat strip                                                         */
/* ------------------------------------------------------------------ */

function StatStrip() {
  return (
    <div className="border-y border-[var(--acv-border-soft)]">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[var(--acv-border-soft)] px-6 sm:grid-cols-4 lg:px-10">
        {STAT_HIGHLIGHTS.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-4 py-8 text-center sm:px-6 ${i >= 2 ? "border-t sm:border-t-0" : ""} border-[var(--acv-border-soft)]`}
          >
            <p className="acv-display text-[30px] text-[var(--acv-ink)] sm:text-[36px]">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-[var(--acv-ink-soft)]">
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
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

/* ------------------------------------------------------------------ */
/*  Why local — comparison                                             */
/* ------------------------------------------------------------------ */

function ComparisonCell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4" style={{ color: "var(--acv-signal)" }} />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-[var(--acv-ink-faint)]" />;
  }
  return <span>{value}</span>;
}

function WhyLocal() {
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

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */

function FeatureGrid() {
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

/* ------------------------------------------------------------------ */
/*  Reviews                                                             */
/* ------------------------------------------------------------------ */

function ReviewCard({ review }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="acv-panel flex h-full w-[300px] flex-none flex-col rounded-[20px] p-6"
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
            style={{
              color: idx < review.rating ? "var(--acv-accent)" : "var(--acv-border)",
              fill: idx < review.rating ? "var(--acv-accent)" : "transparent",
            }}
          />
        ))}
      </div>
      <p className="mt-3.5 flex-1 text-[13.5px] leading-relaxed text-[var(--acv-ink-medium)]">
        “{review.quote}”
      </p>
      <div className="mt-5">
        <p className="text-[13px] font-semibold text-[var(--acv-ink)]">{review.name}</p>
        <p className="text-[12px] text-[var(--acv-ink-faint)]">{review.role}</p>
      </div>
    </motion.div>
  );
}

function ReviewsSection() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <section id="reviews" className="bg-[var(--acv-bg-flat)] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <SectionEyebrow>Reviews</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
            People stop rewriting resumes
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="acv-marquee-mask relative mt-14 overflow-hidden">
        <div className="acv-review-track flex w-max gap-5 px-6">
          {doubled.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--acv-border-soft)] py-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[15px] font-semibold text-[var(--acv-ink)]">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[var(--acv-border)]"
        >
          <ChevronDown className="h-3.5 w-3.5 text-[var(--acv-ink-soft)]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25 },
            }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pr-10 pt-3 text-[13.5px] leading-relaxed text-[var(--acv-ink-soft)]"
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
              Questions, answered
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-[var(--acv-ink-soft)] lg:mx-0">
              The short version of everything else on this page — data,
              boards, pricing, and how much you can tweak before applying.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="acv-panel rounded-[20px] px-6 sm:px-8">
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
        <div className="acv-ink-block relative overflow-hidden rounded-[28px] border-2 border-[#FF3B1F] px-8 py-16 text-center sm:px-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15">
            <Bot className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h2 className="acv-display relative mt-5 text-[34px] uppercase leading-[0.98] sm:text-[46px]">
            Stop tailoring resumes by hand
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed opacity-70">
            Download the agent, connect your background, and let it work every
            morning while you focus on interviews.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="acv-shine inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-contrast-bg)]"
            >
              <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </motion.button>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[14.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Read the docs
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-[var(--acv-border-soft)]">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 lg:flex-row lg:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--acv-ink)]">
            <FileText className="h-3.5 w-3.5 text-[var(--acv-bg)]" strokeWidth={2.25} />
          </span>
          <p className="acv-display text-[13.5px] tracking-tight text-[var(--acv-ink)]">
            {BRAND}
          </p>
          <span className="text-[12.5px] text-[var(--acv-ink-faint)]">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {[Globe, MessageCircle, Rss, Mail].map((Icon, i) => (
            <a
              key={i}
              href={Icon === Mail ? "mailto:gaganraj.dev05@gmail.com" : "#"}
              className="acv-chip flex h-8 w-8 items-center justify-center rounded-full text-[var(--acv-ink-soft)] transition hover:text-[var(--acv-ink)]"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>

        <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--acv-ink-faint)]">
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--acv-signal)" }} />
          Built local-first. Your data stays yours.
        </p>
      </Reveal>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("acv-theme");
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      // localStorage unavailable (privacy mode, SSR, etc.) — default to light
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem("acv-theme", next);
      } catch {
        // ignore write failures
      }
      return next;
    });
  };

  return (
    <div className={`acv-font min-h-screen bg-[var(--acv-bg)] ${theme === "dark" ? "dark" : ""}`}>
      <ScrollProgress />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <HeroSection />
      <StatStrip />
      <HowItWorks />
      <WhyLocal />
      <FeatureGrid />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}