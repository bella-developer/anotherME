import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CinematicHero - ESO Black Vault
 * Refined cinematic vault interface
 * Minimal editorial content / maximum visual atmosphere
 */

function CinematicHero() {
  const navigate = useNavigate();
  const [activeEntry, setActiveEntry] = useState(6);

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
      quote: 'The weight we carry is lighter when shared in whispers.',
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
      quote: 'To be understood is to find another who speaks the language of your silence.',
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
      quote: 'Reality is merely the canvas; imagination paints what could be.',
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
      quote: 'Between structure and chaos lies the frequency of authentic being.',
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
      quote: 'The mind that asks is forever more alive than one that accepts.',
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
      quote: 'Truth is not found in certainty, but in the courage to remain uncertain.',
      highlightWords: ['courage', 'uncertain'],
      description: 'Embrace the uncomfortable realities',
    },
  ];

  const active = frames[activeEntry];

  // Helper function to render quote with highlighted words
  const renderQuoteWithHighlights = (quote, highlightWords) => {
    if (!highlightWords || highlightWords.length === 0) {
      return quote;
    }

    const parts = [];
    let remaining = quote;
    
    highlightWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      remaining = remaining.replace(regex, `<mark>$1</mark>`);
    });

    return remaining;
  };

  const selectEntry = useCallback((index) => {
    setActiveEntry(index);
  }, []);

  // Keyboard navigation with debounce
  useEffect(() => {
    let timeout;
    const handleKeyPress = (e) => {
      if (timeout) return;
      
      if (e.key === 'ArrowLeft') {
        setActiveEntry((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
        timeout = setTimeout(() => { timeout = null; }, 300);
      } else if (e.key === 'ArrowRight') {
        setActiveEntry((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
        timeout = setTimeout(() => { timeout = null; }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (timeout) clearTimeout(timeout);
    };
  }, [frames.length]);

  // Scroll navigation - optimized with throttle
  useEffect(() => {
    let lastCall = 0;
    const throttleDelay = 1000;
    
    const handleWheel = (e) => {
      const now = Date.now();
      if (now - lastCall < throttleDelay) return;
      
      if (Math.abs(e.deltaY) > 30) {
        e.preventDefault();
        lastCall = now;
        
        if (e.deltaY > 0) {
          setActiveEntry((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
        } else {
          setActiveEntry((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [frames.length]);

  /**
   * ================================================================
   * REUSABLE VIDEO - OPTIMIZED FOR PERFORMANCE
   * ================================================================
   */
  const ArchiveVideo = memo(({ frame, className = '', priority = false }) => {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(priority);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (priority) return; // Skip for priority videos

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    // Load and play video when visible
    useEffect(() => {
      if (!isVisible) return;
      
      const video = videoRef.current;
      if (!video) return;

      video.load();
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented
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
      <section className="relative z-10 px-4 py-8 sm:px-7 sm:py-10 lg:px-14">
        <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-[1750px] grid-cols-1 gap-8 sm:min-h-[calc(100vh-140px)] sm:gap-10 md:min-h-[calc(100vh-162px)] lg:grid-cols-[190px_minmax(250px,0.72fr)_minmax(560px,1.8fr)_78px] lg:gap-2 xl:grid-cols-[210px_minmax(280px,0.72fr)_minmax(620px,1.8fr)_90px] xl:gap-3">
          {/* ========================================================
              COLUMN 01
              STICKY NOTES - ARTISTIC DECORATIVE WALL
              ======================================================== */}
          <aside className="hidden pt-20 lg:block">
            <div className="mb-10">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d5d1c8]">
                VAULT INDEX
              </span>
              <div className="mt-2 h-px w-16 bg-[#a72a30]/30" />
            </div>

            <div className="space-y-3">
              {frames.map((frame, index) => {
                const isActive = index === activeEntry;
                
                // Different colors for visual variety
                const colors = [
                  { dot: '#a72a30', border: 'rgba(167,42,48,0.2)' }, // Red
                  { dot: '#d5d1c8', border: 'rgba(213,209,200,0.15)' }, // Beige
                  { dot: '#85817a', border: 'rgba(133,129,122,0.2)' }, // Gray
                  { dot: '#a72a30', border: 'rgba(167,42,48,0.25)' }, // Red
                  { dot: '#c4bfb5', border: 'rgba(196,191,181,0.2)' }, // Light beige
                  { dot: '#706c64', border: 'rgba(112,108,100,0.2)' }, // Muted
                  { dot: '#a72a30', border: 'rgba(167,42,48,0.3)' }, // Red
                ];

                const color = colors[index];
                const rotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-2.5deg]'];

                return (
                  <button
                    key={frame.id}
                    onClick={() => selectEntry(index)}
                    className={`group relative block w-28 transition-all duration-500 ${rotations[index]} ${
                      isActive ? 'scale-105' : 'hover:scale-102'
                    }`}
                  >
                    {/* Pin at top */}
                    <div className="absolute -top-1 left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-700/60 shadow-md" />
                    
                    {/* Sticky note card */}
                    <div 
                      className={`relative h-14 rounded-lg bg-zinc-900/80 backdrop-blur-md shadow-lg transition-all duration-500 ${
                        isActive 
                          ? 'shadow-xl ring-1 ring-white/20' 
                          : 'shadow-md hover:shadow-xl'
                      }`}
                      style={{
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isActive ? color.border : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      {/* Texture overlay */}
                      <div className="pointer-events-none absolute inset-0 rounded-lg bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.01)_4px)]" />
                      
                      {/* Content */}
                      <div className="relative flex h-full flex-col justify-center px-3 py-2">
                        {/* Number with colored dot */}
                        <div className="mb-1 flex items-center gap-1.5">
                          <span 
                            className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                            style={{ backgroundColor: color.dot }}
                          />
                          <span 
                            className={`font-mono text-[7px] font-medium transition-colors duration-300 ${
                              isActive ? 'text-[#d5d1c8]' : 'text-[#55524d] group-hover:text-[#85817a]'
                            }`}
                          >
                            {frame.number}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <span 
                          className={`font-sans text-[8px] font-medium uppercase leading-tight tracking-[0.12em] transition-colors duration-300 ${
                            isActive ? 'text-[#e8e5dc]' : 'text-[#6b6862] group-hover:text-[#a39e94]'
                          }`}
                        >
                          {frame.shortTitle}
                        </span>
                      </div>

                      {/* Active glow */}
                      {isActive && (
                        <div 
                          className="absolute inset-0 rounded-lg opacity-20 blur-sm"
                          style={{ backgroundColor: color.dot }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ========================================================
              COLUMN 02
              EDITORIAL IDENTITY - RESPONSIVE
              ======================================================== */}
          <div className="relative flex flex-col justify-center pt-4 sm:pt-6 lg:pt-14 lg:-ml-4">
            {/* Mobile: Sticky notes at top */}
            <div className="mb-6 lg:hidden">
              <div className="mb-4">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d5d1c8]">
                  VAULT INDEX
                </span>
                <div className="mt-2 h-px w-14 bg-[#a72a30]/30" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {frames.map((frame, index) => {
                  const isActive = index === activeEntry;
                  
                  const colors = [
                    { dot: '#a72a30', border: 'rgba(167,42,48,0.2)' },
                    { dot: '#d5d1c8', border: 'rgba(213,209,200,0.15)' },
                    { dot: '#85817a', border: 'rgba(133,129,122,0.2)' },
                    { dot: '#a72a30', border: 'rgba(167,42,48,0.25)' },
                    { dot: '#c4bfb5', border: 'rgba(196,191,181,0.2)' },
                    { dot: '#706c64', border: 'rgba(112,108,100,0.2)' },
                    { dot: '#a72a30', border: 'rgba(167,42,48,0.3)' },
                  ];

                  const color = colors[index];
                  const rotations = ['rotate-[-1deg]', 'rotate-[1.5deg]', 'rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1.5deg]', 'rotate-[2deg]', 'rotate-[-1deg]'];

                  return (
                    <button
                      key={frame.id}
                      onClick={() => selectEntry(index)}
                      aria-label={`View ${frame.title}`}
                      className={`group relative transition-all duration-500 ${rotations[index]} ${
                        isActive ? 'scale-105' : 'hover:scale-102'
                      }`}
                    >
                      {/* Pin at top */}
                      <div className="absolute -top-1 left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-700/60 shadow-md" />
                      
                      {/* Sticky note card */}
                      <div 
                        className={`relative h-14 rounded-lg bg-zinc-900/80 backdrop-blur-md shadow-lg transition-all duration-500 ${
                          isActive 
                            ? 'shadow-xl ring-1 ring-white/20' 
                            : 'shadow-md hover:shadow-xl'
                        }`}
                        style={{
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: isActive ? color.border : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {/* Texture overlay */}
                        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.01)_4px)]" />
                        
                        {/* Content */}
                        <div className="relative flex h-full flex-col justify-center px-3 py-2">
                          {/* Number with colored dot */}
                          <div className="mb-1 flex items-center gap-1.5">
                            <span 
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: color.dot }}
                            />
                            <span 
                              className={`font-mono text-[7px] font-medium ${
                                isActive ? 'text-[#d5d1c8]' : 'text-[#55524d]'
                              }`}
                            >
                              {frame.number}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <span 
                            className={`font-sans text-[8px] font-medium uppercase leading-tight tracking-[0.12em] ${
                              isActive ? 'text-[#e8e5dc]' : 'text-[#6b6862]'
                            }`}
                          >
                            {frame.shortTitle}
                          </span>
                        </div>

                        {/* Active glow */}
                        {isActive && (
                          <div 
                            className="absolute inset-0 rounded-lg opacity-20 blur-sm"
                            style={{ backgroundColor: color.dot }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Number */}
            <div className="mb-4 sm:mb-6">
              <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#55524d]">
                {active.number}
              </span>
            </div>

            {/* Title - Fully responsive with right margin to prevent overlap */}
            <h1
              key={active.title}
              className="mr-6 font-serif text-[28px] font-normal leading-[0.92] tracking-[-0.055em] text-[#e8e5dc] sm:mr-8 sm:text-[36px] md:text-[40px] lg:mr-0 lg:text-[34px] xl:text-[46px]"
            >
              {active.title}
            </h1>

            {/* Minimal tagline */}
            <p className="mt-4 max-w-[280px] font-sans text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[#85817a] sm:mt-6 sm:max-w-[250px]">
              {active.tagline}
            </p>
          </div>

          {/* ========================================================
              COLUMN 03
              MAIN VIDEO - RESPONSIVE
              ======================================================== */}
          <div className="relative flex min-h-[380px] items-center justify-center sm:min-h-[460px] md:min-h-[520px] lg:min-h-0">
            <div className="group relative w-full overflow-hidden bg-[#090909]">
              {/* VIDEO */}
              <div className="aspect-[16/10] w-full">
                <ArchiveVideo
                  frame={active}
                  priority={true}
                  className="h-full w-full object-cover grayscale-[8%] contrast-[1.08] brightness-[0.82] saturate-[0.78]"
                />
              </div>

              {/* QUOTE OVERLAY - BOLD WITH PREMIUM SHADOW EFFECTS */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6">
                <div className="relative max-w-[85%] text-center sm:max-w-[80%]">
                  {/* Opening quotation mark */}
                  <span className="absolute -left-4 -top-3 font-serif text-4xl leading-none text-[#a72a30]/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:-left-6 sm:-top-4 sm:text-5xl lg:-left-8 lg:-top-6 lg:text-6xl">"</span>
                  
                  {/* Quote with highlights and strong shadows */}
                  <p 
                    className="font-serif text-[13px] font-bold leading-[1.7] tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-[15px] md:text-[17px] lg:text-[19px]"
                    style={{
                      textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,1)'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: renderQuoteWithHighlights(active.quote, active.highlightWords)
                        .replace(/<mark>/g, '<span class="font-extrabold text-[#a72a30]" style="text-shadow: 0 0 20px rgba(167,42,48,0.8), 0 0 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,1);">')
                        .replace(/<\/mark>/g, '</span>')
                    }}
                  />
                  
                  {/* Closing quotation mark */}
                  <span className="absolute -bottom-3 -right-4 font-serif text-4xl leading-none text-[#a72a30]/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:-bottom-4 sm:-right-6 sm:text-5xl lg:-bottom-6 lg:-right-8 lg:text-6xl">"</span>
                </div>
              </div>

              {/* VIGNETTE */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

              {/* ARCHIVAL EDGE */}
              <div className="pointer-events-none absolute inset-0 border border-white/[0.11]" />

              {/* CLICKABLE OVERLAY - Full area clickable, invisible */}
              <button
                onClick={() => navigate('/login')}
                aria-label={`Enter ${active.title}`}
                className="absolute inset-0 cursor-pointer"
              >
                <span className="sr-only">Enter {active.title}</span>
              </button>
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
                        priority={false}
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
            BOTTOM VAULT BAR - RESPONSIVE
            ========================================================== */}
        <div className="mx-auto mt-8 flex max-w-[1750px] flex-col items-center justify-between gap-8 sm:mt-12 md:-mt-24 md:flex-row md:items-end md:gap-4 lg:-mt-32">
          {/* VAULT ACCESS CARD - Premium Design */}
          <button
            onClick={() => navigate('/login')}
            className="group relative hidden h-[160px] w-[260px] rotate-[-2deg] overflow-hidden border border-[#d8d2c2]/15 bg-[#0d0d0c] p-7 shadow-[0_40px_90px_rgba(0,0,0,0.8)] transition-all duration-500 hover:rotate-0 hover:border-[#a72a30]/30 md:block"
          >
            {/* Texture overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_5px,rgba(255,255,255,0.018)_6px)]" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#706c64]">
                  ESO — VAULT
                </span>
                <span className="font-mono text-[9px] text-[#4d4a45]">
                  {active.number}
                </span>
              </div>

              {/* Title */}
              <div className="mt-6 font-serif text-[26px] leading-[1] tracking-tight text-[#c4bfb5]">
                {active.shortTitle}
              </div>

              {/* Description */}
              <p className="mt-3 text-[9px] leading-[1.6] tracking-wide text-[#6b6862]">
                {active.description}
              </p>

              {/* CTA */}
              <div className="mt-5 inline-flex items-center gap-2 border-b border-[#a72a30]/40 pb-1 transition-all duration-300 group-hover:border-[#a72a30]">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#a72a30]/80 transition-colors duration-300 group-hover:text-[#a72a30]">
                  Enter Vault
                </span>
                <span className="text-[10px] text-[#a72a30]/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#a72a30]">
                  →
                </span>
              </div>
            </div>
          </button>

          {/* EXPLORE */}
          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-4 sm:gap-5 md:ml-auto lg:ml-[390px]"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#716e67] transition-colors duration-500 group-hover:text-[#d8d4ca] sm:text-[8px]">
              Explore the Vault
            </span>

            <span className="relative flex w-14 items-center sm:w-16">
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
            MOBILE NAVIGATION - TABLET ONLY (md screens)
            ========================================================== */}
        <div className="mt-8 hidden border-y border-white/[0.055] py-5 sm:mt-10 md:block lg:hidden">
          <div className="relative">
            {/* Visual indicator dots */}
            <div className="mb-3 flex items-center justify-center gap-1.5">
              {frames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectEntry(index)}
                  aria-label={`Go to vault ${index + 1}`}
                  className="group"
                >
                  <span
                    className={`block h-1.5 transition-all duration-300 ${
                      index === activeEntry
                        ? 'w-6 rounded-full bg-[#a72a30]'
                        : 'w-1.5 rounded-full bg-[#484540] group-hover:bg-[#6b6862]'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Scrollable vault list */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max justify-center gap-6 px-4 sm:gap-8">
                {frames.map((frame, index) => {
                  const isActive = index === activeEntry;

                  return (
                    <button
                      key={frame.id}
                      onClick={() => selectEntry(index)}
                      aria-label={`Select ${frame.title}`}
                      className="group flex min-w-[80px] flex-col items-center gap-2 py-2"
                    >
                      <span
                        className={`font-mono text-[9px] transition-colors duration-300 ${
                          isActive ? 'text-[#a72a30]' : 'text-[#484540] group-hover:text-[#6b6862]'
                        }`}
                      >
                        {frame.number}
                      </span>

                      <span
                        className={`text-center font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                          isActive ? 'text-[#d8d4ca] font-medium' : 'text-[#55524e] group-hover:text-[#85817a]'
                        }`}
                      >
                        {frame.shortTitle}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <span className="h-px w-8 bg-[#a72a30]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CinematicHero;