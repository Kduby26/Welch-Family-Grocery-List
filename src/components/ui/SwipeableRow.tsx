import { ReactNode, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

interface SwipeableRowProps {
  children: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightColor?: string;
  leftColor?: string;
  rightLabel?: string;
  leftLabel?: string;
}

const THRESHOLD = 80;

export function SwipeableRow({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightColor = 'bg-emerald-600',
  leftColor = 'bg-red-600',
  rightLabel = '✓',
  leftLabel = '✕',
}: SwipeableRowProps) {
  const [style, api] = useSpring(() => ({ x: 0 }));
  const triggerRef = useRef(false);

  const bind = useDrag(
    ({ movement: [mx], active, cancel }) => {
      if (!active) {
        if (mx > THRESHOLD && onSwipeRight) {
          triggerRef.current = true;
          api.start({
            x: 300,
            onRest: () => {
              onSwipeRight();
              api.start({ x: 0, immediate: true });
              triggerRef.current = false;
            },
          });
        } else if (mx < -THRESHOLD && onSwipeLeft) {
          triggerRef.current = true;
          api.start({
            x: -300,
            onRest: () => {
              onSwipeLeft();
              api.start({ x: 0, immediate: true });
              triggerRef.current = false;
            },
          });
        } else {
          api.start({ x: 0 });
        }
        return;
      }

      // Limit drag range
      const clamped = Math.max(-150, Math.min(150, mx));
      api.start({ x: clamped, immediate: true });
    },
    {
      axis: 'x',
      filterTaps: true,
      rubberband: true,
    }
  );

  return (
    <div className="relative overflow-hidden">
      {/* Right swipe background (check off) */}
      <div
        className={`absolute inset-y-0 left-0 right-1/2 ${rightColor} flex items-center pl-5`}
      >
        <span className="text-white text-xl font-bold">{rightLabel}</span>
      </div>
      {/* Left swipe background (delete) */}
      <div
        className={`absolute inset-y-0 left-1/2 right-0 ${leftColor} flex items-center justify-end pr-5`}
      >
        <span className="text-white text-xl font-bold">{leftLabel}</span>
      </div>
      {/* Content */}
      <animated.div
        {...bind()}
        style={{ x: style.x, touchAction: 'pan-y' }}
        className="relative z-10"
      >
        {children}
      </animated.div>
    </div>
  );
}
