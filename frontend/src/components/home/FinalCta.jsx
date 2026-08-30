import {useState} from 'react';
import {  Download, ArrowRight, Bot } from 'lucide-react';
import { Reveal } from '../ui';
import { OS_LABEL } from '../config/landingConfig';
import {motion} from 'framer-motion';
import WaitlistPopup from './forms/WaitListPopUp';


export default function FinalCta() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <Reveal>
        <div className="acv-ink-block relative overflow-hidden rounded-[28px] border-2 border-[#FF3B1F] px-8 py-16 text-center sm:px-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15">
            <Bot className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h2 className="acv-display relative mt-5 text-[34px] uppercase leading-[0.98] sm:text-[46px]">
            Stop tailoring resumes by hand
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed opacity-70">
            Download the agent, connect your background, and let it work every
            morning while you focus on interviews.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>setIsPopupOpen(true)}
              className="acv-shine inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[var(--acv-contrast-bg)]"
            >
              <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </motion.button>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>setIsPopupOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[14.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Read the docs
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </Reveal>
      <WaitlistPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </section>
  );
}

