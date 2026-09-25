import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CinematicHero - ESO Black Vault
 * Refined cinematic vault interface
 * Minimal editorial content / maximum visual atmosphere
 */

function CinematicHero() {
  const navigate = useNavigate();
  const [activeEntry, setActiveEntry] = useState(6);
  const [videoLoaded, setVideoLoaded] = useState({});

  /**
   * ================================================================
   * ESO — THE BLACK VAULT
   * ================================================================
   *
   * Each record intentionally contains only:
   * - number
   * - title
   * - shortTitle
   * - tagline
   * - video sources
   *
   * The interface provides the rest of the context visually.
   */
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
      quote: 'In the architecture of remembrance, we build who we become.',
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
      quote: 'The weight we carry is lighter when shared in whispers.',
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
      quote: 'To be understood is to find another who speaks the language of your silence.',
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
      quote: 'Reality is merely the canvas; imagination paints what could be.',
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
      quote: 'Between structure and chaos lies the frequency of authentic being.',
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
      quote: 'The mind that asks is forever more alive than one that accepts.',
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
      quote: 'Truth is not found in certainty, but in the courage to remain uncertain.',
    },
  ];

  const active = frames[activeEntry];

  const selectEntry = (index) => {
    setActiveEntry(index);
  };

  // Reset video loaded state when active entry changes
  useEffect(() => {
    setVideoLoaded((prev) => ({ ...prev, [active.id]: false }));
  }, [active.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveEntry((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveEntry((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [frames.length]);

  // Scroll navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 30) {
        e.preventDefault();
        if (e.deltaY > 0) {
          // Scroll down - next item
          setActiveEntry((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
        } else {
          // Scroll up - previous item
          setActiveEntry((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
        }
      }
    };

    const throttle = (func, delay) => {
      let lastCall = 0;
      return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
      };
    };

    const throttledWheel = throttle(handleWheel, 800);
    window.addEventListener('wheel', throttledWheel, { passive: false });
    return () => window.removeEventListener('wheel', throttledWheel);
  }, [frames.length]);

  /**
   * ================================================================
   * REUSABLE VIDEO
   * ================================================================
   */
  const ArchiveVideo = ({ frame, className = '' }) => {
    const handleVideoLoad = () => {
      setVideoLoaded((prev) => ({ ...prev, [frame.id]: true }));
    };

    return (
      <video
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoad}
        onCanPlayThrough={handleVideoLoad}
      >
        <source
          src={frame.mobileVideo}
          type="video/mp4"
          media="(max-width: 767px)"
        />

        <source src={frame.video} type="video/mp4" />
      </video>
    );
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-[#e8e5dc] selection:bg-[#8f252b]/30">
      {/* ============================================================
          ATMOSPHERE
          ============================================================ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Base black */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Warm atmospheric light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(120,85,55,0.035),transparent_38%)]" />

        {/* Secondary light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(255,255,255,0.018),transparent_30%)]" />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.8'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Analog scan texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.01)_50%,transparent_51%)] bg-[length:100%_8px] opacity-25" />
      </div>

      {/* ============================================================
          MAIN
          ============================================================ */}
      <section className="relative z-10 px-7 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto grid min-h-[calc(100vh-162px)] max-w-[1750px] grid-cols-1 gap-12 lg:grid-cols-[190px_minmax(250px,0.72fr)_minmax(560px,1.8fr)_78px] lg:gap-2 xl:grid-cols-[210px_minmax(280px,0.72fr)_minmax(620px,1.8fr)_90px] xl:gap-3">
          {/* ========================================================
              COLUMN 01
              VAULT INDEX
              ======================================================== */}
          <aside className="hidden pt-20 lg:block">
            <div className="mb-8 flex items-center gap-3">
              <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-[#9b978e]">
                Vault
              </span>

              <span className="h-px w-8 bg-[#4d4a45]" />
            </div>

            <div className="space-y-[14px]">
              {frames.map((frame, index) => {
                const isActive = index === activeEntry;

                return (
                  <button
                    key={frame.id}
                    onClick={() => selectEntry(index)}
                    aria-label={`View ${frame.title}`}
                    className="group flex w-full items-center gap-3 text-left"
                  >
                    {/* Active line */}
                    <span
                      className={`h-px transition-all duration-500 ${
                        isActive
                          ? 'w-6 bg-[#a72a30]'
                          : 'w-0 group-hover:w-3 group-hover:bg-[#55524d]'
                      }`}
                    />

                    {/* Number */}
                    <span
                      className={`w-5 font-mono text-[7px] ${
                        isActive
                          ? 'text-[#a72a30]'
                          : 'text-[#41403c] group-hover:text-[#68655f]'
                      }`}
                    >
                      {frame.number}
                    </span>

                    {/* Title */}
                    <span
                      className={`font-sans text-[8px] uppercase tracking-[0.17em] ${
                        isActive
                          ? 'text-[#d5d1c8]'
                          : 'text-[#514f4a] group-hover:text-[#89857d]'
                      }`}
                    >
                      {frame.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ========================================================
              COLUMN 02
              EDITORIAL IDENTITY
              ======================================================== */}
          <div className="relative flex flex-col justify-center pt-6 lg:pt-14 lg:-ml-4">
            {/* Small record marker */}
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#55524d]">
                {active.number}
              </span>

              <span className="h-px w-8 bg-[#34322f]" />

              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#3f3d39]">
                Vault
              </span>
            </div>

            {/* Title */}
            <h1
              key={active.title}
              className="font-serif text-[24px] font-normal leading-[0.92] tracking-[-0.055em] text-[#e8e5dc] sm:text-[34px] lg:text-[34px] xl:text-[46px]"
            >
              {active.title}
            </h1>

            {/* Minimal tagline */}
            <p className="mt-6 max-w-[250px] font-sans text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[#85817a]">
              {active.tagline}
            </p>

            {/* Minimal active marker */}
            <div className="mt-10 flex items-center gap-3">
              <span className="h-[4px] w-[4px] rounded-full bg-[#a72a30]" />

              <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#4f4c47]">
                Open
              </span>
            </div>
          </div>

          {/* ========================================================
              COLUMN 03
              MAIN VIDEO
              ======================================================== */}
          <div className="relative flex min-h-[520px] items-center justify-center lg:min-h-0">
            <div className="group relative w-full overflow-hidden bg-[#090909]">
              {/* LOADING QUOTE - with glitch effect */}
              {!videoLoaded[active.id] && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#090909]">
                  <style>
                    {`
                      @keyframes glitch {
                        0% {
                          transform: translate(0);
                          opacity: 1;
                        }
                        20% {
                          transform: translate(-2px, 2px);
                          opacity: 0.8;
                        }
                        40% {
                          transform: translate(-2px, -2px);
                          opacity: 0.9;
                        }
                        60% {
                          transform: translate(2px, 2px);
                          opacity: 0.85;
                        }
                        80% {
                          transform: translate(2px, -2px);
                          opacity: 0.95;
                        }
                        100% {
                          transform: translate(0);
                          opacity: 1;
                        }
                      }
                      
                      @keyframes swing {
                        0%, 100% {
                          transform: rotate(-0.5deg);
                        }
                        50% {
                          transform: rotate(0.5deg);
                        }
                      }
                      
                      @keyframes flicker {
                        0%, 100% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0.7;
                        }
                      }
                      
                      .loading-quote {
                        animation: swing 3s ease-in-out infinite, flicker 4s ease-in-out infinite;
                      }
                      
                      .loading-quote::before,
                      .loading-quote::after {
                        content: attr(data-text);
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                      }
                      
                      .loading-quote::before {
                        animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                        color: #a72a30;
                        z-index: -1;
                        clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
                      }
                      
                      .loading-quote::after {
                        animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse infinite;
                        color: #d8d4ca;
                        z-index: -2;
                        clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
                      }
                    `}
                  </style>
                  <p
                    className="loading-quote relative max-w-[80%] px-8 text-center font-serif text-[18px] leading-[1.6] tracking-[-0.02em] text-[#e8e5dc] sm:text-[22px] lg:text-[24px]"
                    data-text={active.quote}
                  >
                    {active.quote}
                  </p>
                </div>
              )}

              {/* VIDEO */}
              <div className="aspect-[16/10] w-full">
                <ArchiveVideo
                  frame={active}
                  className={`h-full w-full object-cover grayscale-[8%] contrast-[1.08] brightness-[0.82] saturate-[0.78] transition-opacity duration-700 ease-out group-hover:brightness-[0.9] ${
                    !videoLoaded[active.id] ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>

              {/* VIGNETTE */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

              {/* TOP GRADIENT */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

              {/* BOTTOM GRADIENT */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />

              {/* ARCHIVAL EDGE */}
              <div className="pointer-events-none absolute inset-0 border border-white/[0.11]" />

              {/* TOP LEFT — only essential identifier */}
              <div className="absolute left-5 top-5 flex items-center gap-3">
                <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/40">
                  ESO
                </span>

                <span className="h-px w-5 bg-white/20" />

                <span className="font-mono text-[7px] tracking-[0.2em] text-white/60">
                  {active.number}
                </span>
              </div>

              {/* TOP RIGHT — single atmospheric marker */}
              <div className="absolute right-5 top-5">
                <span className="h-[4px] w-[4px] rounded-full bg-[#a72a30] shadow-[0_0_10px_rgba(167,42,48,0.35)]" />
              </div>

              {/* CENTER ENTER */}
              <button
                onClick={() => navigate('/login')}
                aria-label={`Enter ${active.title}`}
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 opacity-50 transition-all duration-700 group-hover:opacity-100"
              >
                <span className="flex h-14 w-14 items-center justify-center border border-white/20 transition-all duration-700 group-hover:border-white/50">
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-1 h-3 w-3 fill-[#e8e5dc]"
                    aria-hidden="true"
                  >
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.2-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
                  </svg>
                </span>

                <span className="hidden font-mono text-[7px] uppercase tracking-[0.26em] text-white/55 sm:block">
                  Enter
                </span>
              </button>

              {/* MINIMAL BOTTOM MEDIA LABEL */}
              <div className="absolute bottom-0 left-0 p-5">
                <div className="mb-2 font-mono text-[6px] uppercase tracking-[0.28em] text-white/30">
                  ESO
                </div>

                <div className="font-serif text-[20px] tracking-[-0.02em] text-white/85">
                  {active.shortTitle}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              COLUMN 04
              VERTICAL FILM STRIP
              ======================================================== */}
          <aside className="hidden lg:flex">
            <div className="relative flex h-[500px] w-full flex-col overflow-hidden">
              {/* Vertical archive spine */}
              <div className="absolute left-0 top-0 h-full w-px bg-white/[0.07]" />

              <div className="flex h-full flex-col gap-[5px] pl-3">
                {frames.map((frame, index) => {
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      onClick={() => selectEntry(index)}
                      aria-label={`Select ${frame.title}`}
                      className="group relative min-h-0 flex-1 overflow-hidden text-left"
                    >
                      {/* VIDEO THUMBNAIL */}
                      <ArchiveVideo
                        frame={frame}
                        className={`absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ${
                          isActive
                            ? 'scale-100 opacity-80'
                            : 'scale-[1.08] opacity-20 group-hover:scale-100 group-hover:opacity-55'
                        }`}
                      />

                      {/* DARK FILM LAYER */}
                      <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/20" />

                      {/* NUMBER */}
                      <span
                        className={`relative z-10 float-right mr-2 mt-2 font-mono text-[7px] ${
                          isActive
                            ? 'text-white/80'
                            : 'text-white/30 group-hover:text-white/70'
                        }`}
                      >
                        {frame.number}
                      </span>

                      {/* ACTIVE RED MARKER */}
                      {isActive && (
                        <span className="absolute bottom-2 left-3 z-10 h-[2px] w-5 bg-[#a72a30]" />
                      )}

                      {/* FILM PERFORATION */}
                      <div className="pointer-events-none absolute left-0 top-0 flex h-full flex-col justify-around py-1">
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ==========================================================
            BOTTOM VAULT BAR
            ========================================================== */}
        <div className="mx-auto -mt-16 flex max-w-[1750px] items-end justify-between">
          {/* MINIMAL PAPER ARTIFACT */}
          <div className="relative hidden h-[100px] w-[165px] rotate-[-3deg] border border-[#d8d2c2]/10 bg-[#0b0b0a] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.6)] md:block">
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_5px,rgba(255,255,255,0.015)_6px)]" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#706c64]">
                  ESO
                </span>

                <span className="font-mono text-[7px] text-[#4d4a45]">
                  {active.number}
                </span>
              </div>

              <div className="mt-5 font-serif text-[15px] leading-[0.9] text-[#a39e94]">
                {active.shortTitle}
              </div>

              <div className="absolute bottom-[-3px] right-[-3px] rotate-[-8deg] border border-[#a72a30]/50 px-2 py-[3px] font-mono text-[6px] uppercase tracking-[0.14em] text-[#a72a30]/70">
                Classified
              </div>
            </div>
          </div>

          {/* EXPLORE */}
          <button
            onClick={() => navigate('/login')}
            className="group mx-auto flex items-center gap-5 md:mx-0 lg:ml-[390px]"
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-[#716e67] transition-colors duration-500 group-hover:text-[#d8d4ca]">
              Explore the Vault
            </span>

            <span className="relative flex w-16 items-center">
              <span className="h-px w-full bg-[#4c4944] transition-all duration-700 group-hover:bg-[#a72a30]" />

              <span className="absolute right-0 font-mono text-[13px] text-[#716e67] transition-all duration-700 group-hover:translate-x-1 group-hover:text-[#e8e5dc]">
                →
              </span>
            </span>
          </button>

          {/* INTENTIONALLY EMPTY RIGHT SPACE */}
          <div className="hidden w-[185px] lg:block" />
        </div>

        {/* ==========================================================
            MOBILE NAVIGATION
            ========================================================== */}
        <div className="mt-10 overflow-x-auto border-y border-white/[0.055] py-4 lg:hidden">
          <div className="flex min-w-max gap-7">
            {frames.map((frame, index) => {
              const isActive = index === activeEntry;

              return (
                <button
                  key={frame.id}
                  onClick={() => selectEntry(index)}
                  aria-label={`Select ${frame.title}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`font-mono text-[8px] ${
                      isActive ? 'text-[#a72a30]' : 'text-[#484540]'
                    }`}
                  >
                    {frame.number}
                  </span>

                  <span
                    className={`font-mono text-[8px] uppercase tracking-[0.16em] ${
                      isActive ? 'text-[#d8d4ca]' : 'text-[#55524e]'
                    }`}
                  >
                    {frame.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CinematicHero;