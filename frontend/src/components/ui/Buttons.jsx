import { motion } from 'framer-motion';

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={
        "acv-shine inline-flex items-center justify-center gap-2 rounded-full bg-[var(--acv-ink)] px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-bg)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acv-ink)] " +
        className
      }
      {...props}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, className = "", href, ...props }) {
  const sharedClassName =
    "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--acv-border-strong)] px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-ink)] transition hover:bg-[var(--acv-ink)] hover:text-[var(--acv-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acv-ink)] " +
    className;
  const sharedMotionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 420, damping: 24 },
  };

  if (href) {
    return (
      <motion.a href={href} className={sharedClassName} {...sharedMotionProps} {...props}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button className={sharedClassName} {...sharedMotionProps} {...props}>
      {children}
    </motion.button>
  );
}

export default PrimaryButton;