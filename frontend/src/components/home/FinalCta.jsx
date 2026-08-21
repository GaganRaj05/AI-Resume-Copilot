import {useState} from 'react';
import { Gauge, Download, ArrowRight } from 'lucide-react';
import { Reveal, PrimaryButton, SecondaryButton } from '../ui';
import { OS_LABEL } from '../config/landingConfig';
import WaitlistPopup from './forms/WaitListPopUp';

export default function FinalCta() {
      const [isPopupOpen, setIsPopupOpen] = useState(false);
    
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#14142B] to-[#2A2456] px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6552E8] opacity-30 blur-3xl" />
          <Gauge className="mx-auto h-9 w-9 text-[#8B78F0]" strokeWidth={1.75} />
          <h2 className="acv-display relative mt-4 text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            Stop tailoring resumes by hand
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#C9C4EE]">
            Download the agent, connect your background, and let it work
            every morning while you focus on interviews.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton onClick={()=>setIsPopupOpen(true)}>
              <Download className="h-4.5 w-4.5" strokeWidth={2.5} />
              Download for {OS_LABEL}
            </PrimaryButton>
            <SecondaryButton className="border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10" onClick={()=>setIsPopupOpen(true)}>
              Read the Docs
              <ArrowRight className="h-4 w-4" />
            </SecondaryButton>
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