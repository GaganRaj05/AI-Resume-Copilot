import { Reveal } from '../ui';
import { COMPANIES } from '../config/landingConfig';

function LogoMark({ name, icon: Icon, color }) {
  return (
    <div className="flex flex-none items-center gap-2.5 opacity-75 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon
          className="h-[18px] w-[18px]"
          style={{ color }}
          strokeWidth={2.25}
        />
      </div>
      <span className="acv-display whitespace-nowrap text-[16px] font-bold tracking-tight text-[var(--acv-ink-medium)]">
        {name}
      </span>
    </div>
  );
}

export default function TrustLogos() {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <div className="border-y border-[var(--acv-border)] bg-[var(--acv-bg)] py-10">
      <Reveal>
        <p className="text-center text-[13px] font-medium text-[var(--acv-ink-faint)]">
          Built to tailor resumes for roles at companies like these
        </p>
      </Reveal>
      <div className="relative mx-auto mt-6 max-w-6xl overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--acv-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--acv-bg)] to-transparent" />
        <div className="acv-marquee-track flex w-max gap-12 px-4">
          {doubled.map((company, i) => (
            <LogoMark key={`${company.name}-${i}`} {...company} />
          ))}
        </div>
      </div>
    </div>
  );
}
