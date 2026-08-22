import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Reveal, SectionEyebrow } from '../ui';
import { FAQ_ITEMS } from '../config/landingConfig';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--acv-border)] py-5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold text-[var(--acv-ink)]">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#6552E8]/10"
        >
          <ChevronDown className="h-4 w-4 text-[#6552E8]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[13.5px] leading-relaxed text-[var(--acv-ink-soft)]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="bg-[var(--acv-surface)] py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <SectionEyebrow index="06">FAQ</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[32px] font-bold leading-tight text-[var(--acv-ink)] sm:text-[38px]">
            Questions,{" "}
            <span className="acv-serif bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
              answered
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
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
    </section>
  );
}