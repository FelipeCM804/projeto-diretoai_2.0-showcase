
import { useEffect, useRef } from 'react';

interface GestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useGestures = (config: GestureConfig) => {
  const ref = useRef<HTMLElement>(null);
  const startTouch = useRef<{ x: number; y: number } | null>(null);
  const threshold = config.threshold || 50;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (Math.max(absDeltaX, absDeltaY) < threshold) return;

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && config.onSwipeRight) {
          config.onSwipeRight();
        } else if (deltaX < 0 && config.onSwipeLeft) {
          config.onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && config.onSwipeDown) {
          config.onSwipeDown();
        } else if (deltaY < 0 && config.onSwipeUp) {
          config.onSwipeUp();
        }
      }

      startTouch.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [config, threshold]);

  return ref;
};
