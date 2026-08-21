import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import '../../styles/Home.css'; // Assuming your CSS file is in the same directory

const WaitlistPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setEmail('');
        setError('');
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.92,
      y: 20,
      transition: { duration: 0.25 }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.25 }
    }
  };

  // Step 1 -> Step 2 transition variants
  const stepVariants = {
    initial: { 
      opacity: 0,
      x: 20,
      scale: 0.97
    },
    animate: { 
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      scale: 0.97,
      transition: { duration: 0.3 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        style={{
          background: 'rgba(10, 10, 24, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main card - using CSS variables for all colors */}
          <div 
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: 'var(--acv-surface)',
              border: '1px solid var(--acv-border)',
              boxShadow: `0 25px 50px -12px var(--acv-shadow-tint)`,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors duration-200 hover:bg-opacity-20 z-10"
              style={{
                color: 'var(--acv-muted)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--acv-accent-soft)';
                e.currentTarget.style.color = 'var(--acv-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--acv-muted)';
              }}
            >
              <X size={20} />
            </button>

            {/* Content container */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Email input */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {/* Header with gradient icon */}
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="p-2.5 rounded-xl"
                        style={{
                          background: 'var(--acv-accent-soft)',
                        }}
                      >
                        <Mail 
                          size={24} 
                          style={{ color: 'var(--acv-accent)' }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <h3 
                          className="text-xl font-semibold acv-display"
                          style={{ color: 'var(--acv-heading)' }}
                        >
                          Get early access
                        </h3>
                        <p 
                          className="text-sm"
                          style={{ color: 'var(--acv-muted)' }}
                        >
                          Join the waitlist for our new release
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p 
                      className="text-sm mb-6 leading-relaxed"
                      style={{ color: 'var(--acv-body)' }}
                    >
                      Be the first to know when we launch. No spam, just the good stuff.
                    </p>

                    {/* Email form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-200 focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: 'var(--acv-bg)',
                            borderColor: error ? 'var(--acv-danger)' : 'var(--acv-border)',
                            color: 'var(--acv-heading)',
                            fontFamily: 'inherit',
                          }}
                          onFocus={(e) => {
                            if (!error) {
                              e.currentTarget.style.borderColor = 'var(--acv-accent)';
                              e.currentTarget.style.boxShadow = `0 0 0 3px var(--acv-accent-soft)`;
                            }
                          }}
                          onBlur={(e) => {
                            if (!error) {
                              e.currentTarget.style.borderColor = 'var(--acv-border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        />
                        {error && (
                          <p 
                            className="text-xs mt-1.5"
                            style={{ color: 'var(--acv-danger)' }}
                          >
                            {error}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 relative overflow-hidden"
                        style={{
                          backgroundColor: 'var(--acv-accent)',
                          color: '#fff',
                          boxShadow: `0 4px 14px var(--acv-shadow-tint)`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--acv-accent-strong)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 8px 25px var(--acv-shadow-tint)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--acv-accent)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `0 4px 14px var(--acv-shadow-tint)`;
                        }}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="acv-spin" />
                            Submitting...
                          </span>
                        ) : (
                          'Join waitlist'
                        )}
                      </button>
                    </form>

                    {/* Footer note */}
                    <p 
                      className="text-xs text-center mt-4"
                      style={{ color: 'var(--acv-muted)' }}
                    >
                      🔒 No spam. Unsubscribe anytime.
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Thank you message */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="py-6"
                  >
                    {/* Success animation */}
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="relative mb-6"
                      >
                        <div 
                          className="p-4 rounded-full"
                          style={{
                            background: 'var(--acv-success-soft)',
                          }}
                        >
                          <CheckCircle 
                            size={48} 
                            style={{ color: 'var(--acv-success)' }}
                            strokeWidth={1.5}
                          />
                        </div>
                        {/* Glow pulse ring */}
                        <div 
                          className="absolute inset-0 rounded-full acv-glow-pulse"
                          style={{
                            border: '2px solid var(--acv-success-soft)',
                          }}
                        />
                      </div>

                      <h3 
                        className="text-2xl font-semibold acv-display mb-2"
                        style={{ color: 'var(--acv-heading)' }}
                      >
                        You're on the list! 🎉
                      </h3>

                      <p 
                        className="text-sm leading-relaxed max-w-sm"
                        style={{ color: 'var(--acv-body)' }}
                      >
                        Thanks for stopping by! We're currently updating our scrapers 
                        to bring you an even better experience. Stay tuned!
                      </p>

                      {/* Small sparkle note */}
                      <div 
                        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs"
                        style={{
                          background: 'var(--acv-accent-soft)',
                          color: 'var(--acv-accent)',
                        }}
                      >
                        <Sparkles size={14} />
                        <span>We'll notify you as soon as we're ready</span>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={onClose}
                        className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--acv-accent-soft)',
                          color: 'var(--acv-accent)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--acv-accent)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--acv-accent-soft)';
                          e.currentTarget.style.color = 'var(--acv-accent)';
                        }}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle accent bar at bottom */}
            <div 
              className="h-1"
              style={{
                background: `linear-gradient(90deg, var(--acv-accent), var(--acv-success), var(--acv-accent-2))`,
                backgroundSize: '200% auto',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaitlistPopup;