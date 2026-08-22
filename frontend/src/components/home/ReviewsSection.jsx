import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Reveal, SectionEyebrow, Stars } from '../ui';
import { REVIEWS } from '../config/landingConfig';

function ReviewCard({ review }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex h-full w-[300px] flex-none flex-col rounded-2xl border border-[var(--acv-border)] bg-[var(--acv-surface)] p-6 sm:w-[340px]"
    >
      <Quote className="h-6 w-6 text-[#6552E8]/25" strokeWidth={2.5} />
      <p className="acv-serif mt-3 flex-1 text-[15px] leading-relaxed text-[var(--acv-ink-medium)]">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ backgroundColor: review.color }}
        >
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-[13.5px] font-bold text-[var(--acv-ink)]">
            {review.name}
          </p>
          <p className="text-[11.5px] text-[var(--acv-ink-faint)]">
            {review.role}
          </p>
        </div>
        <div className="ml-auto">
          <Stars count={review.rating} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const rowA = REVIEWS.slice(0, 3);
  const rowB = REVIEWS.slice(3, 6);
  const rowADup = [...rowA, ...rowA];
  const rowBDup = [...rowB, ...rowB];

  return (
    <section id="reviews" className="overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow index="05">Reviews</SectionEyebrow>
          <h2 className="acv-display mt-4 text-[32px] font-bold leading-tight text-[var(--acv-ink)] sm:text-[38px]">
            Job seekers,{" "}
            <span className="acv-serif bg-gradient-to-r from-[#6552E8] to-[#8B5CF6] bg-clip-text text-transparent">
              not marketers
            </span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--acv-bg)] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--acv-bg)] to-transparent sm:w-28" />

        <div className="acv-marquee-track flex w-max gap-5 px-4">
          {rowADup.map((review, i) => (
            <ReviewCard key={`a-${review.name}-${i}`} review={review} />
          ))}
        </div>
        <div className="acv-marquee-track-reverse mt-5 flex w-max gap-5 px-4">
          {rowBDup.map((review, i) => (
            <ReviewCard key={`b-${review.name}-${i}`} review={review} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}