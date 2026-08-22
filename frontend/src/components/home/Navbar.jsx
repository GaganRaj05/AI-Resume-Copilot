import { useState } from "react";
import { FileText } from "lucide-react";
import { PrimaryButton } from "../ui";
import { BRAND, OS_LABEL, NAV_LINKS } from "../config/landingConfig";
import WaitlistPopup from "./forms/WaitListPopUp";
import { TICKER_ITEMS } from "../config/landingConfig";
import { Download, Moon, Asterisk, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full border border-[var(--acv-border)] bg-[var(--acv-surface)] text-[var(--acv-ink-medium)] transition-colors hover:border-[#6552E8]/40"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
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
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun className="h-4 w-4" strokeWidth={2.25} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function TickerBar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-b border-[var(--acv-border)] bg-[var(--acv-surface-alt)] py-2">
      <div className="acv-ticker-track acv-mono flex w-max items-center gap-8 whitespace-nowrap px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--acv-ink-faint)]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            {item}
            <Asterisk className="h-3 w-3 text-[#6552E8]/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Navbar({ theme, onToggleTheme }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur">
        <div className="border-b border-[var(--acv-border)] bg-[var(--acv-nav-bg)]">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1] shadow-md">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.25} />
              </div>
              <div className="leading-tight">
                <p className="acv-display text-[15px] font-bold text-[var(--acv-ink)]">
                  {BRAND}
                </p>
                <p className="text-[11.5px] font-semibold text-[#6552E8]">
                  Local Resume Agent
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() =>
                    document.getElementById(link.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="text-[14px] font-medium text-[var(--acv-ink-medium)] transition hover:text-[var(--acv-ink)]"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <PrimaryButton
                className="px-5 py-2.5 text-[13.5px] max-[375px]:w-[150px] max-[376px]:h-[50px] max-[376px]:px-3 max-[320px]:w-[100px] max-[320px]:h-[40px] max-[320px]:px-2"
                onClick={() => setIsPopupOpen(true)}
              >
                <Download
                  className="h-4 w-4 max-[376px]:h-3.5 max-[376px]:w-2.5"
                  strokeWidth={2.5}
                />
                <span className="max-[320px]:text-[11px]">
                  Download for {OS_LABEL}
                </span>
              </PrimaryButton>{" "}
            </div>
          </nav>
        </div>
        <TickerBar />
      </header>
      <WaitlistPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
