import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Reveal, SectionEyebrow, Stars } from '../ui';
import { REVIEWS } from '../config/landingConfig';

function ReviewCard({ review }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="acv-panel flex h-full w-[300px] flex-none flex-col rounded-[20px] p-6"
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
            style={{
              color: idx < review.rating ? "var(--acv-accent)" : "var(--acv-border)",
              fill: idx < review.rating ? "var(--acv-accent)" : "transparent",
            }}
          />
        ))}
      </div>
      <p className="mt-3.5 flex-1 text-[13.5px] leading-relaxed text-[var(--acv-ink-medium)]">
        “{review.quote}”
      </p>
      <div className="mt-5">
        <p className="text-[13px] font-semibold text-[var(--acv-ink)]">{review.name}</p>
        <p className="text-[12px] text-[var(--acv-ink-faint)]">{review.role}</p>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <section id="reviews" className="bg-[var(--acv-bg-flat)] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <SectionEyebrow>Reviews</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[34px] uppercase leading-[0.98] text-[var(--acv-ink)] sm:text-[42px]">
            People stop rewriting resumes
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="acv-marquee-mask relative mt-14 overflow-hidden">
        <div className="acv-review-track flex w-max gap-5 px-6">
          {doubled.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}