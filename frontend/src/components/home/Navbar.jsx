import { useState, useEffect } from "react";
import { FileText, Moon, Sun, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { PrimaryButton } from "../ui";
import { BRAND, NAV_LINKS, TICKER_ITEMS } from "../config/landingConfig";
import WaitlistPopup from "./forms/WaitListPopUp";

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
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 26,
            }}
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
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 26,
            }}
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
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
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
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="overflow-hidden border-b border-[var(--acv-border-soft)] bg-[var(--acv-bg)] lg:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.href)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-[var(--acv-ink-medium)] transition hover:bg-[var(--acv-bg-flat)] hover:text-[var(--acv-ink)]"
              >
                {link.label}
              </motion.button>
            ))}
          </div>
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

export default function Navbar({ theme, onToggleTheme }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`acv-nav-surface sticky top-0 z-40 transition-shadow ${
          scrolled ? "is-scrolled shadow-[0_1px_0_var(--acv-border)]" : ""
        }`}
      >
<nav className="acv-navbar mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5 lg:px-10">          {/* LEFT — Logo */}
          <div className="justify-self-start">
            <a href="#" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--acv-ink)]">
                <FileText
                  className="h-4 w-4 text-[var(--acv-bg)]"
                  strokeWidth={2.25}
                />
              </span>

              <span className="acv-display text-[16px] tracking-tight text-[var(--acv-ink)]">
                {BRAND}
              </span>
            </a>
          </div>

          {/* CENTER — Navigation */}
          <div className="acv-chip hidden items-center gap-1 rounded-full p-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.href)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="rounded-full px-4 py-2 text-[13.5px] font-semibold text-[var(--acv-ink-medium)] transition hover:text-[var(--acv-ink)] cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* RIGHT — Controls */}
          <div className="flex items-center gap-2.5 justify-self-end">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <PrimaryButton
              className="hidden px-5 py-2.5 text-[13px] sm:inline-flex"
              onClick={() => setIsPopupOpen(true)}
            >
              Download
              <ArrowRight className="h-3.5 w-3.5" />
            </PrimaryButton>

            <MenuToggle
              open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            />
          </div>
        </nav>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <TickerBar />
      </header>

      <WaitlistPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
