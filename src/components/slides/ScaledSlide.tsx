import { useEffect, useRef, useState } from "react";
import { DeckSlide } from "./deck";

export function ScaledSlide({ index }: { index: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(entry.contentRect.width / 1920, entry.contentRect.height / 1080));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className="scaled-slide-container"><div className="slide-wrapper" style={{ transform: `scale(${scale})` }}><DeckSlide index={index} /></div></div>;
}