import { motion } from 'framer-motion';

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={
        "acv-shine inline-flex items-center justify-center gap-2 rounded-xl bg-[#17A34A] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(23,163,74,0.55)] transition-colors hover:bg-[#128238] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17A34A] " +
        className
      }
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, className = "", href, ...props }) {
  const sharedClassName =
    "acv-shine inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--acv-border)] bg-[var(--acv-surface)] px-6 py-3.5 text-[15px] font-semibold text-[var(--acv-ink)] transition-colors hover:border-[#6552E8]/35 hover:bg-[var(--acv-surface-alt)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6552E8] " +
    className;
  const sharedMotionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={sharedClassName}
        {...sharedMotionProps}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={sharedClassName}
      {...sharedMotionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default PrimaryButton;