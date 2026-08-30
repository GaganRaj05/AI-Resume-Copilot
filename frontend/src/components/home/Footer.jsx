import { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Globe,
  MessageCircle,
  Rss,
  Mail,
} from "lucide-react";
import { BRAND, FOOTER_COLUMNS } from "../config/landingConfig";
import WaitlistPopup from "./forms/WaitListPopUp";
const late = ["Download", "Changelog", "Privacy", "Contact", "Documentation"];
import {motion } from 'framer-motion'
import Reveal from "../ui/Reveal";

export default function Footer() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      <WaitlistPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
    </footer>
  );
}



