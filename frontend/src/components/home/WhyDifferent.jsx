import { Bot, Check, X } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { BRAND, COMPARISON_ROWS } from '../config/landingConfig';

export default function WhyDifferent() {
  return (
    <section
      id="why-different"
      className="mx-auto max-w-6xl px-6 py-20 lg:px-10"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionEyebrow index="03">Why It&apos;s Different</SectionEyebrow>
        <h2 className="acv-display mt-4 text-[32px] font-bold leading-tight text-[var(--acv-ink)] sm:text-[38px]">
          Not another cloud{" "}
          <span className="acv-serif bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
            subscription
          </span>
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--acv-ink-soft)]">
          {BRAND} is an agent you run, not a service you rent.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-12 overflow-hidden rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-surface)]"
      >
        <div className="grid grid-cols-3 border-b border-[var(--acv-border)] bg-[var(--acv-surface-alt)] text-[13px] font-bold text-[var(--acv-ink)]">
          <div className="px-5 py-4">&nbsp;</div>
          <div className="border-l border-[var(--acv-border)] px-5 py-4 text-center text-[var(--acv-ink-faint)]">
            Typical Cloud Tools
          </div>
          <div className="acv-display flex items-center justify-center gap-1.5 border-l border-[var(--acv-border)] bg-[#6552E8]/10 px-5 py-4 text-center text-[#6552E8]">
            <Bot className="h-4 w-4" />
            {BRAND}
          </div>
        </div>
        {COMPARISON_ROWS.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 text-[13.5px] ${i !== COMPARISON_ROWS.length - 1 ? "border-b border-[var(--acv-border-soft)]" : ""}`}
          >
            <div className="px-5 py-4 font-medium text-[var(--acv-ink-medium)]">
              {row.label}
            </div>
            <div className="flex items-center justify-center border-l border-[var(--acv-border-soft)] px-5 py-4 text-center text-[var(--acv-ink-faint)]">
              {typeof row.cloud === "boolean" ? (
                row.cloud ? (
                  <Check className="h-4 w-4 text-[var(--acv-ink-faint)]" />
                ) : (
                  <X className="h-4 w-4 text-[#D1487A]" />
                )
              ) : (
                row.cloud
              )}
            </div>
            <div className="flex items-center justify-center border-l border-[var(--acv-border-soft)] bg-[#17A34A]/[0.05] px-5 py-4 text-center font-semibold text-[#128238]">
              {typeof row.local === "boolean" ? (
                row.local ? (
                  <Check className="h-4 w-4 text-[#17A34A]" />
                ) : (
                  <X className="h-4 w-4 text-[#D1487A]" />
                )
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