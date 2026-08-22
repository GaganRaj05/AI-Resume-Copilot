
export default function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E4F8EA] px-4 py-1.5 text-[13px] font-medium text-[#128238]">
      {children}
    </span>
  );
}