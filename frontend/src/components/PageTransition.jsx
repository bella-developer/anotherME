import { useEffect, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * PageTransition Component
 * Wraps page content with fade transition animation
 * Requirements: 35.4 - Page transitions (150ms)
 * Requirements: 35.7 - Respect prefers-reduced-motion
 */
function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Trigger fade-in after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-opacity ease-in-out ${
        prefersReducedMotion ? 'duration-0' : 'duration-150'
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
