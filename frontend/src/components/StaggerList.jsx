import { Children, cloneElement } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * StaggerList Component
 * Applies stagger animation to list items
 * Requirements: 35.6 - List stagger animations (50ms delay between items)
 * Requirements: 35.7 - Respect prefers-reduced-motion
 */
function StaggerList({ children, className = '', staggerDelay = 50 }) {
  const childArray = Children.toArray(children);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={className}>
      {childArray.map((child, index) => {
        // Clone child and add animation styles
        // If reduced motion is preferred, skip animation delay
        return cloneElement(child, {
          key: child.key || index,
          style: {
            ...child.props.style,
            animation: prefersReducedMotion ? 'none' : 'staggerFadeIn 300ms ease-out',
            animationDelay: prefersReducedMotion ? '0ms' : `${index * staggerDelay}ms`,
            animationFillMode: 'both',
          },
        });
      })}
    </div>
  );
}

export default StaggerList;
