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

export default function Footer() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <footer className="border-t border-[#ECEAF8] bg-[#F6F5FC]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1]">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.25} />
              </div>
              <p className="acv-display text-[15px] font-bold text-[#14142B]">
                {BRAND}
              </p>
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
              <p className="text-[12.5px] font-bold uppercase tracking-wide text-[#8B899E]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={late.includes(link.label) ? undefined : link.href}
                      onClick={(e) => {
                        if (late.includes(link.label)) {
                          e.preventDefault();
                          setIsPopupOpen(true);
                        }
                      }}
                      className="text-[13.5px] font-medium text-[#3F3D56] transition hover:text-[#6552E8] cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#ECEAF8] pt-6 sm:flex-row">
          <p className="text-[12.5px] text-[#8B899E]">
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-[#8B899E]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#17A34A]" />
            Built local-first. Your data stays yours.
          </p>
        </div>
      </div>
      <WaitlistPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </footer>
  );
}
