/**
 * Performance Utilities
 * Utilities for monitoring and optimizing frontend performance
 * Implements Requirements: 15.1, 15.2, 15.5
 */

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {Function} callback - Function to measure
 */
export function measureRenderTime(componentName, callback) {
  if (process.env.NODE_ENV === 'production') {
    return callback();
  }

  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (duration > 16) {
    // Warn if render takes longer than one frame (16ms at 60fps)
    console.warn(
      `[Performance] ${componentName} render took ${duration.toFixed(2)}ms`
    );
  }

  return result;
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Lazy load image with placeholder
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {Promise<string>} - Loaded image URL
 */
export function lazyLoadImage(src, placeholder = '') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal chunk size for pagination based on viewport
 * @returns {number} - Optimal number of items to load
 */
export function getOptimalChunkSize() {
  const viewportHeight = window.innerHeight;
  const itemHeight = 200; // Approximate height of a post/circle card
  const buffer = 2; // Load 2 extra screens worth of content

  return Math.ceil((viewportHeight / itemHeight) * buffer);
}

/**
 * Preload critical resources
 * @param {Array<string>} urls - URLs to preload
 * @param {string} type - Resource type ('script', 'style', 'image', 'font')
 */
export function preloadResources(urls, type = 'script') {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  });
}

/**
 * Monitor Core Web Vitals
 * Reports LCP, FID, and CLS metrics
 */
export function monitorWebVitals() {
  if (process.env.NODE_ENV === 'production' && 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[Web Vitals] LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('[Web Vitals] FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      console.log('[Web Vitals] CLS:', clsScore);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Optimize bundle size by removing unused code
 * This is a placeholder for tree-shaking guidance
 */
export const OPTIMIZATION_TIPS = {
  // Use named imports instead of default imports
  // Example: import { useState } from 'react' instead of import React from 'react'
  
  // Lazy load heavy components
  // Example: const HeavyComponent = lazy(() => import('./HeavyComponent'))
  
  // Use dynamic imports for conditional features
  // Example: if (condition) { const module = await import('./module') }
  
  // Memoize expensive computations
  // Example: const result = useMemo(() => expensiveComputation(), [deps])
  
  // Avoid inline object/array creation in render
  // Example: const style = useMemo(() => ({ color: 'red' }), [])
};
