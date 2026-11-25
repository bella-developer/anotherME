import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { selectAuth } from '../features/authSlice';

const TOUR_STEPS = [
  {
    id: 'rooms',
    selector: '[data-tour="rooms"]',
    placement: 'rooms',
    title: 'The Rooms',
    description: 'Enter Dark, Fantasy, or Philo rooms to read and share anonymously.',
  },
  {
    id: 'circles',
    selector: '[data-tour="circles"]',
    fallbackSelector: '[data-tour="mobile-menu"]',
    placement: 'bottom',
    title: 'Circles',
    description: 'Join intimate topic discussions and reply with text, emojis, or media.',
  },
  {
    id: 'create',
    selector: '[data-tour="create"]',
    fallbackSelector: '[data-tour="mobile-menu"]',
    placement: 'bottom',
    title: 'Create',
    description: 'Publish a thought, confession, or visual post into any room.',
  },
  {
    id: 'audio',
    selector: '[data-tour="audio-dock"]',
    placement: 'top',
    title: 'Soundscape',
    description: 'Toggle ambient Rain, Fireplace, or Wind audio while you browse.',
  },
  {
    id: 'profile',
    selector: '[data-tour="profile"]',
    fallbackSelector: '[data-tour="mobile-menu"]',
    placement: 'bottom',
    title: 'Profile & Vault',
    description: 'View your saved bookmarks, drafts, and activity in one place.',
  },
];

const CARD_WIDTH = 248;
const VIEWPORT_PAD = 12;

function getVisibleRect(selector, fallbackSelector) {
  if (typeof document === 'undefined') return null;
  const primary = selector ? document.querySelector(selector) : null;
  if (primary) {
    const r = primary.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return r;
  }
  const fallback = fallbackSelector ? document.querySelector(fallbackSelector) : null;
  if (fallback) {
    const r = fallback.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return r;
  }
  return null;
}

/**
 * First-time user guided tour displayed on the Home page after login.
 */
function HomeTour() {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [layout, setLayout] = useState({ top: 90, left: 16, highlight: null });
  const cardRef = useRef(null);

  const storageKey = `eso_home_tour_v1_${user?.id || user?.username || 'user'}`;

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    try {
      if (localStorage.getItem(storageKey) === 'done') return undefined;
    } catch {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStepIndex(0);
      setActive(true);
    }, 850);

    return () => clearTimeout(timer);
  }, [isAuthenticated, storageKey]);

  const updatePosition = useCallback(() => {
    if (!active) return;
    const step = TOUR_STEPS[stepIndex];
    if (!step) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardHeight = cardRef.current?.offsetHeight || 124;
    const rect = getVisibleRect(step.selector, step.fallbackSelector);

    if (!rect) {
      setLayout({
        top: Math.max(VIEWPORT_PAD, vh - cardHeight - 76),
        left: Math.max(VIEWPORT_PAD, (vw - CARD_WIDTH) / 2),
        highlight: null,
      });
      return;
    }

    let left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    let top = rect.bottom + 12;

    if (step.placement === 'top') {
      top = rect.top - cardHeight - 12;
      left = rect.right - CARD_WIDTH;
    } else if (step.placement === 'rooms') {
      top = Math.min(rect.top + 16, vh - cardHeight - VIEWPORT_PAD);
      left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    }

    const clampedLeft = Math.max(VIEWPORT_PAD, Math.min(left, vw - CARD_WIDTH - VIEWPORT_PAD));
    const clampedTop = Math.max(VIEWPORT_PAD, Math.min(top, vh - cardHeight - VIEWPORT_PAD));

    setLayout({
      top: clampedTop,
      left: clampedLeft,
      highlight: {
        top: Math.max(4, rect.top - 5),
        left: Math.max(4, rect.left - 5),
        width: Math.min(vw - 8, rect.width + 10),
        height: rect.height + 10,
      },
    });
  }, [active, stepIndex]);

  useEffect(() => {
    if (!active) return undefined;
    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [active, updatePosition]);

  const finishTour = useCallback(() => {
    try {
      localStorage.setItem(storageKey, 'done');
    } catch {
      // Ignore storage write errors in private contexts
    }
    setActive(false);
  }, [storageKey]);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishTour();
    }
  };

  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') finishTour();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, finishTour]);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {active && step && (
        <motion.div
          key="home-tour-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[55]"
        >
          {/* Subtle non-blocking highlight outline around the active target */}
          {layout.highlight && (
            <div
              className="pointer-events-none fixed rounded-lg transition-all duration-300"
              style={{
                top: layout.highlight.top,
                left: layout.highlight.left,
                width: layout.highlight.width,
                height: layout.highlight.height,
                border: '1px solid rgba(255, 122, 26, 0.65)',
                boxShadow: '0 0 18px rgba(255, 122, 26, 0.22)',
              }}
              aria-hidden="true"
            />
          )}

          {/* Tiny floating message card */}
          <motion.div
            ref={cardRef}
            key={step.id}
            role="dialog"
            aria-label={`App tour: ${step.title}`}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed z-[60] w-[248px] rounded-xl p-3 font-mono"
            style={{
              top: layout.top,
              left: layout.left,
              backgroundColor: 'rgba(14, 13, 18, 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 14px 38px rgba(0, 0, 0, 0.85), 0 0 22px rgba(255, 122, 26, 0.14)',
            }}
          >
            {/* Header with tiny premium message icon */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-[#FF7A1A]/35 bg-[#FF7A1A]/15 text-[#FF7A1A]"
                  aria-hidden="true"
                >
                  <MessageSquare size={11} strokeWidth={2.2} />
                </span>
                <span className="truncate text-[11px] font-semibold tracking-wide text-[#E7DED5]">
                  {step.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[9px] tabular-nums text-[#928B91]/70">
                  {stepIndex + 1}/{TOUR_STEPS.length}
                </span>
                <button
                  type="button"
                  onClick={finishTour}
                  className="rounded p-0.5 text-[#928B91]/70 transition-colors hover:bg-white/[0.06] hover:text-[#E7DED5]"
                  aria-label="Close tour"
                  title="Close"
                >
                  <X size={11} />
                </button>
              </div>
            </div>

            {/* Tiny explanation */}
            <p className="mt-2 mb-2.5 text-[10px] leading-relaxed text-[#928B91]">
              {step.description}
            </p>

            {/* Footer with progress dots, skip, and orange Next button */}
            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" aria-hidden="true">
                  {TOUR_STEPS.map((s, idx) => (
                    <span
                      key={s.id}
                      className={`h-1 rounded-full transition-all duration-200 ${
                        idx === stepIndex ? 'w-3 bg-[#FF7A1A]' : 'w-1 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={finishTour}
                  className="text-[9px] uppercase tracking-wider text-[#928B91]/70 transition-colors hover:text-[#E7DED5]"
                >
                  Skip
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: '#FF7A1A',
                  boxShadow: '0 0 12px rgba(255, 122, 26, 0.42)',
                }}
              >
                {isLast ? 'Done' : 'Next'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HomeTour;
