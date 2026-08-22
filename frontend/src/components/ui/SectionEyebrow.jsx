
export default function SectionEyebrow({ children, index }) {
  return (
    <div className="inline-flex items-center justify-center gap-2.5">
      <p className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#6552E8]">
        {children}
      </p>
    </div>
  );
}