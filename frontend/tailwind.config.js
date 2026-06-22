/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Mono', 'Space Mono', 'Courier New', 'monospace'],
        mono: ['Geist Mono', 'Space Mono', 'Courier New', 'monospace'],
        display: ['Space Mono', 'Geist Mono', 'monospace'],
      },
      colors: {
        // Dark theme colors - Pure black and white monochrome aesthetic for Eso
        primary: {
          bg: '#000000',
          secondary: '#0a0a0a',
          elevated: '#141414',
          contrast: '#1f1f1f',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#666666',
        },
        accent: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
        },
        tag: {
          bg: '#1a1a1a',
          hover: '#2a2a2a',
        },
        border: '#333333',
        success: '#ffffff',
        error: '#ff4444',
        warning: '#ffaa00',
      },
      backdropBlur: {
        md: '12px',
      },
      scale: {
        98: '0.98',
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInPage: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        staggerFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-100px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-in-right': 'slideInRight 400ms ease-out',
        'fade-in-page': 'fadeInPage 150ms ease-in-out',
        'stagger-fade-in': 'staggerFadeIn 300ms ease-out',
        'float-up': 'floatUp 2s ease-out forwards',
        'scale-in': 'scaleIn 300ms ease-out',
        'fade-in-out': 'fadeInOut 3s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Responsive font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - desktop
        'base-mobile': ['0.875rem', { lineHeight: '1.25rem' }], // 14px - mobile
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      },
      // Minimum touch target sizes for mobile
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
    },
    // Responsive breakpoints (matching requirements)
    screens: {
      'sm': '640px',
      'md': '768px',   // Tablet starts here
      'lg': '1024px',  // Desktop starts here
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
};
