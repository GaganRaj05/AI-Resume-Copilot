import { motion } from 'framer-motion';
import '../components/styles/Home.css';
import {
  Navbar,
  HeroCopy,
  HeroVisual,
  TrustLogos,
  ProblemSection,
  HowItWorks,
  WhyDifferent,
  FeatureStrip,
  ReviewsSection,
  FaqSection,
  FinalCta,
  Footer,
} from '../components/home/index';

export default function Home() {
  return (
    <div className="acv-font min-h-screen bg-[#F6F5FC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-10 pt-10 lg:px-10 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <HeroCopy />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </main>

      <TrustLogos />
      <ProblemSection />
      <HowItWorks />
      <WhyDifferent />
      <FeatureStrip />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}