'use client';

import {useEffect, useState} from 'react';

interface CountdownTimerProperties {
  targetDate: number;
  className?: string;
}

const calculateCountdown = (distance: number) => {
  if (distance < 0) {
    return 'Ongoing';
  }

  const totalHours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${totalHours}h ${minutes}m ${seconds}s`;
};

export function CountdownTimer({targetDate}: CountdownTimerProperties) {
  const [countdown, setCountdown] = useState(() => {
    const now = Date.now();
    const distance = targetDate - now;
    return calculateCountdown(distance);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;
      setCountdown(calculateCountdown(distance));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
