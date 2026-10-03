import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ================================================================
 * ESO — THE BLACK VAULT
 * CinematicHero
 *
 * Design:
 * - Editorial / cinematic / archival
 * - Dark atmospheric environment
 * - Organic 2 / 3 / 2 digital sticky-note wall
 * - Earth / parchment / coffee / chocolate palette
 * - Fully responsive
 * ================================================================
 */

/* ================================================================
   VIDEO COMPONENT
   ================================================================ */

const ArchiveVideo = memo(function ArchiveVideo({
  frame,
  className = '',
  priority = false,
}) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;
    if (!video) return;

    video.load();

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be blocked by the browser.
      });
    }
  }, [isVisible, frame.id]);

  return (
    <video
      ref={videoRef}
      key={frame.id}
      className={className}
      autoPlay={priority}
      muted
      loop
      playsInline
      preload={priority ? 'auto' : 'none'}
      poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    >
      {isVisible && (
        <>
          <source src={frame.video} type="video/mp4" />
          <source src={frame.mobileVideo} type="video/mp4" />
        </>
      )}
    </video>
  );
});

/* ================================================================
   STICKY NOTE PALETTE
   ================================================================ */

const NOTE_STYLES = [
  {
    surface: '#211b16',
    accent: '#b59a76',
    text: '#d5c1a1',
    border: 'rgba(181,154,118,0.28)',
    shadow: 'rgba(181,154,118,0.10)',
  },
  {
    surface: '#241b16',
    accent: '#9b7355',
    text: '#c7a68a',
    border: 'rgba(155,115,85,0.30)',
    shadow: 'rgba(155,115,85,0.10)',
  },
  {
    surface: '#1d1b18',
    accent: '#b2a18a',
    text: '#d1c2aa',
    border: 'rgba(178,161,138,0.26)',
    shadow: 'rgba(178,161,138,0.08)',
  },
  {
    surface: '#211815',
    accent: '#a67c5b',
    text: '#cdb096',
    border: 'rgba(166,124,91,0.30)',
    shadow: 'rgba(166,124,91,0.10)',
  },
  {
    surface: '#211e19',
    accent: '#8f806c',
    text: '#c0ae94',
    border: 'rgba(143,128,108,0.28)',
    shadow: 'rgba(143,128,108,0.09)',
  },
  {
    surface: '#201714',
    accent: '#7f5d47',
    text: '#b89579',
    border: 'rgba(127,93,71,0.32)',
    shadow: 'rgba(127,93,71,0.10)',
  },
  {
    surface: '#211c17',
    accent: '#aa9270',
    text: '#d0bda0',
    border: 'rgba(170,146,112,0.30)',
    shadow: 'rgba(170,146,112,0.10)',
  },
];

/* ================================================================
   DESKTOP WALL POSITIONS
   ================================================================

   Intentionally NOT a grid.

   Composition:

       01              02

          03      04          05

       06                 07

   Each note has independent x/y/rotation.
   ================================================================ */

const DESKTOP_NOTE_LAYOUT = [
  {
    left: '1%',
    top: 4,
    rotate: -2.5,
  },
  {
    left: '51%',
    top: 24,
    rotate: 2.2,
  },

  {
    left: '7%',
    top: 116,
    rotate: 1.7,
  },
  {
    left: '40%',
    top: 101,
    rotate: -2.2,
  },
  {
    left: '69%',
    top: 137,
    rotate: 2.8,
  },

  {
    left: '2%',
    top: 247,
    rotate: -1.8,
  },
  {
    left: '51%',
    top: 272,
    rotate: 2.1,
  },
];

/* ================================================================
   MOBILE WALL POSITIONS
   ================================================================ */

const MOBILE_NOTE_LAYOUT = [
  {
    left: '2%',
    top: 4,
    rotate: -2.2,
  },
  {
    left: '52%',
    top: 20,
    rotate: 2,
  },

  {
    left: '9%',
    top: 91,
    rotate: 1.5,
  },
  {
    left: '40%',
    top: 105,
    rotate: -2,
  },
  {
    left: '69%',
    top: 88,
    rotate: 2.4,
  },

  {
    left: '3%',
    top: 193,
    rotate: -1.8,
  },
  {
    left: '52%',
    top: 215,
    rotate: 2,
  },
];

/* ================================================================
   STICKY NOTE
   ================================================================ */

function VaultNote({
  frame,
  index,
  active,
  layout,
  onSelect,
  mobile = false,
}) {
  const style = NOTE_STYLES[index];

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`View ${frame.title}`}
      className={`
        group absolute
        z-10
        w-[102px]
        sm:w-[108px]
        ${active ? 'z-40' : 'hover:z-30'}
        focus:outline-none
      `}
      style={{
        left: layout.left,
        top: `${layout.top}px`,
        transform: `rotate(${layout.rotate}deg)`,
      }}
    >
      {/* ==========================================================
          PIN
          ========================================================== */}

      <span
        className="
          absolute
          -top-[5px]
          left-1/2
          z-30
          h-[8px]
          w-[8px]
          -translate-x-1/2
          rounded-full
        "
        style={{
          backgroundColor: style.accent,
          boxShadow: `
            0 1px 3px rgba(0,0,0,.8),
            0 0 0 1px rgba(0,0,0,.35)
          `,
        }}
      />

      {/* tiny shadow beneath pin */}
      <span
        className="
          pointer-events-none
          absolute
          -top-[1px]
          left-1/2
          z-20
          h-[7px]
          w-[7px]
          -translate-x-1/2
          rounded-full
          bg-black/50
          blur-[2px]
        "
      />

      {/* ==========================================================
          NOTE BODY
          ========================================================== */}

      <div
        className="
          relative
          h-[55px]
          w-full
          overflow-hidden
          rounded-[7px]
          border
          backdrop-blur-xl
          transition-all
          duration-500
          ease-out
          group-hover:-translate-y-[2px]
        "
        style={{
          backgroundColor: style.surface,
          borderColor: active
            ? style.accent
            : style.border,

          boxShadow: active
            ? `
              0 12px 28px rgba(0,0,0,.58),
              0 0 0 1px ${style.accent}22,
              0 0 22px ${style.shadow}
            `
            : `
              0 9px 22px rgba(0,0,0,.48),
              0 2px 4px rgba(0,0,0,.55)
            `,
        }}
      >
        {/* ========================================================
            SOFT PAPER-LIKE DIGITAL LIGHT
            ======================================================== */}

        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(
                circle at 82% 18%,
                ${style.accent}12,
                transparent 40%
              )
            `,
          }}
        />

        {/* ========================================================
            TOP EDGE / AGED HIGHLIGHT
            ======================================================== */}

        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-px opacity-50"
          style={{
            background: `linear-gradient(
              90deg,
              transparent,
              ${style.accent}55,
              transparent
            )`,
          }}
        />

        {/* ========================================================
            LEFT ACCENT
            ======================================================== */}

        <div
          className="absolute bottom-0 left-0 top-0 w-[2px]"
          style={{
            backgroundColor: style.accent,
            opacity: active ? 0.9 : 0.65,
          }}
        />

        {/* ========================================================
            CONTENT
            ======================================================== */}

        <div className="relative flex h-full flex-col justify-center px-3">
          <div className="mb-[3px] flex items-center gap-2">
            <span
              className="
                font-mono
                text-[7px]
                font-medium
                tracking-[0.16em]
              "
              style={{
                color: active
                  ? style.accent
                  : `${style.accent}99`,
              }}
            >
              {frame.number}
            </span>

            {/* tiny horizontal archival mark */}
            <span
              className="h-px w-4 opacity-30"
              style={{
                backgroundColor: style.accent,
              }}
            />
          </div>

          <span
            className="
              block
              truncate
              font-serif
              text-[10px]
              italic
              leading-none
              tracking-[0.055em]
              transition-colors
              duration-300
            "
            style={{
              color: active
                ? style.text
                : `${style.text}cc`,
            }}
          >
            {frame.shortTitle}
          </span>
        </div>

        {/* ========================================================
            ACTIVE WASH
            ======================================================== */}

        {active && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  ${style.accent}08,
                  transparent 55%
                )
              `,
            }}
          />
        )}

        {/* ========================================================
            BOTTOM IMPERFECTION / ARTISTIC MARK
            ======================================================== */}

        <span
          className="pointer-events-none absolute bottom-[5px] right-[7px] h-px w-3 opacity-20"
          style={{
            backgroundColor: style.accent,
          }}
        />
      </div>
    </button>
  );
}

/* ================================================================
   STICKY NOTE WALL
   ================================================================ */

function VaultNoteWall({
  frames,
  activeEntry,
  selectEntry,
  mobile = false,
}) {
  const layout = mobile
    ? MOBILE_NOTE_LAYOUT
    : DESKTOP_NOTE_LAYOUT;

  return (
    <div
      className={`
        relative
        ${mobile
          ? 'h-[280px] w-full max-w-[330px] mx-auto'
          : 'h-[350px] w-[315px]'
        }
      `}
    >
      {/* ==========================================================
          VERY SUBTLE WALL GUIDE
          ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[4%]
          top-[6px]
          h-[320px]
          w-px
          bg-white/[0.025]
        "
      />

      {/* tiny archival marks */}
      <div className="pointer-events-none absolute left-0 top-0 h-px w-8 bg-white/[0.07]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-px w-8 bg-white/[0.05]" />

      {/* ==========================================================
          NOTES
          ========================================================== */}

      {frames.map((frame, index) => (
        <VaultNote
          key={frame.id}
          frame={frame}
          index={index}
          active={index === activeEntry}
          layout={layout[index]}
          onSelect={selectEntry}
          mobile={mobile}
        />
      ))}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

function CinematicHero() {
  const navigate = useNavigate();

  const [activeEntry, setActiveEntry] = useState(6);

  /* ================================================================
     FRAME DATA
     ================================================================ */

  const frames = [
    {
      id: 'welcome',
      number: '01',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'THE MEMORY PALACE',
      shortTitle: 'MEMORY',
      tagline: 'Rooms of memory.',
      quote:
        'In the architecture of remembrance, we build who we become.',
      highlightWords: ['architecture', 'become'],
      description:
        'A space for introspection and personal history',
    },
    {
      id: 'dark-confession',
      number: '02',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4',
      title: 'CONFESSION',
      shortTitle: 'CONFESSION',
      tagline: 'Things left unsaid.',
      quote:
        'The weight we carry is lighter when shared in whispers.',
      highlightWords: ['weight', 'whispers'],
      description:
        'Release your burdens without judgment',
    },
    {
      id: 'dark-understanding',
      number: '03',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4',
      title: 'UNDERSTANDING',
      shortTitle: 'UNDERSTANDING',
      tagline: 'A shared darkness.',
      quote:
        'To be understood is to find another who speaks the language of your silence.',
      highlightWords: ['language', 'silence'],
      description:
        'Connect with those who truly understand',
    },
    {
      id: 'fantasy-daydream',
      number: '04',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4',
      title: 'IMAGINATION',
      shortTitle: 'IMAGINATION',
      tagline: 'Beyond imagination.',
      quote:
        'Reality is merely the canvas; imagination paints what could be.',
      highlightWords: ['canvas', 'paints'],
      description:
        'Explore worlds beyond the ordinary',
    },
    {
      id: 'fantasy-vibes',
      number: '05',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4',
      title: 'VIBES',
      shortTitle: 'VIBES',
      tagline: 'A space for anything.',
      quote:
        'Between structure and chaos lies the frequency of authentic being.',
      highlightWords: ['frequency', 'authentic'],
      description:
        'Flow freely in unstructured expression',
    },
    {
      id: 'philo-questioning',
      number: '06',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4',
      title: 'QUESTIONING',
      shortTitle: 'QUESTIONING',
      tagline: 'Questions without answers.',
      quote:
        'The mind that asks is forever more alive than one that accepts.',
      highlightWords: ['alive', 'accepts'],
      description:
        'Challenge everything, seek deeper truth',
    },
    {
      id: 'philo-truth',
      number: '07',
      video:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      mobileVideo:
        'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4',
      title: 'TRUTH',
      shortTitle: 'TRUTH',
      tagline: 'Where mystery begins.',
      quote:
        'Truth is not found in certainty, but in the courage to remain uncertain.',
      highlightWords: ['courage', 'uncertain'],
      description:
        'Embrace the uncomfortable realities',
    },
  ];

  const active = frames[activeEntry];

  /* ================================================================
     NAVIGATION
     ================================================================ */

  const selectEntry = useCallback((index) => {
    setActiveEntry(index);
  }, []);

  /* ================================================================
     KEYBOARD NAVIGATION
     ================================================================ */

  useEffect(() => {
    let timeout = null;

    const handleKeyPress = (event) => {
      if (timeout) return;

      if (event.key === 'ArrowLeft') {
        setActiveEntry((previous) =>
          previous > 0 ? previous - 1 : frames.length - 1
        );

        timeout = setTimeout(() => {
          timeout = null;
        }, 300);
      }

      if (event.key === 'ArrowRight') {
        setActiveEntry((previous) =>
          previous < frames.length - 1 ? previous + 1 : 0
        );

        timeout = setTimeout(() => {
          timeout = null;
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [frames.length]);

  /* ================================================================
     WHEEL NAVIGATION
     ================================================================ */

  useEffect(() => {
    let lastCall = 0;
    const throttleDelay = 900;

    const handleWheel = (event) => {
      const now = Date.now();

      if (now - lastCall < throttleDelay) {
        return;
      }

      if (Math.abs(event.deltaY) <= 30) {
        return;
      }

      event.preventDefault();

      lastCall = now;

      if (event.deltaY > 0) {
        setActiveEntry((previous) =>
          previous < frames.length - 1 ? previous + 1 : 0
        );
      } else {
        setActiveEntry((previous) =>
          previous > 0 ? previous - 1 : frames.length - 1
        );
      }
    };

    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [frames.length]);

  /* ================================================================
     QUOTE HIGHLIGHT
     ================================================================ */

  const renderQuote = (quote, highlightWords) => {
    if (!highlightWords?.length) {
      return quote;
    }

    const escapedWords = highlightWords
      .map((word) =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      )
      .join('|');

    const regex = new RegExp(`(${escapedWords})`, 'gi');

    const parts = quote.split(regex);

    return parts.map((part, index) => {
      const isHighlighted = highlightWords.some(
        (word) => word.toLowerCase() === part.toLowerCase()
      );

      if (isHighlighted) {
        return (
          <span
            key={index}
            className="
              font-semibold
              text-[#a9896c]
              drop-shadow-[0_0_10px_rgba(169,137,108,0.18)]
            "
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#050505]
        text-[#e8e5dc]
        selection:bg-[#8f252b]/30
      "
    >
      {/* ============================================================
          ATMOSPHERE
          ============================================================ */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]" />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_65%_45%,rgba(120,85,55,0.045),transparent_38%)]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_12%_72%,rgba(155,120,80,0.025),transparent_30%)]
          "
        />

        {/* grain */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.8'/%3E%3C/svg%3E\")",
          }}
        />

        {/* scanlines */}
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.01)_50%,transparent_51%)]
            bg-[length:100%_8px]
            opacity-25
          "
        />
      </div>

      {/* ============================================================
          MAIN
          ============================================================ */}

      <section
        className="
          relative
          z-10
          px-4
          py-8
          sm:px-7
          sm:py-10
          lg:px-12
          xl:px-14
        "
      >
        <div
          className="
            mx-auto
            max-w-[1750px]

            /* MOBILE */
            flex
            flex-col

            /* DESKTOP */
            lg:grid
            lg:min-h-[calc(100vh-120px)]
            lg:grid-cols-[330px_minmax(240px,0.72fr)_minmax(540px,1.8fr)_78px]
            lg:gap-3

            xl:grid-cols-[350px_minmax(270px,0.72fr)_minmax(620px,1.8fr)_88px]
            xl:gap-4
          "
        >
          {/* ========================================================
              MOBILE NOTE WALL
              ======================================================== */}

          <div className="mb-7 lg:hidden">
            <div className="mb-5">
              <span
                className="
                  font-mono
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#c2b6a4]
                "
              >
                VAULT INDEX
              </span>

              <div className="mt-2 h-px w-14 bg-[#9a795e]/35" />
            </div>

            <VaultNoteWall
              frames={frames}
              activeEntry={activeEntry}
              selectEntry={selectEntry}
              mobile
            />
          </div>

          {/* ========================================================
              COLUMN 01 — DESKTOP NOTE WALL
              ======================================================== */}

          <aside className="hidden lg:block">
            <div className="pt-16 xl:pt-20">
              <div className="mb-5">
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#c2b6a4]
                  "
                >
                  VAULT INDEX
                </span>

                <div className="mt-2 h-px w-16 bg-[#9a795e]/35" />
              </div>

              <VaultNoteWall
                frames={frames}
                activeEntry={activeEntry}
                selectEntry={selectEntry}
              />
            </div>
          </aside>

          {/* ========================================================
              COLUMN 02 — EDITORIAL IDENTITY
              ======================================================== */}

          <div
            className="
              relative
              flex
              flex-col
              justify-center
              pt-2
              sm:pt-5
              lg:pt-14
            "
          >
            <div className="mb-4 sm:mb-6">
              <span
                className="
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[0.24em]
                  text-[#655f58]
                "
              >
                {active.number}
              </span>
            </div>

            <h1
              key={active.title}
              className="
                max-w-[400px]
                font-serif
                text-[30px]
                font-normal
                leading-[0.92]
                tracking-[-0.055em]
                text-[#e8e5dc]

                sm:text-[38px]

                md:text-[42px]

                lg:text-[35px]

                xl:text-[47px]
              "
            >
              {active.title}
            </h1>

            <p
              className="
                mt-4
                max-w-[280px]
                font-sans
                text-[9px]
                uppercase
                leading-[1.9]
                tracking-[0.16em]
                text-[#81786e]

                sm:mt-6
              "
            >
              {active.tagline}
            </p>
          </div>

          {/* ========================================================
              COLUMN 03 — VIDEO
              ======================================================== */}

          <div
            className="
              relative
              mt-8
              flex
              min-h-[320px]
              items-center
              justify-center

              sm:mt-10
              sm:min-h-[430px]

              md:min-h-[500px]

              lg:mt-0
              lg:min-h-0
            "
          >
            <div className="group relative w-full overflow-hidden bg-[#090909]">
              {/* VIDEO */}

              <div className="aspect-[16/10] w-full">
                <ArchiveVideo
                  frame={active}
                  priority
                  className="
                    h-full
                    w-full
                    object-cover
                    grayscale-[8%]
                    contrast-[1.08]
                    brightness-[0.82]
                    saturate-[0.78]
                  "
                />
              </div>

              {/* ====================================================
                  QUOTE
                  ==================================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-10
                  flex
                  items-center
                  justify-center
                  px-4

                  sm:px-8
                "
              >
                <div
                  className="
                    relative
                    max-w-[88%]
                    text-center

                    sm:max-w-[82%]
                  "
                >
                  {/* opening quote */}
                  <span
                    className="
                      absolute
                      -left-4
                      -top-3
                      font-serif
                      text-4xl
                      leading-none
                      text-[#9d7658]/65
                      drop-shadow-[0_2px_8px_rgba(0,0,0,.8)]

                      sm:-left-6
                      sm:-top-4
                      sm:text-5xl

                      lg:-left-8
                      lg:-top-6
                      lg:text-6xl
                    "
                  >
                    "
                  </span>

                  <p
                    className="
                      font-serif
                      text-[13px]
                      font-bold
                      leading-[1.7]
                      tracking-wide
                      text-white
                      drop-shadow-[0_2px_12px_rgba(0,0,0,.9)]

                      sm:text-[15px]

                      md:text-[17px]

                      lg:text-[19px]
                    "
                    style={{
                      textShadow:
                        '0 0 20px rgba(0,0,0,.8), 0 0 40px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,1)',
                    }}
                  >
                    {renderQuote(
                      active.quote,
                      active.highlightWords
                    )}
                  </p>

                  {/* closing quote */}
                  <span
                    className="
                      absolute
                      -bottom-3
                      -right-4
                      font-serif
                      text-4xl
                      leading-none
                      text-[#9d7658]/65
                      drop-shadow-[0_2px_8px_rgba(0,0,0,.8)]

                      sm:-bottom-4
                      sm:-right-6
                      sm:text-5xl

                      lg:-bottom-6
                      lg:-right-8
                      lg:text-6xl
                    "
                  >
                    "
                  </span>
                </div>
              </div>

              {/* VIGNETTE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.55)_100%)]
                "
              />

              {/* ARCHIVAL EDGE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  border
                  border-white/[0.11]
                "
              />

              {/* ENTER */}

              <button
                type="button"
                onClick={() => navigate('/login')}
                aria-label={`Enter ${active.title}`}
                className="
                  absolute
                  inset-0
                  z-20
                  cursor-pointer
                "
              >
                <span className="sr-only">
                  Enter {active.title}
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================
              COLUMN 04 — FILM STRIP
              ======================================================== */}

          <aside className="hidden lg:flex">
            <div
              className="
                relative
                flex
                h-[500px]
                w-full
                flex-col
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  w-px
                  bg-white/[0.07]
                "
              />

              <div className="flex h-full flex-col gap-[5px] pl-3">
                {frames.map((frame, index) => {
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => selectEntry(index)}
                      aria-label={`Select ${frame.title}`}
                      className="
                        group
                        relative
                        min-h-0
                        flex-1
                        overflow-hidden
                        text-left
                      "
                    >
                      <ArchiveVideo
                        frame={frame}
                        className={`
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          grayscale
                          transition-all
                          duration-700
                          ${
                            isActive
                              ? 'scale-100 opacity-80'
                              : 'scale-[1.08] opacity-20 group-hover:scale-100 group-hover:opacity-55'
                          }
                        `}
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/40
                          transition-opacity
                          duration-500
                          group-hover:bg-black/20
                        "
                      />

                      <span
                        className={`
                          relative
                          z-10
                          float-right
                          mr-2
                          mt-2
                          font-mono
                          text-[7px]
                          ${
                            isActive
                              ? 'text-white/80'
                              : 'text-white/30 group-hover:text-white/70'
                          }
                        `}
                      >
                        {frame.number}
                      </span>

                      {isActive && (
                        <span
                          className="
                            absolute
                            bottom-2
                            left-3
                            z-10
                            h-[2px]
                            w-5
                            bg-[#9d7658]
                          "
                        />
                      )}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          flex
                          h-full
                          flex-col
                          justify-around
                          py-1
                        "
                      >
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <span
                            key={dot}
                            className="
                              h-1
                              w-1
                              rounded-full
                              bg-white/20
                            "
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ==========================================================
            BOTTOM AREA
            ========================================================== */}

        <div
          className="
            mx-auto
            mt-8
            flex
            max-w-[1750px]
            flex-col
            items-center
            justify-between
            gap-8

            sm:mt-12

            md:flex-row
            md:items-end

            lg:-mt-28
          "
        >
          {/* ========================================================
              VAULT ACCESS CARD
              ======================================================== */}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              group
              relative
              hidden
              h-[160px]
              w-[260px]
              rotate-[-2deg]
              overflow-hidden
              border
              border-[#d8d2c2]/15
              bg-[#0d0c0b]
              p-7
              shadow-[0_40px_90px_rgba(0,0,0,.8)]
              transition-all
              duration-500

              hover:rotate-0
              hover:border-[#9d7658]/30

              md:block
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[repeating-linear-gradient(0deg,transparent,transparent_5px,rgba(255,255,255,.018)_6px)]
              "
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.24em]
                    text-[#70675e]
                  "
                >
                  ESO — VAULT
                </span>

                <span className="font-mono text-[9px] text-[#4d4742]">
                  {active.number}
                </span>
              </div>

              <div
                className="
                  mt-6
                  font-serif
                  text-[26px]
                  leading-none
                  tracking-tight
                  text-[#c4bfb5]
                "
              >
                {active.shortTitle}
              </div>

              <p
                className="
                  mt-3
                  text-[9px]
                  leading-[1.6]
                  tracking-wide
                  text-[#6b625b]
                "
              >
                {active.description}
              </p>

              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  border-b
                  border-[#9d7658]/40
                  pb-1
                  transition-all
                  duration-300
                  group-hover:border-[#9d7658]
                "
              >
                <span
                  className="
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.18em]
                    text-[#9d7658]/80
                  "
                >
                  Enter Vault
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#9d7658]/80
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </div>
            </div>
          </button>

          {/* ========================================================
              EXPLORE
              ======================================================== */}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              group
              flex
              items-center
              gap-4

              sm:gap-5

              md:ml-auto

              lg:ml-[340px]
            "
          >
            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.26em]
                text-[#716961]
                transition-colors
                duration-500
                group-hover:text-[#d8d4ca]
              "
            >
              Explore the Vault
            </span>

            <span className="relative flex w-14 items-center sm:w-16">
              <span
                className="
                  h-px
                  w-full
                  bg-[#4c4944]
                  transition-all
                  duration-700
                  group-hover:bg-[#9d7658]
                "
              />

              <span
                className="
                  absolute
                  right-0
                  font-mono
                  text-[13px]
                  text-[#716961]
                  transition-all
                  duration-700
                  group-hover:translate-x-1
                  group-hover:text-[#e8e5dc]
                "
              >
                →
              </span>
            </span>
          </button>

          <div className="hidden w-[185px] lg:block" />
        </div>
      </section>
    </main>
  );
}

export default CinematicHero;