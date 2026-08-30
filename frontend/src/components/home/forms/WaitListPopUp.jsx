import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import "../../../Landing.css"; // adjust path — should point at the same Landing.css used by LandingPage.jsx

const WaitlistPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  // Read theme independently (localStorage, falling back to system
  // preference) so the popup stays in sync with the rest of the site
  // without needing a prop from the parent. Re-checked every time the
  // popup opens, plus on cross-tab storage changes and OS-level scheme
  // changes.
  useEffect(() => {
    const readTheme = () => {
      try {
        const stored = window.localStorage.getItem("acv-theme");
        if (stored === "dark" || stored === "light") {
          setTheme(stored);
          return;
        }
      } catch {
        // localStorage unavailable — fall through to system preference
      }
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    };

    readTheme();

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    window.addEventListener("storage", readTheme);
    media?.addEventListener?.("change", readTheme);

    return () => {
      window.removeEventListener("storage", readTheme);
      media?.removeEventListener?.("change", readTheme);
    };
  }, [isOpen]);

  // Reset state when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setError("");
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.25 } },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.25 } },
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20, scale: 0.97 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, x: -20, scale: 0.97, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`acv-font fixed inset-0 z-50 flex items-center justify-center p-4 ${
          theme === "dark" ? "dark" : ""
        }`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        style={{ background: "rgba(10, 10, 11, 0.6)" }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="acv-dotgrid relative overflow-hidden rounded-[20px] border border-[var(--acv-border-soft)] bg-[var(--acv-surface)] shadow-[var(--acv-shadow-pop)]">
            {/* Close button — same flat circular chip as the nav's theme toggle */}
            <button
              onClick={onClose}
              className="acv-chip absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--acv-ink-soft)] transition hover:text-[var(--acv-ink)]"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Scraper status + email capture */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[var(--acv-ink)]"
                      >
                        <Search
                          size={20}
                          className="text-[var(--acv-bg)]"
                          strokeWidth={1.8}
                        />
                      </motion.div>
                      <div>
                        <h3 className="acv-display text-[19px] uppercase leading-[1] text-[var(--acv-ink)] sm:text-[21px]">
                          We're updating our scrapers
                        </h3>
                        <p className="mt-0.5 text-[12.5px] text-[var(--acv-ink-faint)]">
                          Thanks for your interest in AgentCV
                        </p>
                      </div>
                    </div>

                    {/* Status pill — same recipe as the hero badge: solid
                        accent fill, pulsing dot, bold uppercase label */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--acv-accent)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                      <span className="acv-pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
                      Scraper engine in progress
                    </div>

                    <p className="mb-6 text-[13.5px] leading-relaxed text-[var(--acv-ink-soft)]">
                      Our local job-board scrapers are still in the oven.
                      Drop your email and we'll let you know the moment
                      they're ready to run.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--acv-ink-faint)]"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl border bg-[var(--acv-bg)] py-3 pl-10 pr-4 text-[13.5px] text-[var(--acv-ink)] transition-colors duration-200 focus:border-[var(--acv-ink)] focus:outline-none"
                            style={{
                              borderColor: error
                                ? "var(--acv-accent)"
                                : "var(--acv-border)",
                              fontFamily: "inherit",
                            }}
                          />
                        </div>
                        {error && (
                          <p className="mt-1.5 text-[12px] text-[var(--acv-accent)]">
                            {error}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={!isLoading ? { y: -2 } : {}}
                        whileTap={!isLoading ? { scale: 0.97 } : {}}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 24,
                        }}
                        className="acv-shine relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--acv-ink)] py-3 text-[14px] font-semibold text-[var(--acv-bg)] transition-colors disabled:opacity-60"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Notify me when it's ready"
                        )}
                      </motion.button>
                    </form>

                    <p className="acv-mono mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] uppercase tracking-wide text-[var(--acv-ink-faint)]">
                      <Lock size={12} strokeWidth={2} />
                      No spam · Unsubscribe anytime
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Thank you message */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="py-4"
                  >
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 16,
                          delay: 0.05,
                        }}
                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-bg-flat)]"
                      >
                        <CheckCircle2
                          size={26}
                          strokeWidth={1.9}
                          style={{ color: "var(--acv-signal)" }}
                        />
                      </motion.div>

                      <h3 className="acv-display mb-2 text-[24px] uppercase leading-[0.98] text-[var(--acv-ink)]">
                        You're on the list
                      </h3>

                      <p className="max-w-sm text-[13.5px] leading-relaxed text-[var(--acv-ink-soft)]">
                        Thanks for stopping by! We're still putting the
                        finishing touches on our scrapers to bring you an
                        even better experience. Stay tuned!
                      </p>

                      <div className="acv-chip mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] text-[var(--acv-ink-soft)]">
                        <Sparkles size={14} style={{ color: "var(--acv-signal)" }} />
                        We'll email you the moment we're ready
                      </div>

                      <button
                        onClick={onClose}
                        className="mt-6 rounded-full border border-[var(--acv-border-strong)] px-6 py-2.5 text-[13.5px] font-semibold text-[var(--acv-ink)] transition hover:bg-[var(--acv-ink)] hover:text-[var(--acv-bg)]"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Flat single-color accent bar — same weight/color as the
                page's scroll-progress bar, no gradient */}
            <div className="h-[3px] bg-[var(--acv-accent)]" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaitlistPopup;