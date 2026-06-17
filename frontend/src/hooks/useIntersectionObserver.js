import { useEffect, useRef, useState } from 'react';

/**
 * useIntersectionObserver Hook
 * Detects when an element enters the viewport
 * Useful for infinite scroll and lazy loading
 * Implements Requirements: 15.1, 15.2
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.root - Root element selector
 * @param {string} options.rootMargin - Root margin
 * @returns {Object} - { ref, isIntersecting }
 */
function useIntersectionObserver(options = {}) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [threshold, root, rootMargin]);

  return { ref: targetRef, isIntersecting };
}

export default useIntersectionObserver;
