import { forwardRef } from 'react';

/**
 * Button Component
 * Implements accessible button with responsive touch targets
 * Requirements: 33.1-33.7, 30.5
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      icon = false,
      className = '',
      onClick,
      type = 'button',
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Base styles with accessibility
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-bg';

    // Variant styles with proper contrast ratios
    const variantStyles = {
      primary:
        'bg-accent-primary text-white hover:brightness-110 active:scale-98 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
      secondary:
        'bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary/10 active:scale-98 disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
      tertiary:
        'bg-transparent text-accent-primary hover:bg-accent-primary/10 active:scale-98 disabled:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
    };

    // Size styles - mobile touch targets are minimum 48px
    const sizeStyles = icon
      ? {
          small: 'w-10 h-10 md:w-8 md:h-8 p-2 md:p-1',
          medium: 'w-12 h-12 md:w-10 md:h-10 p-3 md:p-2',
          large: 'w-14 h-14 md:w-12 md:h-12 p-4 md:p-3',
        }
      : {
          small: 'min-h-touch md:h-8 px-4 md:px-3 text-base md:text-sm rounded-md',
          medium: 'min-h-touch md:h-10 px-5 md:px-4 text-base rounded-lg',
          large: 'min-h-touch md:h-12 px-7 md:px-6 text-lg rounded-lg',
        };

    // Icon button specific styles
    const iconStyles = icon ? 'rounded-lg' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${iconStyles} ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={combinedClassName}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
