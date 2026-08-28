import { useState, useEffect, useRef } from 'react';

export function useExamTimer({
  initialSeconds = 5400,
  isActive = false,
  onTimeExpired
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onTimeExpiredRef = useRef(onTimeExpired);
  onTimeExpiredRef.current = onTimeExpired;

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeExpiredRef.current) {
            onTimeExpiredRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  let urgency = 'normal'; // 'normal' | 'warning' | 'critical'
  if (secondsLeft <= 120) {
    urgency = 'critical';
  } else if (secondsLeft <= 600) {
    urgency = 'warning';
  }

  return {
    secondsLeft,
    formattedTime: formatTime(secondsLeft),
    urgency,
    isExpired: secondsLeft === 0,
    setSecondsLeft
  };
}
