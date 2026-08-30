import { Reveal } from "../ui";
import { STAT_HIGHLIGHTS } from "../config/landingConfig";
import {CountUp}  from "../ui";

export default function StatStrip() {
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