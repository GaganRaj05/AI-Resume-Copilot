import {useState} from 'react';
import { FileText } from 'lucide-react';
import { PrimaryButton } from '../ui';
import { BRAND, OS_LABEL, NAV_LINKS } from '../config/landingConfig';
import WaitlistPopup from './forms/WaitListPopUp';
export default function Navbar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-[#ECEAF8] bg-[#F6F5FC]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6552E8] to-[#4B3DD1] shadow-md">
            <FileText className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="acv-display text-[15px] font-bold text-[#14142B]">{BRAND}</p>
            <p className="text-[11.5px] font-semibold text-[#6552E8]">Local Resume Agent</p>
          </div>
        </div>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-[#3F3D56] transition hover:text-[#14142B]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <PrimaryButton className="px-5 py-2.5 text-[13.5px]" onClick={()=>setIsPopupOpen(true)}>
          Download for {OS_LABEL}
        </PrimaryButton>
      </nav>
      
    </header>
    <WaitlistPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
}