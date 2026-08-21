import React from 'react';
import { Bot, Check, X } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { BRAND, COMPARISON_ROWS } from '../config/landingConfig';

export default function WhyDifferent() {
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