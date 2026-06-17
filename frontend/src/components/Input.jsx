import { forwardRef, useId } from 'react';

/**
 * Input Component
 * Implements accessible form inputs with proper ARIA labels and error states
 * Requirements: 32.1-32.7, 30.5
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      placeholder,
      disabled = false,
      maxLength,
      showCharCount = false,
      value = '',
      onChange,
      className = '',
      multiline = false,
      rows = 4,
      required = false,
      ariaLabel,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const inputId = useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const counterId = `${inputId}-counter`;

    // Base input styles with responsive touch targets
    const baseInputStyles =
      'w-full bg-primary-secondary border rounded-lg px-4 py-2.5 md:py-2 min-h-touch md:min-h-0 text-text-primary text-sm md:text-base placeholder-gray-500 placeholder:italic transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    // Border styles based on state
    const borderStyles = error
      ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
      : 'border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20';

    const combinedInputClassName = `${baseInputStyles} ${borderStyles} ${className}`;

    // Calculate character count
    const charCount = value?.length || 0;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;

    // Build aria-describedby
    const describedByIds = [
      error && errorId,
      helperText && !error && helperId,
      showCharCount && maxLength && counterId,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm text-text-secondary mb-2"
          >
            {label}
            {required && (
              <span className="text-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input or Textarea */}
        <div className="relative">
          {multiline ? (
            <textarea
              ref={ref}
              id={inputId}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              rows={rows}
              required={required}
              className={combinedInputClassName}
              aria-label={ariaLabel || label}
              aria-invalid={!!error}
              aria-describedby={describedByIds || undefined}
              aria-required={required}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              required={required}
              className={combinedInputClassName}
              aria-label={ariaLabel || label}
              aria-invalid={!!error}
              aria-describedby={describedByIds || undefined}
              aria-required={required}
              {...props}
            />
          )}

          {/* Character Counter for textarea */}
          {showCharCount && maxLength && multiline && (
            <div
              id={counterId}
              className={`absolute bottom-2 right-2 text-xs ${
                isNearLimit ? 'text-error' : 'text-text-secondary'
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Character Counter for regular input */}
        {showCharCount && maxLength && !multiline && (
          <div
            id={counterId}
            className={`text-xs mt-1 text-right ${
              isNearLimit ? 'text-error' : 'text-text-secondary'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount}/{maxLength}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p 
            id={errorId}
            className="text-error text-xs mt-1 flex items-center"
            role="alert"
            aria-live="assertive"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p 
            id={helperId}
            className="text-text-secondary text-xs mt-1"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
