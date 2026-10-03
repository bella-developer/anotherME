

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================================
   DATA
   ========================================================================== */
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

/*
 * Important:
 *
 * Replace only the Cloudinary URLs above.
 *
 * The architecture intentionally keeps:
 *
 * frame.video
 * frame.mobileVideo
 *
 * so the desktop and mobile cinematic compositions can use different
 * Cloudinary assets.
 */


/* ============================================================================
   ICONS
   ========================================================================== */

const Icon = memo(function Icon({ type }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "brain":
      return (
        <svg {...common}>
          <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5a3 3 0 0 0-2 2.8A3.2 3.2 0 0 0 7.2 14H8v1.5A3.5 3.5 0 0 0 11.5 19H12V6.5a2 2 0 0 0-2-2Z" />
          <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3 3 0 0 1 2 2.8 3.2 3.2 0 0 1-3.2 2.7H16v1.5a3.5 3.5 0 0 1-3.5 3.5H12V6.5a2 2 0 0 1 2-2Z" />
          <path d="M8 9h2M14 9h2M8.5 13h1.5M14 13h1.5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "diamond":
      return (
        <svg {...common}>
          <path d="m12 3 7 9-7 9-7-9 7-9Z" />
          <path d="m12 7 3.5 5-3.5 5-3.5-5L12 7Z" />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
          <path d="M19 16v5M16.5 18.5h5" />
        </svg>
      );

    case "wave":
      return (
        <svg {...common}>
          <path d="M3 12c2.3 0 2.3-5 4.7-5s2.3 10 4.6 10S14.7 7 17 7s2.3 5 4 5" />
        </svg>
      );

    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );

    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z" />
        </svg>
      );

    default:
      return null;
  }
});


/* ============================================================================
   ARCHIVE VIDEO
   ========================================================================== */

/**
 * ArchiveVideo
 *
 * Responsibilities:
 * - Cloudinary video playback
 * - visibility-based loading/playback
 * - muted autoplay
 * - mobile/desktop source selection
 * - no unnecessary playback when the element is outside viewport
 */
const ArchiveVideo = memo(function ArchiveVideo({
  src,
  mobileSrc,
  poster,
  active = false,
  className = "",
  objectPosition = "center",
  priority = false,
}) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  const [visible, setVisible] = useState(priority);
  const [loaded, setLoaded] = useState(false);

  /*
   * IntersectionObserver controls playback.
   */
  useEffect(() => {
    const element = wrapperRef.current;

    if (!element || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);

        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "120px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [priority]);

  /*
   * Play/pause according to visibility + active state.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (visible && active) {
      const promise = video.play();

      if (promise?.catch) {
        promise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [visible, active]);

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-black ${className}`}
    >
      {/* Very subtle loading surface */}
      <div
        className={`absolute inset-0 bg-[#090909] transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {visible && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition,
          }}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload={priority ? "metadata" : "none"}
          onLoadedData={() => setLoaded(true)}
          aria-hidden="true"
        >
          {mobileSrc && (
            <source
              media="(max-width: 767px)"
              src={mobileSrc}
              type="video/mp4"
            />
          )}
        </video>
      )}

      {/* Cinematic dark treatment */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.52)_0%,rgba(0,0,0,.08)_55%,rgba(0,0,0,.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.48)_0%,transparent_42%,rgba(0,0,0,.2)_100%)]" />
    </div>
  );
});


/* ============================================================================
   STICKY NOTE
   ========================================================================== */

const StickyNote = memo(function StickyNote({
  frame,
  active,
  onSelect,
  position,
}) {
  const handleClick = useCallback(() => {
    onSelect(frame);
  }, [frame, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      aria-label={`Open ${frame.title}`}
      className={[
        "group absolute block",
        "h-[88px] w-[142px]",
        "origin-center",
        "rounded-[3px]",
        "text-left",
        "transition-[transform,filter,opacity]",
        "duration-300 ease-out",
        "focus:outline-none",
        "focus-visible:ring-1 focus-visible:ring-white/60",
        active
          ? "z-30 scale-[1.025] brightness-[1.12]"
          : "z-10 opacity-[0.86] hover:z-30 hover:scale-[1.025] hover:opacity-100",
      ].join(" ")}
      style={{
        left: position.left,
        top: position.top,
        transform: `rotate(${position.rotate})`,
        "--note-accent": frame.accent,
        "--note-border": frame.border,
        "--note-surface": frame.surface,
      }}
    >
      {/* Paper */}
      <span
        className="absolute inset-0 overflow-hidden rounded-[3px] border shadow-[0_12px_35px_rgba(0,0,0,.35)]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,.045),
              transparent 35%
            ),
            var(--note-surface)
          `,
          borderColor: "var(--note-border)",
          boxShadow: active
            ? `0 0 0 1px ${frame.accent}22, 0 15px 38px rgba(0,0,0,.46)`
            : "0 12px 35px rgba(0,0,0,.35)",
        }}
      />

      {/* Fine technical grid */}
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[2px] opacity-[0.17]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "7px 7px",
        }}
      />

      {/* Pin */}
      <span
        className="absolute left-1/2 top-[-6px] h-[10px] w-[10px] -translate-x-1/2 rounded-full border border-black/30 shadow-[0_2px_5px_rgba(0,0,0,.5)]"
        style={{
          background: frame.pin,
          boxShadow: `0 0 12px ${frame.pin}55`,
        }}
      />

      {/* Number */}
      <span
        className="absolute left-[14px] top-[11px] font-mono text-[7px] tracking-[0.22em]"
        style={{
          color: `${frame.accent}aa`,
        }}
      >
        {frame.index}
      </span>

      {/* Decorative line */}
      <span
        className="absolute left-[42px] top-[14px] h-px w-[18px] opacity-50"
        style={{
          background: frame.accent,
        }}
      />

      {/* Icon */}
      <span
        className="absolute right-[12px] top-[10px] opacity-60"
        style={{
          color: frame.accent,
        }}
      >
        <Icon type={frame.icon} />
      </span>

      {/* Main title */}
      <span
        className="absolute bottom-[22px] left-[14px] right-[12px] overflow-hidden font-serif text-[17px] italic leading-none tracking-[-0.02em] whitespace-nowrap"
        style={{
          color: "#ddd2c3",
          textOverflow: "ellipsis",
        }}
      >
        {frame.title}
      </span>

      {/* Bottom detail */}
      <span
        className="absolute bottom-[10px] right-[12px] h-px w-[18px]"
        style={{
          background: frame.accent,
          opacity: active ? 0.9 : 0.42,
        }}
      />

      {/* Active edge */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-[1px] transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
        }`}
        style={{
          background: frame.accent,
          boxShadow: `0 0 10px ${frame.accent}`,
        }}
      />
    </button>
  );
});


/* ============================================================================
   FILMSTRIP ITEM
   ========================================================================== */

const FilmStripItem = memo(function FilmStripItem({
  frame,
  active,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    onSelect(frame);
  }, [frame, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Preview ${frame.title}`}
      aria-current={active ? "true" : undefined}
      className={[
        "group relative block aspect-[0.72] w-full overflow-hidden",
        "border bg-black",
        "transition-all duration-300",
        active
          ? "scale-[1.025] opacity-100"
          : "border-white/[0.06] opacity-35 hover:opacity-75",
      ].join(" ")}
      style={{
        borderColor: active ? frame.accent : undefined,
      }}
    >
      <ArchiveVideo
        src={frame.video}
        mobileSrc={frame.mobileVideo}
        active={active}
        className="absolute inset-0"
      />

      {/* Number */}
      <span className="absolute right-[5px] top-[5px] z-10 font-mono text-[6px] tracking-[.15em] text-white/65">
        {frame.index}
      </span>

      {/* Active indicator */}
      {active && (
        <span
          className="absolute bottom-[4px] left-[5px] right-[5px] z-10 h-[1px]"
          style={{
            background: frame.accent,
            boxShadow: `0 0 8px ${frame.accent}`,
          }}
        />
      )}
    </button>
  );
});


/* ============================================================================
   STICKY POSITIONS
   ========================================================================== */

const stickyPositions = [
  {
    left: "2%",
    top: "7%",
    rotate: "-3.5deg",
  },
  {
    left: "39%",
    top: "12%",
    rotate: "2.5deg",
  },
  {
    left: "0%",
    top: "38%",
    rotate: "-1.8deg",
  },
  {
    left: "31%",
    top: "44%",
    rotate: "2.2deg",
  },
  {
    left: "64%",
    top: "39%",
    rotate: "-1.2deg",
  },
  {
    left: "9%",
    top: "71%",
    rotate: "-3deg",
  },
  {
    left: "50%",
    top: "75%",
    rotate: "2.8deg",
  },
];


/* ============================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function CinematicHero() {
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState("understanding");

  const activeFrame = useMemo(
    () => frames.find((frame) => frame.id === activeId) || frames[0],
    [activeId]
  );

  /*
   * Selecting a note updates the cinematic scene.
   *
   * Navigation itself is deliberately separated from selection.
   * This allows clicking a note to change the cinematic content without
   * immediately leaving the landing page.
   */
  const handleSelect = useCallback((frame) => {
    setActiveId(frame.id);
  }, []);

  const handleEnterVault = useCallback(() => {
    navigate(activeFrame.route);
  }, [navigate, activeFrame.route]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#d8d0c5] selection:bg-[#9c302e] selection:text-white">
      {/* ====================================================================
          ATMOSPHERIC BACKGROUND
          ================================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_45%,rgba(95,42,32,.075),transparent_32%),radial-gradient(circle_at_16%_55%,rgba(95,75,50,.045),transparent_25%)]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              radial-gradient(rgba(255,255,255,.7) .5px, transparent .5px)
            `,
            backgroundSize: "37px 37px",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.2),transparent_40%,rgba(0,0,0,.18))]" />
      </div>


      {/* ====================================================================
          HEADER
          ================================================================== */}

      <header className="relative z-50 h-[64px] border-b border-white/[0.08] bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex h-full w-[min(1480px,calc(100%-48px))] items-center justify-between">

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center"
            aria-label="ESO home"
          >
            <span className="font-sans text-[14px] font-medium tracking-[-0.08em] text-white">
              e<span className="text-[#c73630]">s</span>o
            </span>
          </button>

          {/* Center navigation */}
          <nav className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center gap-10">
            <button
              type="button"
              className="relative h-full px-1 font-mono text-[10px] uppercase tracking-[0.32em] text-white"
            >
              Explore
              <span className="absolute bottom-[-1px] left-0 right-0 mx-auto h-[1px] w-[80%] bg-[#c83d39]" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/community")}
              className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45 transition-colors hover:text-white"
            >
              Community
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 transition-colors hover:text-white sm:block"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => navigate("/join")}
              className="h-[34px] min-w-[91px] border border-white/80 bg-[#e7e3dd] px-5 font-mono text-[9px] uppercase tracking-[0.3em] text-black transition-all duration-200 hover:bg-white"
            >
              Join
            </button>
          </div>
        </div>
      </header>


      {/* ====================================================================
          HERO
          ================================================================== */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] w-[min(1480px,calc(100%-48px))] items-center py-8 lg:py-10">

        <div
          className="
            grid w-full items-center
            gap-x-7 gap-y-10
            lg:grid-cols-[minmax(350px,420px)_minmax(190px,250px)_minmax(0,1fr)_68px]
            xl:gap-x-9
          "
        >

          {/* ==================================================================
              LEFT — STICKY WALL
              ================================================================== */}

          <section className="relative flex min-h-[520px] flex-col justify-center">
            <div className="mb-5 pl-1">
              <div className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#d8d0c5]">
                Vault Index
              </div>

              <div className="mt-3 h-px w-[78px] bg-[#8d302d]" />
            </div>

            {/* Bounded canvas */}
            <div className="relative mx-auto h-[460px] w-full max-w-[420px]">
              {frames.map((frame, index) => (
                <StickyNote
                  key={frame.id}
                  frame={frame}
                  active={frame.id === activeId}
                  onSelect={handleSelect}
                  position={stickyPositions[index]}
                />
              ))}
            </div>
          </section>


          {/* ==================================================================
              CENTER — EDITORIAL IDENTITY
              ================================================================== */}

          <section className="relative flex min-h-[460px] items-center">
            <div className="w-full max-w-[255px]">

              <div className="mb-3 flex items-center gap-3">
                <span
                  className="font-mono text-[7px] tracking-[0.25em]"
                  style={{ color: activeFrame.accent }}
                >
                  {activeFrame.index}
                </span>

                <span
                  className="h-px w-7"
                  style={{
                    background: activeFrame.accent,
                  }}
                />
              </div>

              {/* Quote mark */}
              <div
                className="mb-[-4px] font-serif text-[36px] leading-none"
                style={{
                  color: activeFrame.accent,
                  opacity: 0.8,
                }}
              >
                “
              </div>

              <h1
                key={activeFrame.id}
                className="
                  max-w-full
                  overflow-hidden
                  font-serif
                  text-[clamp(2.3rem,3.25vw,4.1rem)]
                  font-normal
                  leading-[.87]
                  tracking-[-.055em]
                  text-[#e1dbd1]
                  transition-opacity
                  duration-300
                "
              >
                {activeFrame.title}
              </h1>

              <div
                className="mt-5 h-px w-12"
                style={{
                  background: activeFrame.accent,
                }}
              />

              <p
                key={`${activeFrame.id}-subtitle`}
                className="mt-4 max-w-[210px] font-mono text-[8px] uppercase leading-[1.8] tracking-[0.25em] text-white/40"
              >
                {activeFrame.subtitle}
              </p>
            </div>
          </section>


          {/* ==================================================================
              RIGHT — CINEMATIC VIDEO
              ================================================================== */}

          <section className="relative min-w-0">
            <div className="relative w-full overflow-hidden border border-white/[0.12] bg-black shadow-[0_25px_80px_rgba(0,0,0,.42)]">

              {/* Aspect-ratio container */}
              <div className="relative aspect-[16/9]">
                <ArchiveVideo
                  key={activeFrame.id}
                  src={activeFrame.video}
                  mobileSrc={activeFrame.mobileVideo}
                  active
                  priority
                  className="absolute inset-0 h-full w-full"
                  objectPosition="center"
                />

                {/* Cinematic quote */}
                <div className="absolute inset-x-[7%] top-1/2 z-10 -translate-y-1/2 text-center">
                  <span
                    className="block font-serif text-[34px] leading-none"
                    style={{
                      color: activeFrame.accent,
                      opacity: 0.85,
                    }}
                  >
                    “
                  </span>

                  <p className="mx-auto max-w-[690px] font-serif text-[clamp(14px,1.25vw,20px)] font-semibold leading-[1.55] tracking-[0.04em] text-[#eee8df] drop-shadow-[0_2px_10px_rgba(0,0,0,.8)]">
                    {activeFrame.id === "understanding" &&
                      "To be understood is to find another who speaks the language of your silence."}

                    {activeFrame.id === "confession" &&
                      "The weight we carry is lighter when shared in whispers."}

                    {activeFrame.id === "memory" &&
                      "Some things disappear from sight, but never leave us."}

                    {activeFrame.id === "imagination" &&
                      "Every impossible world begins with the courage to imagine it."}

                    {activeFrame.id === "vibes" &&
                      "Some truths are felt long before they are understood."}

                    {activeFrame.id === "questioning" &&
                      "The questions we fear are often the ones worth asking."}

                    {activeFrame.id === "truth" &&
                      "Truth is not found in certainty, but in the courage to remain uncertain."}
                  </p>

                  <span
                    className="mt-1 block rotate-180 font-serif text-[34px] leading-none"
                    style={{
                      color: activeFrame.accent,
                      opacity: 0.85,
                    }}
                  >
                    “
                  </span>
                </div>

                {/* subtle frame grain */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen [background-image:radial-gradient(rgba(255,255,255,.8)_0.45px,transparent_0.45px)] [background-size:4px_4px]" />
              </div>
            </div>

            {/* Explore label */}
            <button
              type="button"
              onClick={handleEnterVault}
              className="group mt-5 flex items-center justify-end gap-4 font-mono text-[8px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white/80"
            >
              <span>Explore the vault</span>

              <span className="relative block h-px w-[65px] bg-white/30">
                <span className="absolute right-0 top-1/2 h-[5px] w-[5px] -translate-y-1/2 rotate-45 border-r border-t border-white/50 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </button>
          </section>


          {/* ==================================================================
              FAR RIGHT — FILMSTRIP
              ================================================================== */}

          <aside className="relative hidden h-full min-h-[500px] border-l border-white/[0.09] pl-3 lg:block">
            <div className="flex h-full flex-col justify-center gap-[7px]">
              {frames.map((frame) => (
                <FilmStripItem
                  key={frame.id}
                  frame={frame}
                  active={frame.id === activeId}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </aside>

        </div>
      </section>


      {/* ====================================================================
          MOBILE FILMSTRIP
          ================================================================== */}

      <section className="relative z-20 border-t border-white/[0.08] px-6 pb-8 pt-5 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40">
            Archive
          </span>

          <span className="font-mono text-[7px] tracking-[0.2em] text-white/25">
            {activeFrame.index} / 07
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {frames.map((frame) => (
            <FilmStripItem
              key={frame.id}
              frame={frame}
              active={frame.id === activeId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>


      {/* ====================================================================
          MOBILE EDITORIAL CONTENT
          ================================================================== */}

      <div className="relative z-10 px-6 pb-10 lg:hidden">
        <button
          type="button"
          onClick={handleEnterVault}
          className="group mt-2 flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.3em] text-white/40"
        >
          Explore the vault
          <span className="h-px w-12 bg-white/30 transition-all group-hover:w-16" />
        </button>
      </div>


      {/* Bottom atmospheric line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#71322d]/40 to-transparent" />
    </main>
  );
}