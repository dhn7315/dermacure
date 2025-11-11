'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseEnter = (e: MouseEvent) => {
      if (e.target instanceof Element) {
         if (
          window.getComputedStyle(e.target).cursor === 'pointer' || 
          e.target.closest('a, button, [role="button"]')
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseEnter);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseEnter);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          'pointer-events-none fixed z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 transition-transform duration-300 ease-in-out',
          isHovering ? 'scale-150 opacity-50' : 'scale-100',
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '32px',
          height: '32px',
        }}
      />
      <div
        className="pointer-events-none fixed z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '4px',
          height: '4px',
        }}
      />
    </>
  );
}
