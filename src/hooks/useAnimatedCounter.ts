'use client';

import { useState, useEffect } from 'react';
import { animate, useMotionValue } from 'framer-motion';

export function useAnimatedCounter(target: number, duration: number = 1.2): number {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });

    return () => controls.stop();
  }, [target, duration, motionVal]);

  return displayValue;
}
