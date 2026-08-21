import {
  FileText, Bot, Sparkles, CheckCircle2, BrainCircuit, Target,
  HardDrive, FolderKanban, Clock, ShieldCheck, Search, Layers,
  Lock, EyeOff, Ban, AlertTriangle, Gauge, MonitorDown, Wand2,
  ListChecks, Cloud, Diamond, Orbit, Hexagon, Flame, Compass,
  Anchor, Mountain, Zap, Feather, Quote
} from "lucide-react";

export const BRAND = "AgentCV";
export const OS_LABEL = "Windows";

export const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why AgentCV", href: "#why-different" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export const HERO_BULLETS = [
  { icon: BrainCircuit, title: "Understands you & the job" },
  { icon: Target, title: "Tailored for every role" },
  { icon: HardDrive, title: "Runs 100% locally" },
  { icon: FolderKanban, title: "Structured resume vault" },
];

export const TRUST_ROW = [
  { icon: CheckCircle2, label: "Free Forever" },
  { icon: CheckCircle2, label: "Runs Fully Offline" },
  { icon: CheckCircle2, label: "Export to PDF" },
];

export const COMPANIES = [
  { name: "Nimbus Health", icon: Cloud, color: "#6552E8" },
  { name: "Fintra", icon: Diamond, color: "#17A34A" },
  { name: "Orbital Labs", icon: Orbit, color: "#E8895C" },
  { name: "Voxel", icon: Hexagon, color: "#3B82F6" },
  { name: "Redline Studio", icon: Flame, color: "#DB4C6B" },
  { name: "Northgate", icon: Compass, color: "#0EA5A5" },
  { name: "Cinderbyte", icon: Zap, color: "#A855F7" },
  { name: "Fieldstone", icon: Mountain, color: "#CA8A04" },
  { name: "Anchorwell", icon: Anchor, color: "#2563EB" },
  { name: "Featherlight", icon: Feather, color: "#DB2777" },
];

export const STATUS_STEPS = [
  { label: "Analyzing Background", done: true },
  { label: "Scraping Job Boards", done: true },
  { label: "Tailoring Resume", done: true },
  { label: "Generating Resume", done: false },
];

export const PROBLEM_POINTS = [
  {
    icon: Clock,
    accent: "#6552E8",
    accentSoft: "#EDEBFC",
    stat: "10",
    statSuffix: "+ hrs",
    statLabel: "gone every week, rewriting the same resume",
    title: "Tailoring is a second job",
    body: "Every posting means re-reading a JD, rewriting bullets, and re-checking formatting — before you've even applied.",
  },
  {
    icon: Ban,
    accent: "#D1487A",
    accentSoft: "#FCE9EF",
    stat: "75",
    statSuffix: "%",
    statLabel: "of resumes never reach a human",
    title: "Filtered out by ATS bots",
    body: "A generic, one-size-fits-all resume gets screened out by keyword-matching software before a recruiter opens it.",
  },
  {
    icon: EyeOff,
    accent: "#CA8A04",
    accentSoft: "#FBF1DA",
    stat: "0",
    statSuffix: " min",
    statLabel: "spent watching boards while you sleep",
    title: "The best posts fill up first",
    body: "Manual searching means checking boards on your schedule, not the market's — the strongest matches disappear fast.",
  },
  {
    icon: AlertTriangle,
    accent: "#17A34A",
    accentSoft: "#E4F8EA",
    stat: "29",
    statSuffix: "–99/mo",
    statLabel: "for a subscription you're renting",
    title: "Cloud tools bill you monthly",
    body: "Most \"AI resume\" products are SaaS wrappers that store your data on someone else's server and charge for the privilege.",
  },
];

export const HOW_IT_WORKS = [
  {
    icon: MonitorDown,
    accent: "#6552E8",
    title: "Install & connect",
    body: "Download the agent and point it at your resume and career background — a one-time, five-minute setup.",
  },
  {
    icon: Search,
    accent: "#3B82F6",
    title: "Agent scrapes job boards",
    body: "Runs automatically every day at 9am — or on demand — across the boards and search terms you choose.",
  },
  {
    icon: Wand2,
    accent: "#17A34A",
    title: "AI tailors it, locally",
    body: "Every match gets a resume rewritten and optimized against that exact job description, on your machine.",
  },
  {
    icon: ListChecks,
    accent: "#CA8A04",
    title: "Review & apply",
    body: "Browse your structured resume vault, pick the version, export to PDF, and apply with confidence.",
  },
];

export const COMPARISON_ROWS = [
  { label: "Monthly subscription", cloud: "$29–99/mo", local: "Free, forever" },
  { label: "Where your data lives", cloud: "Their servers", local: "Your machine, only" },
  { label: "Job discovery", cloud: "Paste manually", local: "Auto-scraped daily" },
  { label: "Works without internet", cloud: false, local: true },
  { label: "Resume history", cloud: "Capped by plan", local: "Unlimited local vault" },
];

export const FEATURE_STRIP = [
  { icon: Sparkles, title: "AI-Powered Agent", body: "Works independently to understand your background and tailor your resume." },
  { icon: Search, title: "Local Job Scraper", body: "Checks job boards every day at 9am, or on demand whenever you trigger it." },
  { icon: Target, title: "Role-Specific Tailoring", body: "Highlights the right skills and experience for every job it finds." },
  { icon: Layers, title: "Structured Resume Vault", body: "Every tailored version saved and organized by role, ready to export." },
  { icon: Lock, title: "Private by Design", body: "Your data and API calls never leave your machine." },
];

export const REVIEWS = [
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
  {
    name: "Jordan K.",
    role: "DevOps Engineer",
    quote: "I was skeptical of another 'AI resume tool' until I realized this one has no dashboard, no login, no monthly bill — just an exe that runs on my schedule.",
    rating: 5,
    color: "#3B82F6",
  },
  {
    name: "Sofia D.",
    role: "UX Researcher",
    quote: "The 9am scrape means I open my laptop to resumes already tailored for anything new overnight. It changed how I think about job hunting.",
    rating: 5,
    color: "#DB4C6B",
  },
  {
    name: "Tomás A.",
    role: "Machine Learning Engineer",
    quote: "Being able to see exactly what changed between versions in the resume vault is what sold me — nothing feels like a black box.",
    rating: 4,
    color: "#CA8A04",
  },
];

export const FAQ_ITEMS = [
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

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Download", action: "popup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Documentation", action: "popup" },
      { label: "Changelog", action: "popup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", action: "#features" },
      { label: "Contact", action: "popup" },
      { label: "Privacy", action: "popup" },
    ],
  },
];