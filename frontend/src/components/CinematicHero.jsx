import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

/* ============================================================================
   ESO — BLACK VAULT
   Premium cinematic landing interfacejust modifiy
   ============================================================================ */

/* ----------------------------------------------------------------------------
   01. SOURCE DATA
   Keep this structure stable.
   Cloudinary is the source of truth for all cinematic media.
   -------------------------------------------------------------------------- */

const FRAMES = [
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
    description: 'A space for introspection and personal history',
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
    description: 'Release your burdens without judgment',
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
    description: 'Connect with those who truly understand',
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
    description: 'Explore worlds beyond the ordinary',
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
    description: 'Flow freely in unstructured expression',
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
    description: 'Challenge everything, seek deeper truth',
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
    description: 'Embrace the uncomfortable realities',
  },
];

/* ----------------------------------------------------------------------------
   02. STICKY NOTE ART DIRECTION

   IMPORTANT:
   These positions are percentages INSIDE the bounded wall.
   They are NOT viewport coordinates.

   Composition:
       01       02

       03   04   05

          06     07
   -------------------------------------------------------------------------- */

const NOTE_LAYOUT = [
  {
    x: 10,
    y: 5,
    rotate: -1.5,
    tone: 'wine',
    icon: 'brain',
  },
  {
    x: 56,
    y: 8,
    rotate: 1.5,
    tone: 'coffee',
    icon: 'eye',
  },
  {
    x: 8,
    y: 38,
    rotate: 0.8,
    tone: 'violet',
    icon: 'diamond',
  },
  {
    x: 42,
    y: 42,
    rotate: -1,
    tone: 'olive',
    icon: 'star',
  },
  {
    x: 76,
    y: 38,
    rotate: 1.2,
    tone: 'ochre',
    icon: 'wave',
  },
  {
    x: 12,
    y: 72,
    rotate: -1.5,
    tone: 'clay',
    icon: 'target',
  },
  {
    x: 58,
    y: 75,
    rotate: 1.8,
    tone: 'burgundy',
    icon: 'compass',
  },
];

/* ----------------------------------------------------------------------------
   03. EARTH-TONE NOTE SYSTEM
   -------------------------------------------------------------------------- */

const NOTE_TONES = {
  wine: {
    background:
      'linear-gradient(145deg, rgba(45,32,32,.95), rgba(28,20,20,.98))',
    border: 'rgba(80,45,45,.50)',
    accent: '#8b2e2e',
    text: '#c9b5a3',
  },

  coffee: {
    background:
      'linear-gradient(145deg, rgba(42,35,28,.96), rgba(26,22,18,.98))',
    border: 'rgba(85,65,45,.48)',
    accent: '#7a3e2e',
    text: '#d4bfa8',
  },

  violet: {
    background:
      'linear-gradient(145deg, rgba(38,32,42,.95), rgba(24,20,28,.98))',
    border: 'rgba(75,60,85,.46)',
    accent: '#6b2e5e',
    text: '#c2b3a5',
  },

  olive: {
    background:
      'linear-gradient(145deg, rgba(40,38,30,.96), rgba(26,24,20,.98))',
    border: 'rgba(80,75,55,.47)',
    accent: '#5e4e2e',
    text: '#c5bda8',
  },

  ochre: {
    background:
      'linear-gradient(145deg, rgba(48,38,28,.96), rgba(30,24,18,.98))',
    border: 'rgba(95,70,45,.49)',
    accent: '#8b5a2e',
    text: '#d1bbaa',
  },

  clay: {
    background:
      'linear-gradient(145deg, rgba(42,35,32,.95), rgba(28,23,21,.98))',
    border: 'rgba(85,68,60,.48)',
    accent: '#7a4e3e',
    text: '#c8b8aa',
  },

  burgundy: {
    background:
      'linear-gradient(145deg, rgba(45,30,32,.96), rgba(28,20,22,.98))',
    border: 'rgba(80,50,55,.49)',
    accent: '#8b2e3e',
    text: '#c7b5a8',
  },
};

/* ----------------------------------------------------------------------------
   04. SMALL ABSTRACT ICONS
   -------------------------------------------------------------------------- */

function NoteIcon({ type, color }) {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.25,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (type === 'brain') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <path
          {...common}
          d="M9.2 5.2A3.2 3.2 0 0 0 6 8.4c0 .4.1.8.2 1.1A3.5 3.5 0 0 0 5 16.2c.7.8 1.7 1.3 2.8 1.4"
        />
        <path
          {...common}
          d="M14.8 5.2A3.2 3.2 0 0 1 18 8.4c0 .4-.1.8-.2 1.1a3.5 3.5 0 0 1 1.2 6.7c-.7.8-1.7 1.3-2.8 1.4"
        />
        <path {...common} d="M12 5v14M8.5 9.5c1 .1 1.8.6 2.2 1.5M15.5 9.5c-1 .1-1.8.6-2.2 1.5M8.5 14.5c1-.1 1.8-.6 2.2-1.5M15.5 14.5c-1-.1-1.8-.6-2.2-1.5" />
      </svg>
    );
  }

  if (type === 'eye') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <path {...common} d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" />
        <circle {...common} cx="12" cy="12" r="2.2" />
      </svg>
    );
  }

  if (type === 'diamond') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <path {...common} d="m12 3 7 9-7 9-7-9 7-9Z" />
        <path {...common} d="m12 7 3.5 5-3.5 5-3.5-5L12 7Z" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <path {...common} d="m12 3 2.1 6.4H21l-5.6 4 2.1 6.4-5.5-4-5.5 4 2.1-6.4-5.6-4h6.9L12 3Z" />
      </svg>
    );
  }

  if (type === 'wave') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <path {...common} d="M2 12c2.5 0 2.5-5 5-5s2.5 10 5 10 2.5-10 5-10 2.5 5 5 5" />
      </svg>
    );
  }

  if (type === 'target') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
        <circle {...common} cx="12" cy="12" r="8" />
        <circle {...common} cx="12" cy="12" r="4" />
        <circle {...common} cx="12" cy="12" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-70">
      <circle {...common} cx="12" cy="12" r="8" />
      <path {...common} d="M12 4v16M4 12h16M15 9l-6 6M15 15 9 9" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
   05. CLOUDINARY VIDEO COMPONENT

   Important:
   - actual <video>
   - Cloudinary source URLs
   - desktop/mobile source selection
   - IntersectionObserver lazy loading
   - priority support for cinematic hero
   -------------------------------------------------------------------------- */

const ArchiveVideo = memo(function ArchiveVideo({
  frame,
  className = '',
  priority = false,
}) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const node = videoRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '180px',
        threshold: 0.01,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;

    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      play();
    } else {
      video.addEventListener('loadeddata', play, {
        once: true,
      });
    }

    return () => {
      video.removeEventListener('loadeddata', play);
    };
  }, [visible, frame.id]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? 'auto' : 'none'}
      aria-hidden="true"
    >
      {visible && (
        <>
          <source
            src={frame.mobileVideo}
            type="video/mp4"
            media="(max-width: 767px)"
          />

          <source
            src={frame.video}
            type="video/mp4"
            media="(min-width: 768px)"
          />

          {/* Safe fallback */}
          <source src={frame.video} type="video/mp4" />
        </>
      )}
    </video>
  );
});

/* ----------------------------------------------------------------------------
   06. QUOTE RENDERER
   -------------------------------------------------------------------------- */

function Quote({ frame }) {
  const parts = [];
  let text = frame.quote;

  frame.highlightWords.forEach((word) => {
    const regex = new RegExp(`(${word})`, 'i');
    const match = text.match(regex);

    if (!match) return;

    const index = match.index;

    parts.push(text.slice(0, index));

    parts.push(
      <span
        key={`${frame.id}-${word}-${index}`}
        className="text-[#b9363f]"
        style={{
          textShadow:
            '0 0 18px rgba(185,54,63,.38)',
        }}
      >
        {match[0]}
      </span>
    );

    text = text.slice(index + match[0].length);
  });

  parts.push(text);

  return <>{parts}</>;
}

/* ----------------------------------------------------------------------------
   07. STICKY NOTE
   -------------------------------------------------------------------------- */

function StickyNote({
  frame,
  index,
  active,
  onSelect,
}) {
  const layout = NOTE_LAYOUT[index];
  const tone = NOTE_TONES[layout.tone];

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Open ${frame.title}`}
      className={[
        'absolute',
        'z-10',
        'w-[115px]',
        'h-[78px]',
        'text-left',
        'transition-[transform,filter,opacity]',
        'duration-500',
        'ease-out',
        'focus:outline-none',
        'focus-visible:ring-1',
        'focus-visible:ring-[#8b2e2e]',
        active
          ? 'z-30 scale-[1.04] brightness-[1.08]'
          : 'hover:z-20 hover:scale-[1.02] hover:brightness-[1.04]',
      ].join(' ')}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: `rotate(${layout.rotate}deg)`,
      }}
    >
      {/* Pin - blood-red, plugged into center */}
      <span
        className="absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2"
        style={{
          filter: 'drop-shadow(0 2px 6px rgba(139,46,46,.75))',
        }}
      >
        <span
          className="block h-[9px] w-[9px] rounded-full"
          style={{
            background: 'linear-gradient(145deg, #a83838, #6b1f1f)',
            boxShadow: '0 0 8px rgba(168,56,56,.85), inset 0 1px 2px rgba(255,255,255,.15)',
          }}
        />
      </span>

      {/* Note body - dark aesthetic */}
      <span
        className="absolute inset-0 overflow-hidden rounded-[3px] border"
        style={{
          background: tone.background,
          borderColor: active
            ? tone.accent
            : tone.border,
          boxShadow: active
            ? `0 12px 32px rgba(0,0,0,.70), 0 0 16px ${tone.accent}25`
            : '0 10px 28px rgba(0,0,0,.60)',
        }}
      >
        {/* Darker paper texture */}
        <span
          className="absolute inset-0 opacity-[.08]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,.08), transparent 45%)',
          }}
        />

        {/* Title - centered, no number */}
        <span
          className="absolute inset-x-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-center font-display text-[11px] uppercase tracking-[.08em] leading-tight"
          style={{
            color: active ? '#e5d8c8' : tone.text,
            textShadow: '0 1px 3px rgba(0,0,0,.50)',
          }}
        >
          {frame.shortTitle}
        </span>

        {/* Active indicator - blood-red glow */}
        {active && (
          <span
            className="absolute bottom-0 left-0 h-[2px] w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #a83838, transparent)',
              boxShadow: '0 0 12px rgba(168,56,56,.85)',
            }}
          />
        )}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------------------
   08. MAIN COMPONENT
   -------------------------------------------------------------------------- */

export default function CinematicHero() {
  const navigate = useNavigate();

  const [activeEntry, setActiveEntry] = useState(1);

  const active = FRAMES[activeEntry];

  const selectEntry = useCallback((index) => {
    setActiveEntry(index);
  }, []);

  const next = useCallback(() => {
    setActiveEntry((current) =>
      current === FRAMES.length - 1 ? 0 : current + 1
    );
  }, []);

  const previous = useCallback(() => {
    setActiveEntry((current) =>
      current === 0 ? FRAMES.length - 1 : current - 1
    );
  }, []);

  /* --------------------------------------------------------------------------
     Keyboard navigation
     ------------------------------------------------------------------------ */

  useEffect(() => {
    let locked = false;

    const onKeyDown = (event) => {
      if (locked) return;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        locked = true;
        next();
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        locked = true;
        previous();
      }

      if (locked) {
        window.setTimeout(() => {
          locked = false;
        }, 280);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [next, previous]);

  /* --------------------------------------------------------------------------
     Wheel navigation
     ------------------------------------------------------------------------ */

  useEffect(() => {
    let lastWheel = 0;

    const onWheel = (event) => {
      const now = Date.now();

      if (now - lastWheel < 700) return;

      if (Math.abs(event.deltaY) < 25) return;

      lastWheel = now;

      if (event.deltaY > 0) {
        next();
      } else {
        previous();
      }
    };

    window.addEventListener('wheel', onWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, [next, previous]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#e7e0d4]">
      {/* ======================================================================
          ATMOSPHERE
          ==================================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Black base */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Warm central haze */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 56% 48%, rgba(93,58,35,.08), transparent 32%), radial-gradient(circle at 12% 65%, rgba(101,75,49,.035), transparent 27%)',
          }}
        />

        {/* Very subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.65) 100%)',
          }}
        />

        {/* Fine grain */}
        <div
          className="absolute inset-0 opacity-[.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.75'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Fine horizontal scan lines */}
        <div
          className="absolute inset-0 opacity-[.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 4px, rgba(255,255,255,.25) 5px)',
          }}
        />
      </div>

      {/* ======================================================================
          CONTENT
          ==================================================================== */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-[1460px] items-center px-12 py-12 sm:px-14 lg:px-16 xl:px-18">
        <div
          className="
            grid
            w-full
            items-center
            gap-x-8
            lg:grid-cols-[380px_minmax(560px,1fr)_110px]
            xl:grid-cols-[400px_minmax(620px,1fr)_115px]
          "
        >
          {/* ==================================================================
              COLUMN 01 — STICKY WALL
              ================================================================== */}

          <aside className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-[380px]">
              {/* Section heading */}
              <div className="mb-5 mt-6 pl-1">
                <div className="font-mono text-[9px] font-medium uppercase tracking-[.32em] text-[#b5a99a]">
                  Sacred Home of ...
                </div>

                <div className="mt-3 h-px w-20 bg-[#9b343a]/60" />
              </div>

              {/* BOUNDED WALL - Properly sized for compact centered layout */}
              <div className="relative h-[360px] w-full overflow-visible">
                {/* Decorative wall shadow */}
                <div
                  className="pointer-events-none absolute inset-[4%_3%]"
                  style={{
                    background:
                      'radial-gradient(ellipse, rgba(109,74,48,.08), transparent 68%)',
                    filter: 'blur(18px)',
                  }}
                />

                {FRAMES.map((frame, index) => (
                  <StickyNote
                    key={frame.id}
                    frame={frame}
                    index={index}
                    active={index === activeEntry}
                    onSelect={selectEntry}
                  />
                ))}
              </div>

              {/* VAULT ACCESS CARD - Landscape flat design, properly sized */}
              <div className="mt-5 w-full">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="
                    group
                    relative
                    mx-auto
                    h-[95px]
                    w-full
                    max-w-[340px]
                    -rotate-[0.8deg]
                    overflow-hidden
                    border
                    border-[#9b8066]/20
                    bg-[#0b0a09]
                    px-6
                    py-4
                    text-left
                    shadow-[0_20px_55px_rgba(0,0,0,.50)]
                    transition-all
                    duration-500
                    hover:rotate-0
                    hover:border-[#a9363d]/35
                  "
                >
                  <span
                    className="absolute inset-0 opacity-[.1]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[7px] uppercase tracking-[.28em] text-[#70685f]">
                        ESO — VAULT
                      </span>

                      <span className="font-mono text-[7px] text-[#4f4943]">
                        {active.number}
                      </span>
                    </div>

                    <div className="mt-3 font-display text-[19px] uppercase tracking-[.05em] leading-tight text-[#c9c0b4]">
                      {active.shortTitle}
                    </div>

                    <div className="mt-2 font-mono text-[7px] uppercase tracking-[.16em] text-[#5d5750]">
                      {active.tagline}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-mono text-[7px] uppercase tracking-[.18em] text-[#a9363d]">
                        Enter Vault
                      </span>

                      <span className="text-[10px] text-[#a9363d] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* ==================================================================
              COLUMN 02 — CINEMATIC VIDEO
              ================================================================== */}

          <section className="relative hidden min-w-0 lg:block">
            <div
              className="
                relative
                overflow-hidden
                border
                border-white/[.12]
                bg-[#090909]
                shadow-[0_35px_100px_rgba(0,0,0,.55)]
              "
            >
              {/* Video frame */}
              <div className="relative aspect-[1.62/1] w-full overflow-hidden">
                <ArchiveVideo
                  key={active.id}
                  frame={active}
                  priority
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    brightness-[.74]
                    contrast-[1.08]
                    saturate-[.76]
                    transition-opacity
                    duration-700
                  "
                />

                {/* Cinematic color wash */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(0,0,0,.28), transparent 40%, rgba(0,0,0,.15)), linear-gradient(0deg, rgba(0,0,0,.28), transparent 35%, rgba(0,0,0,.2))',
                  }}
                />

                {/* Center vignette */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.58) 100%)',
                  }}
                />

                {/* Quote */}
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 sm:px-12">
                  <div className="relative max-w-[88%] text-center">
                    {/* Opening quote */}
                    <span className="absolute -left-6 -top-7 font-serif text-[48px] leading-none text-[#a9363d]/75">
                      “
                    </span>

                    <p
                      className="
                        font-serif
                        text-[14px]
                        font-semibold
                        leading-[1.75]
                        tracking-[.045em]
                        text-[#f0ece4]
                        sm:text-[16px]
                        lg:text-[17px]
                        xl:text-[18px]
                      "
                      style={{
                        textShadow:
                          '0 2px 10px rgba(0,0,0,.95), 0 0 24px rgba(0,0,0,.75)',
                      }}
                    >
                      <Quote frame={active} />
                    </p>

                    {/* Closing quote */}
                    <span className="absolute -bottom-8 -right-6 font-serif text-[48px] leading-none text-[#a9363d]/75">
                      ”
                    </span>
                  </div>
                </div>

                {/* Frame edge */}
                <div className="pointer-events-none absolute inset-0 border border-white/[.07]" />

                {/* Enter interaction */}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  aria-label={`Enter ${active.title}`}
                  className="absolute inset-0 z-30 cursor-pointer"
                >
                  <span className="sr-only">
                    Enter {active.title}
                  </span>
                </button>
              </div>
            </div>

          </section>

          {/* ==================================================================
              COLUMN 03 — FILM STRIP
              ================================================================== */}

          <aside className="hidden h-[545px] lg:block">
            <div className="relative h-full w-full">
              {/* Spine */}
              <div className="absolute left-0 top-0 h-full w-px bg-white/[.09]" />

              <div className="flex h-full flex-col gap-[5px] pl-3">
                {FRAMES.map((frame, index) => {
                  const selected = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => selectEntry(index)}
                      aria-label={`Select ${frame.title}`}
                      className="group relative min-h-0 flex-1 overflow-hidden text-left"
                    >
                      {/* Video */}
                      <ArchiveVideo
                        frame={frame}
                        priority={selected}
                        className={[
                          'absolute inset-0 h-full w-full object-cover',
                          'transition-all duration-700',
                          selected
                            ? 'scale-100 opacity-80 grayscale-[.15]'
                            : 'scale-[1.08] opacity-[.22] grayscale',
                          'group-hover:scale-100 group-hover:opacity-[.62]',
                        ].join(' ')}
                      />

                      {/* Dark film treatment */}
                      <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />

                      {/* Number */}
                      <span
                        className={[
                          'absolute right-2 top-2 z-10',
                          'font-mono text-[7px]',
                          selected
                            ? 'text-[#e7dfd2]'
                            : 'text-white/35 group-hover:text-white/70',
                        ].join(' ')}
                      >
                        {frame.number}
                      </span>

                      {/* Film perforations */}
                      <span className="absolute bottom-1 left-1 top-1 flex flex-col justify-around">
                        {Array.from({ length: 5 }).map((_, hole) => (
                          <span
                            key={hole}
                            className="h-[3px] w-[3px] rounded-full bg-white/20"
                          />
                        ))}
                      </span>

                      {/* Active marker */}
                      {selected && (
                        <span className="absolute bottom-2 left-3 h-[2px] w-5 bg-[#b9363f] shadow-[0_0_10px_rgba(185,54,63,.65)]" />
                      )}

                      {/* Border */}
                      <span
                        className={[
                          'pointer-events-none absolute inset-0 border',
                          selected
                            ? 'border-[#a9363d]/80'
                            : 'border-white/[.04]',
                        ].join(' ')}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ====================================================================
            TABLET - 2 COLUMN LAYOUT (md to lg)
            ================================================================== */}

        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-[300px_1fr] gap-x-8">
            {/* Left Column - Sticky Notes */}
            <div>
              {/* Section heading */}
              <div className="mb-5 pl-1">
                <div className="font-mono text-[9px] font-medium uppercase tracking-[.32em] text-[#b5a99a]">
                  Sacred Home of ...
                </div>
                <div className="mt-3 h-px w-20 bg-[#9b343a]/60" />
              </div>

              {/* Sticky notes wall - compact for tablet */}
              <div className="relative h-[400px] w-full">
                {FRAMES.map((frame, index) => (
                  <StickyNote
                    key={frame.id}
                    frame={frame}
                    index={index}
                    active={index === activeEntry}
                    onSelect={selectEntry}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Video + Vault Card */}
            <div>
              {/* Video section */}
              <div className="mb-5">
                <div className="overflow-hidden border border-white/[.12] shadow-[0_20px_60px_rgba(0,0,0,.65)]">
                  <div className="relative aspect-[16/10]">
                    <ArchiveVideo
                      key={active.id}
                      frame={active}
                      priority
                      className="absolute inset-0 h-full w-full object-cover brightness-[.72] contrast-[1.08] saturate-[.76]"
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,.62)_100%)]" />

                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                      <p className="max-w-[85%] font-serif text-[13px] font-semibold leading-[1.65] tracking-wide text-white [text-shadow:0_2px_12px_rgba(0,0,0,.95)]">
                        <Quote frame={active} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ESO Vault Card - Tiny landscape */}
              <div className="max-w-[380px]">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="group relative h-[90px] w-full -rotate-[0.8deg] overflow-hidden border border-[#9b8066]/20 bg-[#0b0a09] px-5 py-4 text-left shadow-[0_15px_45px_rgba(0,0,0,.55)] transition-all duration-500 hover:rotate-0 hover:border-[#a9363d]/35"
                >
                  <span
                    className="absolute inset-0 opacity-[.08]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                      backgroundSize: '8px 8px',
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[7px] uppercase tracking-[.28em] text-[#70685f]">
                        ESO — VAULT
                      </span>
                      <span className="font-mono text-[7px] text-[#4f4943]">
                        {active.number}
                      </span>
                    </div>

                    <div className="mt-2 font-display text-[18px] uppercase tracking-[.04em] leading-tight text-[#c9c0b4]">
                      {active.shortTitle}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-mono text-[7px] uppercase tracking-[.18em] text-[#a9363d]">
                        Enter Vault
                      </span>
                      <span className="text-[10px] text-[#a9363d] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            MOBILE - COMPACT LAYOUT
            ================================================================== */}

        <div className="md:hidden">
          {/* Section heading - Sacred Home of... */}
          <div className="mb-6 text-center">
            <div className="font-mono text-[8px] font-medium uppercase tracking-[.32em] text-[#b5a99a]">
              Sacred Home of ...
            </div>
            <div className="mx-auto mt-2.5 h-px w-16 bg-[#9b343a]/70" />
          </div>

          {/* Compact sticky notes - 2-3-2 grid pattern (tiny) */}
          <div className="mb-6">

            {/* Notes grid - artistic 2-3-2 layout */}
            <div className="mx-auto max-w-[300px] space-y-2">
              {/* Row 1: 2 notes */}
              <div className="flex justify-center gap-2">
                {[0, 1].map((index) => {
                  const frame = FRAMES[index];
                  const layout = NOTE_LAYOUT[index];
                  const tone = NOTE_TONES[layout.tone];
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => selectEntry(index)}
                      className="relative h-[50px] w-[75px] overflow-hidden rounded-[2px] border transition-all duration-300"
                      style={{
                        background: tone.background,
                        borderColor: isActive ? tone.accent : tone.border,
                        transform: `rotate(${layout.rotate * 0.4}deg)`,
                        boxShadow: isActive
                          ? `0 6px 16px rgba(0,0,0,.65), 0 0 10px ${tone.accent}30`
                          : '0 4px 12px rgba(0,0,0,.55)',
                      }}
                    >
                      {/* Pin - blood-red */}
                      <span
                        className="absolute left-1/2 top-[35%] z-10 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          filter: 'drop-shadow(0 1px 3px rgba(139,46,46,.7))',
                        }}
                      >
                        <span
                          className="block h-[5px] w-[5px] rounded-full"
                          style={{
                            background: 'linear-gradient(145deg, #a83838, #6b1f1f)',
                            boxShadow: '0 0 5px rgba(168,56,56,.8)',
                          }}
                        />
                      </span>

                      {/* Title */}
                      <span
                        className="absolute inset-x-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-center font-display text-[8px] uppercase tracking-[.06em] leading-tight"
                        style={{
                          color: isActive ? '#e5d8c8' : tone.text,
                          textShadow: '0 1px 2px rgba(0,0,0,.5)',
                        }}
                      >
                        {frame.shortTitle}
                      </span>

                      {isActive && (
                        <span
                          className="absolute bottom-0 left-0 h-[1.5px] w-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent, #a83838, transparent)',
                            boxShadow: '0 0 6px rgba(168,56,56,.8)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: 3 notes */}
              <div className="flex justify-center gap-2">
                {[2, 3, 4].map((index) => {
                  const frame = FRAMES[index];
                  const layout = NOTE_LAYOUT[index];
                  const tone = NOTE_TONES[layout.tone];
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => selectEntry(index)}
                      className="relative h-[50px] w-[75px] overflow-hidden rounded-[2px] border transition-all duration-300"
                      style={{
                        background: tone.background,
                        borderColor: isActive ? tone.accent : tone.border,
                        transform: `rotate(${layout.rotate * 0.4}deg)`,
                        boxShadow: isActive
                          ? `0 6px 16px rgba(0,0,0,.65), 0 0 10px ${tone.accent}30`
                          : '0 4px 12px rgba(0,0,0,.55)',
                      }}
                    >
                      <span
                        className="absolute left-1/2 top-[35%] z-10 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          filter: 'drop-shadow(0 1px 3px rgba(139,46,46,.7))',
                        }}
                      >
                        <span
                          className="block h-[5px] w-[5px] rounded-full"
                          style={{
                            background: 'linear-gradient(145deg, #a83838, #6b1f1f)',
                            boxShadow: '0 0 5px rgba(168,56,56,.8)',
                          }}
                        />
                      </span>

                      <span
                        className="absolute inset-x-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-center font-display text-[8px] uppercase tracking-[.06em] leading-tight"
                        style={{
                          color: isActive ? '#e5d8c8' : tone.text,
                          textShadow: '0 1px 2px rgba(0,0,0,.5)',
                        }}
                      >
                        {frame.shortTitle}
                      </span>

                      {isActive && (
                        <span
                          className="absolute bottom-0 left-0 h-[1.5px] w-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent, #a83838, transparent)',
                            boxShadow: '0 0 6px rgba(168,56,56,.8)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Row 3: 2 notes */}
              <div className="flex justify-center gap-2">
                {[5, 6].map((index) => {
                  const frame = FRAMES[index];
                  const layout = NOTE_LAYOUT[index];
                  const tone = NOTE_TONES[layout.tone];
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => selectEntry(index)}
                      className="relative h-[50px] w-[75px] overflow-hidden rounded-[2px] border transition-all duration-300"
                      style={{
                        background: tone.background,
                        borderColor: isActive ? tone.accent : tone.border,
                        transform: `rotate(${layout.rotate * 0.4}deg)`,
                        boxShadow: isActive
                          ? `0 6px 16px rgba(0,0,0,.65), 0 0 10px ${tone.accent}30`
                          : '0 4px 12px rgba(0,0,0,.55)',
                      }}
                    >
                      <span
                        className="absolute left-1/2 top-[35%] z-10 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          filter: 'drop-shadow(0 1px 3px rgba(139,46,46,.7))',
                        }}
                      >
                        <span
                          className="block h-[5px] w-[5px] rounded-full"
                          style={{
                            background: 'linear-gradient(145deg, #a83838, #6b1f1f)',
                            boxShadow: '0 0 5px rgba(168,56,56,.8)',
                          }}
                        />
                      </span>

                      <span
                        className="absolute inset-x-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-center font-display text-[8px] uppercase tracking-[.06em] leading-tight"
                        style={{
                          color: isActive ? '#e5d8c8' : tone.text,
                          textShadow: '0 1px 2px rgba(0,0,0,.5)',
                        }}
                      >
                        {frame.shortTitle}
                      </span>

                      {isActive && (
                        <span
                          className="absolute bottom-0 left-0 h-[1.5px] w-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent, #a83838, transparent)',
                            boxShadow: '0 0 6px rgba(168,56,56,.8)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Video section - Cinematic large landscape */}
          <div className="mb-6 px-2">
            <div className="overflow-hidden border border-white/[.12] shadow-[0_20px_60px_rgba(0,0,0,.65)]">
              <div className="relative aspect-[1.85/1]">
                <ArchiveVideo
                  key={active.id}
                  frame={active}
                  priority
                  className="absolute inset-0 h-full w-full object-cover brightness-[.72] contrast-[1.08] saturate-[.76]"
                />

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,.62)_100%)]" />

                <div className="absolute inset-0 flex items-center justify-center px-5 text-center">
                  <p className="max-w-[90%] font-serif text-[12px] font-semibold leading-[1.65] tracking-wide text-white [text-shadow:0_2px_12px_rgba(0,0,0,.95)]">
                    <Quote frame={active} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ESO Vault Card - Landscape tiny at edge */}
          <div className="mx-auto max-w-[340px] px-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="group relative h-[75px] w-full -rotate-[0.6deg] overflow-hidden border border-[#9b8066]/20 bg-[#0b0a09] px-5 py-3 text-left shadow-[0_15px_40px_rgba(0,0,0,.55)] transition-all duration-500 hover:rotate-0 hover:border-[#a9363d]/35"
            >
              <span
                className="absolute inset-0 opacity-[.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[6px] uppercase tracking-[.28em] text-[#70685f]">
                    ESO — VAULT
                  </span>
                  <span className="font-mono text-[6px] text-[#4f4943]">
                    {active.number}
                  </span>
                </div>

                <div className="mt-2 font-display text-[16px] uppercase tracking-[.04em] leading-tight text-[#c9c0b4]">
                  {active.shortTitle}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-[6px] uppercase tracking-[.18em] text-[#a9363d]">
                    Enter Vault
                  </span>
                  <span className="text-[9px] text-[#a9363d] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}