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
import "../../styles/Home.css";

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
    hidden: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.25 } },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.25 } },
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
        style={{
          background: "rgba(6, 6, 16, 0.68)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient glow behind the card, echoes hero/final-CTA glows */}
          <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-[#6552E8] opacity-20 blur-3xl" />

          <div className="acv-dotgrid relative overflow-hidden rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-surface)] shadow-2xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-[var(--acv-ink-faint)] transition-colors duration-200 hover:bg-[#17A34A]/10 hover:text-[#17A34A]"
            >
              <X size={20} />
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
                        className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1] shadow-[0_8px_20px_-6px_rgba(101,82,232,0.55)]"
                      >
                        <Search
                          size={22}
                          className="text-white"
                          strokeWidth={1.75}
                        />
                      </motion.div>
                      <div>
                        <h3 className="acv-display text-xl font-semibold leading-tight text-[var(--acv-ink)]">
                          We're building our scrapers
                        </h3>
                        <p className="text-sm text-[var(--acv-ink-faint)]">
                          Thanks for your interest in AgentCV
                        </p>
                      </div>
                    </div>

                    {/* Mono status chip — echoes the hero's agent console */}
                    <div className="acv-mono mb-5 inline-flex items-center gap-2 rounded-full border border-[#CA8A04]/25 bg-[#CA8A04]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#A36A03]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CA8A04] opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#CA8A04]" />
                      </span>
                      Scraper engine in progress
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-[var(--acv-ink-soft)]">
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
                            className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm transition-colors duration-200 focus:outline-none"
                            style={{
                              backgroundColor: "var(--acv-bg)",
                              borderColor: error
                                ? "#D1487A"
                                : "var(--acv-border)",
                              color: "var(--acv-ink)",
                              fontFamily: "inherit",
                            }}
                            onFocus={(e) => {
                              if (!error) {
                                e.currentTarget.style.borderColor = "#17A34A";
                                e.currentTarget.style.boxShadow =
                                  "0 0 0 3px rgba(23, 163, 74, 0.12)";
                              }
                            }}
                            onBlur={(e) => {
                              if (!error) {
                                e.currentTarget.style.borderColor =
                                  "var(--acv-border)";
                                e.currentTarget.style.boxShadow = "none";
                              }
                            }}
                          />
                        </div>
                        {error && (
                          <p className="mt-1.5 text-xs text-[#D1487A]">
                            {error}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={!isLoading ? { y: -2, scale: 1.015 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="acv-shine relative w-full overflow-hidden rounded-xl bg-[#17A34A] py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(23,163,74,0.55)] transition-colors hover:bg-[#128238] disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="acv-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Notify me when it's ready"
                        )}
                      </motion.button>
                    </form>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--acv-ink-faint)]">
                      <Lock size={12} strokeWidth={2} />
                      No spam. Unsubscribe anytime.
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
                        className="acv-glow-tick mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#17A34A] to-[#128238]"
                      >
                        <CheckCircle2
                          size={30}
                          className="text-white"
                          strokeWidth={2}
                        />
                      </motion.div>

                      <h3 className="acv-display mb-2 text-2xl font-semibold text-[var(--acv-ink)]">
                        You're on the list
                      </h3>

                      <p className="max-w-sm text-sm leading-relaxed text-[var(--acv-ink-soft)]">
                        Thanks for stopping by! We're still putting the
                        finishing touches on our scrapers to bring you an
                        even better experience. Stay tuned!
                      </p>

                      <div className="mt-6 flex items-center gap-2 rounded-full bg-[#6552E8]/10 px-4 py-2 text-xs text-[#6552E8]">
                        <Sparkles size={14} />
                        <span>We'll email you the moment we're ready</span>
                      </div>

                      <button
                        onClick={onClose}
                        className="mt-6 rounded-xl bg-[#17A34A]/10 px-6 py-2.5 text-sm font-medium text-[#17A34A] transition-all duration-200 hover:bg-[#17A34A] hover:text-white"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle accent bar at bottom */}
            <div
              className="h-1"
              style={{
                background:
                  "linear-gradient(90deg, #17A34A, #6552E8, #8B5CF6)",
                backgroundSize: "200% auto",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaitlistPopup;