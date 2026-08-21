import React from 'react';
import { Star } from 'lucide-react';

export default function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "fill-[#F5A623] text-[#F5A623]" : "text-[#E1DFF3]"}`}
        />
      ))}
    </div>
  );
}