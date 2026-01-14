import React from "react";
import { useRef, useState, useEffect } from "react";

export function Carousel({ children, speed = 0.5 }) {
      const trackRef = useRef(null);
      const [thumbWidth, setThumbWidth] = useState(0);
      const [thumbLeft, setThumbLeft] = useState(0);
    
      useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
    
        let rafId;
    
        const update = () => {
          const visible = el.clientWidth;
          const total = el.scrollWidth;
          const maxScroll = total - visible;
    
          // move automatically
          el.scrollLeft += speed;
    
          // loop back to start
          if (el.scrollLeft >= maxScroll) {
            el.scrollLeft = 0;
          }
    
          // update thumb
          setThumbWidth((visible / total) * 100);
          setThumbLeft((el.scrollLeft / total) * 100);
    
          rafId = requestAnimationFrame(update);
        };
    
        rafId = requestAnimationFrame(update);
    
        return () => cancelAnimationFrame(rafId);
      }, [speed]);
    
      return (
        <div className="w-full">
          {/* auto-scrolling content */}
          <div
            ref={trackRef}
            className="flex overflow-x-hidden"
          >
            {children}
          </div>
    
          {/* custom scrollbar */}
          <div className="relative left-1/4 mt-3 h-1 w-1/2 bg-neutral-200 rounded-full">
            <div
              className="absolute h-full bg-black rounded-full"
              style={{
                width: `${thumbWidth}%`,
                left: `${thumbLeft}%`,
              }}
            />
          </div>
        </div>
      );
    }
