import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export function IconSlider({ children }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      // Get the width of a single item (first child)
      const itemWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      // Add the gap/margin if any (e.g., gap-4 is 16px)
      const gap = 16;

      const scrollAmount =
        direction === "left" ? -(itemWidth + gap) : itemWidth + gap;

      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full">
      {/* Navigation Icons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {React.Children.map(children, (child) => (
          <div className="flex scroll-snap-align-start">{child}</div>
        ))}
      </div>
    </div>
  );
}
