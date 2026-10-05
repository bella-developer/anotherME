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
    x: 2,
    y: 4,
    rotate: -2,
    tone: 'wine',
    icon: 'brain',
  },
  {
    x: 52,
    y: 8,
    rotate: 2,
    tone: 'coffee',
    icon: 'eye',
  },
  {
    x: 0,
    y: 38,
    rotate: 1,
    tone: 'violet',
    icon: 'diamond',
  },
  {
    x: 38,
    y: 42,
    rotate: -1.5,
    tone: 'olive',
    icon: 'star',
  },
  {
    x: 75,
    y: 38,
    rotate: 1.5,
    tone: 'ochre',
    icon: 'wave',
  },
  {
    x: 8,
    y: 76,
    rotate: -2,
    tone: 'clay',
    icon: 'target',
  },
  {
    x: 58,
    y: 80,
    rotate: 2,
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
      'linear-gradient(145deg, rgba(61,35,35,.92), rgba(31,23,23,.97))',
    border: 'rgba(153,72,74,.55)',
    accent: '#c85a63',
    text: '#cfa7a0',
  },

  coffee: {
    background:
      'linear-gradient(145deg, rgba(61,45,32,.94), rgba(29,25,22,.98))',
    border: 'rgba(151,112,72,.52)',
    accent: '#c99552',
    text: '#cdb18a',
  },

  violet: {
    background:
      'linear-gradient(145deg, rgba(47,39,61,.94), rgba(25,23,29,.98))',
    border: 'rgba(130,107,165,.52)',
    accent: '#a991d2',
    text: '#b8a8cb',
  },

  olive: {
    background:
      'linear-gradient(145deg, rgba(48,53,36,.94), rgba(25,27,22,.98))',
    border: 'rgba(110,123,71,.52)',
    accent: '#91a05f',
    text: '#aeb594',
  },

  ochre: {
    background:
      'linear-gradient(145deg, rgba(62,48,27,.95), rgba(29,25,20,.98))',
    border: 'rgba(166,122,46,.56)',
    accent: '#d09a39',
    text: '#cdb47f',
  },

  clay: {
    background:
      'linear-gradient(145deg, rgba(61,43,37,.94), rgba(28,24,22,.98))',
    border: 'rgba(151,105,85,.52)',
    accent: '#c17e6c',
    text: '#c8a89d',
  },

  burgundy: {
    background:
      'linear-gradient(145deg, rgba(61,32,35,.94), rgba(29,22,24,.98))',
    border: 'rgba(148,62,68,.58)',
    accent: '#c65b63',
    text: '#cda09d',
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
        'w-[142px]',
        'h-[92px]',
        'text-left',
        'transition-[transform,filter,opacity]',
        'duration-500',
        'ease-out',
        'focus:outline-none',
        'focus-visible:ring-1',
        'focus-visible:ring-[#c78a55]',
        active
          ? 'z-30 scale-[1.055] brightness-[1.08]'
          : 'hover:z-20 hover:scale-[1.035]',
      ].join(' ')}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: `rotate(${layout.rotate}deg)`,
      }}
    >
      {/* Pin */}
      <span
        className="absolute left-1/2 top-[-7px] z-30 h-[10px] w-[10px] -translate-x-1/2 rounded-full"
        style={{
          background: tone.accent,
          boxShadow: `0 2px 7px ${tone.accent}55`,
        }}
      />

      {/* Pin shadow */}
      <span className="absolute left-1/2 top-[1px] z-20 h-[7px] w-[18px] -translate-x-1/2 rounded-full bg-black/50 blur-[4px]" />

      {/* Note body */}
      <span
        className="absolute inset-0 overflow-hidden rounded-[4px] border"
        style={{
          background: tone.background,
          borderColor: active
            ? tone.accent
            : tone.border,
          boxShadow: active
            ? `0 15px 34px rgba(0,0,0,.55), 0 0 18px ${tone.accent}20`
            : '0 12px 28px rgba(0,0,0,.42)',
        }}
      >
        {/* Micro grid */}
        <span
          className="absolute inset-0 opacity-[.13]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Paper/digital texture */}
        <span
          className="absolute inset-0 opacity-[.12]"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(0,0,0,.5), transparent 35%)',
          }}
        />

        {/* Top metadata */}
        <span className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className="font-mono text-[7px] tracking-[.22em]"
            style={{ color: `${tone.text}88` }}
          >
            {frame.number}
          </span>

          <span
            className="h-px w-4"
            style={{ background: `${tone.accent}66` }}
          />
        </span>

        {/* Icon */}
        <span className="absolute right-3 top-3">
          <NoteIcon
            type={layout.icon}
            color={tone.text}
          />
        </span>

        {/* Title */}
        <span
          className="absolute bottom-[22px] left-3 right-3 block truncate font-serif text-[16px] italic leading-none"
          style={{
            color: active ? '#e1d7c9' : tone.text,
          }}
        >
          {frame.shortTitle}
        </span>

        {/* Bottom mark */}
        <span
          className="absolute bottom-3 right-3 h-px w-5"
          style={{
            background: tone.accent,
            opacity: active ? 0.8 : 0.4,
          }}
        />

        {/* Active edge */}
        {active && (
          <span
            className="absolute bottom-0 left-0 h-[2px] w-full"
            style={{
              background: tone.accent,
              boxShadow: `0 0 12px ${tone.accent}`,
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

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
        <div
          className="
            grid
            w-full
            items-center
            gap-x-8
            lg:grid-cols-[380px_minmax(240px,300px)_minmax(540px,1fr)_100px]
            xl:grid-cols-[400px_minmax(260px,320px)_minmax(620px,1fr)_110px]
          "
        >
          {/* ==================================================================
              COLUMN 01 — STICKY WALL
              ================================================================== */}

          <aside className="hidden lg:block">
            <div className="relative">
              {/* Section heading */}
              <div className="mb-5 pl-1">
                <div className="font-mono text-[10px] font-medium uppercase tracking-[.3em] text-[#c9c1b5]">
                  VAULT INDEX
                </div>

                <div className="mt-3 h-px w-20 bg-[#9b343a]/60" />
              </div>

              {/* BOUNDED WALL */}
              <div className="relative h-[430px] w-full overflow-visible">
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
            </div>
          </aside>

          {/* ==================================================================
              COLUMN 02 — EDITORIAL
              ================================================================== */}

          <section className="relative z-20 flex min-w-0 flex-col justify-center lg:pt-12">
            {/* Current index */}
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-[8px] tracking-[.28em] text-[#686158]">
                {active.number}
              </span>

              <span className="h-px w-7 bg-[#9b343a]/45" />
            </div>

            {/* Title */}
            <h1
              key={active.id}
              className="
                max-w-full
                overflow-hidden
                font-serif
                text-[38px]
                font-normal
                leading-[.9]
                tracking-[-.055em]
                text-[#e4ded2]
                transition-opacity
                duration-500
                sm:text-[46px]
                lg:text-[43px]
                xl:text-[52px]
              "
            >
              {active.shortTitle}
            </h1>

            {/* Rule */}
            <div className="mt-5 h-px w-12 bg-[#9b343a]/70" />

            {/* Tagline */}
            <p className="mt-5 max-w-[190px] font-mono text-[9px] uppercase leading-[1.9] tracking-[.19em] text-[#756f66]">
              {active.tagline}
            </p>
          </section>

          {/* ==================================================================
              COLUMN 03 — CINEMATIC VIDEO
              ================================================================== */}

          <section className="relative min-w-0">
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

            {/* Explore line */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="group flex items-center gap-4"
              >
                <span className="font-mono text-[8px] uppercase tracking-[.28em] text-[#706a62] transition-colors group-hover:text-[#b7afa3]">
                  Explore the Vault
                </span>

                <span className="relative block w-16">
                  <span className="block h-px w-full bg-[#4e4942] transition-colors group-hover:bg-[#a9363d]" />

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#777068] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>
          </section>

          {/* ==================================================================
              COLUMN 04 — FILM STRIP
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
            DESKTOP LOWER CARD
            ================================================================== */}

        <div className="mt-8 hidden lg:flex">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              group
              relative
              ml-0
              h-[128px]
              w-[260px]
              -rotate-[1.8deg]
              overflow-hidden
              border
              border-[#9b8066]/20
              bg-[#0b0a09]
              px-6
              py-5
              text-left
              shadow-[0_25px_65px_rgba(0,0,0,.55)]
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

              <div className="mt-4 font-serif text-[22px] italic text-[#c9c0b4]">
                {active.shortTitle}
              </div>

              <div className="mt-2 font-mono text-[7px] uppercase tracking-[.16em] text-[#5d5750]">
                {active.tagline}
              </div>

              <div className="mt-3 flex items-center gap-2">
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

        {/* ====================================================================
            MOBILE / TABLET NAVIGATION
            ================================================================== */}

        <div className="mt-8 lg:hidden">
          {/* Mobile notes */}
          <div className="mb-8">
            <div className="mb-5 font-mono text-[9px] uppercase tracking-[.28em] text-[#aaa096]">
              VAULT INDEX
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FRAMES.map((frame, index) => {
                const tone = NOTE_TONES[NOTE_LAYOUT[index].tone];

                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => selectEntry(index)}
                    className="relative h-[72px] overflow-hidden rounded-[3px] border p-3 text-left"
                    style={{
                      background: tone.background,
                      borderColor:
                        index === activeEntry
                          ? tone.accent
                          : tone.border,
                    }}
                  >
                    <span
                      className="font-mono text-[7px] tracking-[.2em]"
                      style={{ color: `${tone.text}90` }}
                    >
                      {frame.number}
                    </span>

                    <span
                      className="mt-2 block truncate font-serif text-[13px] italic"
                      style={{ color: tone.text }}
                    >
                      {frame.shortTitle}
                    </span>

                    {index === activeEntry && (
                      <span
                        className="absolute bottom-0 left-0 h-[2px] w-full"
                        style={{
                          background: tone.accent,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile title */}
          <div className="mb-7">
            <div className="mb-3 font-mono text-[8px] tracking-[.25em] text-[#625d56]">
              {active.number}
            </div>

            <h1 className="font-serif text-[38px] leading-[.9] tracking-[-.055em] text-[#e5ded2]">
              {active.shortTitle}
            </h1>

            <div className="mt-4 h-px w-10 bg-[#a9363d]" />

            <p className="mt-4 max-w-[240px] font-mono text-[8px] uppercase leading-[1.8] tracking-[.18em] text-[#746d65]">
              {active.tagline}
            </p>
          </div>

          {/* Mobile cinematic */}
          <div className="overflow-hidden border border-white/[.1]">
            <div className="relative aspect-[16/10]">
              <ArchiveVideo
                key={active.id}
                frame={active}
                priority
                className="absolute inset-0 h-full w-full object-cover brightness-[.72] contrast-[1.08] saturate-[.76]"
              />

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,.62)_100%)]" />

              <div className="absolute inset-0 flex items-center justify-center px-7 text-center">
                <p className="max-w-[90%] font-serif text-[13px] font-semibold leading-[1.7] tracking-wide text-white [text-shadow:0_2px_12px_rgba(0,0,0,.95)]">
                  <Quote frame={active} />
                </p>
              </div>
            </div>
          </div>

          {/* Mobile selector */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {FRAMES.map((frame, index) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => selectEntry(index)}
                aria-label={`Go to ${frame.title}`}
                className={[
                  'h-[3px] transition-all duration-300',
                  index === activeEntry
                    ? 'w-7 bg-[#a9363d]'
                    : 'w-2 bg-[#48433d]',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}