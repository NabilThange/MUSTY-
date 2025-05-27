"use client";

import { useState, useEffect } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorClass, setCursorClass] = useState('pixel-pointer');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Prevent default cursor on all elements
    const preventDefaultCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.style.cursor = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      preventDefaultCursor(e);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, select, textarea, [role="button"]')) {
        setCursorClass('pixel-cursor');
        target.style.cursor = 'none';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, select, textarea, [role="button"]')) {
        setCursorClass('pixel-pointer');
        target.style.cursor = 'none';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, select, textarea, [role="button"]')) {
        setCursorClass('pixel-click');
        target.style.cursor = 'none';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setCursorClass('pixel-cursor');
      target.style.cursor = 'none';
    };

    // Track loading state
    const startLoading = () => {
      setIsLoading(true);
      setCursorClass('pixel-pointer cursor-loading');
    };
    const stopLoading = () => {
      setIsLoading(false);
      setCursorClass('pixel-pointer');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('loadstart', startLoading);
    window.addEventListener('loadend', stopLoading);

    // Prevent default cursor on page load
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('loadstart', startLoading);
      window.removeEventListener('loadend', stopLoading);
    };
  }, []);

  return (
    <div 
      className={cursorClass}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
    />
  );
} 