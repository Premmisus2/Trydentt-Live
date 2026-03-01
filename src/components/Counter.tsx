import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useMotionValueEvent, useInView } from 'motion/react';

const Counter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 2.5 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [value, duration, count, isInView]);

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplayValue(latest);
  });

  return <span ref={ref}>{displayValue}</span>;
};

export default Counter;
