import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { FAQ_ITEMS } from '../config/landingConfig';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--acv-border-soft)] py-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[15px] font-semibold text-[var(--acv-ink)]">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[var(--acv-border)]"
        >
          <ChevronDown className="h-3.5 w-3.5 text-[var(--acv-ink-soft)]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25 },
            }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pr-10 pt-3 text-[13.5px] leading-relaxed text-[var(--acv-ink-soft)]"
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
              Questions, answered
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-[var(--acv-ink-soft)] lg:mx-0">
              The short version of everything else on this page — data,
              boards, pricing, and how much you can tweak before applying.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="acv-panel rounded-[20px] px-6 sm:px-8">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}