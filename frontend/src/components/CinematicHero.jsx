import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ESO — BLACK VAULT | Responsive cinematic hero
   Mobile: notes, video, vault in one column.
   Tablet: notes left + dominant video right; vault below both.
   Desktop: notes/vault left + cinematic video center + film strip right. */

const FRAMES = [
  { 
    id:'welcome', 
    number:'01', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame1_gnpv3w.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame1_gnpv3w.gif', 
    title:'THE MOMENTS PALACE', 
    shortTitle:'MOMENTS', 
    tagline:'Rooms of moments.', 
    quoteLine1: 'Share', 
    quoteLine2: 'your', 
    quoteHighlight: 'Experience', 
    quoteHighlightColor: '#DB762E', 
    description:'A space for introspection and personal history' 
  },
  { 
    id:'dark-confession', 
    number:'02', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410932/frame2_lia8kg.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410932/frame2_lia8kg.gif', 
    title:'CONFESSION', 
    shortTitle:'CONFESSION', 
    tagline:'Things left unsaid.', 
    quoteLine1: 'Release', 
    quoteLine2: 'your', 
    quoteHighlight: 'Regrets', 
    quoteHighlightColor: '#B44A4A', 
    description:'Release your burdens without judgment' 
  },
  { 
    id:'dark-understanding', 
    number:'03', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame3_yrjfiw.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame3_yrjfiw.gif', 
    title:'UNDERSTANDING', 
    shortTitle:'UNDERSTANDING', 
    tagline:'A shared darkness.', 
    quoteLine1: 'Understand', 
    quoteLine2: 'others', 
    quoteHighlight: 'Pain', 
    quoteHighlightColor: '#B44A4A', 
    description:'Connect with those who truly understand' 
  },
  { 
    id:'fantasy-daydream', 
    number:'04', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410935/frame4_lfwlgn.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410935/frame4_lfwlgn.gif', 
    title:'IMAGINATION', 
    shortTitle:'IMAGINATION', 
    tagline:'Beyond imagination.', 
    singleLine: true, 
    quoteLine1: 'Fantasies,', 
    quoteLine2: '', 
    quoteHighlight: 'Daydreams', 
    quoteHighlightColor: '#DB762E', 
    description:'Explore worlds beyond the ordinary' 
  },
  { 
    id:'fantasy-vibes', 
    number:'05', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410934/frame5_lwtld5.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410934/frame5_lwtld5.gif', 
    title:'VIBES', 
    shortTitle:'VIBES', 
    tagline:'A space for anything.', 
    quoteLine1: 'Flow', 
    quoteLine2: 'with the', 
    quoteHighlight: 'Vibe', 
    quoteHighlightColor: '#DB762E', 
    description:'Flow freely in unstructured expression' 
  },
  { 
    id:'philo-questioning', 
    number:'06', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410942/frame6_fbhc4b.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410942/frame6_fbhc4b.gif', 
    title:'QUESTIONING', 
    shortTitle:'QUESTIONING', 
    tagline:'Questions without answers.', 
    quoteLine1: 'Question', 
    quoteLine2: '', 
    quoteHighlight: 'Everything', 
    quoteHighlightColor: '#B44A4A', 
    description:'Challenge everything, seek deeper truth' 
  },
  { 
    id:'philo-truth', 
    number:'07', 
    video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410949/frame7_dnusjj.gif', 
    mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410949/frame7_dnusjj.gif', 
    title:'TRUTH', 
    shortTitle:'TRUTH', 
    tagline:'Where mystery begins.', 
    quoteLine1: 'Seek', 
    quoteLine2: 'the', 
    quoteHighlight: 'Truth', 
    quoteHighlightColor: '#DB762E', 
    description:'Embrace the uncomfortable realities' 
  },
];

const NOTE_LAYOUT = [
  { x:7,y:4,rotate:-1.5,tone:'wine' }, { x:54,y:7,rotate:1.5,tone:'coffee' },
  { x:5,y:36,rotate:.8,tone:'violet' }, { x:38,y:39,rotate:-1,tone:'olive' },
  { x:70,y:36,rotate:1.2,tone:'ochre' }, { x:10,y:70,rotate:-1.5,tone:'clay' },
  { x:55,y:72,rotate:1.8,tone:'burgundy' },
];
const NOTE_ROWS = [[0,1],[2,3,4],[5,6]];
const TONES = {
  wine:{bg:'linear-gradient(145deg,rgba(45,32,32,.96),rgba(23,17,17,.99))',border:'rgba(80,45,45,.58)',accent:'#8b2e2e',text:'#c9b5a3'},
  coffee:{bg:'linear-gradient(145deg,rgba(42,35,28,.97),rgba(24,20,17,.99))',border:'rgba(85,65,45,.52)',accent:'#7a3e2e',text:'#d4bfa8'},
  violet:{bg:'linear-gradient(145deg,rgba(38,32,42,.96),rgba(22,18,25,.99))',border:'rgba(75,60,85,.52)',accent:'#6b2e5e',text:'#c2b3a5'},
  olive:{bg:'linear-gradient(145deg,rgba(40,38,30,.97),rgba(23,22,18,.99))',border:'rgba(80,75,55,.52)',accent:'#5e4e2e',text:'#c5bda8'},
  ochre:{bg:'linear-gradient(145deg,rgba(48,38,28,.97),rgba(27,21,16,.99))',border:'rgba(95,70,45,.54)',accent:'#8b5a2e',text:'#d1bbaa'},
  clay:{bg:'linear-gradient(145deg,rgba(42,35,32,.96),rgba(24,20,18,.99))',border:'rgba(85,68,60,.52)',accent:'#7a4e3e',text:'#c8b8aa'},
  burgundy:{bg:'linear-gradient(145deg,rgba(45,30,32,.97),rgba(24,17,19,.99))',border:'rgba(80,50,55,.54)',accent:'#8b2e3e',text:'#c7b5a8'},
};

const ArchiveVideo = memo(function ArchiveVideo({ frame, className='', priority=false }) {
  const ref = useRef(null);
  const [visible,setVisible] = useState(priority);
  useEffect(() => {
    if (priority) { setVisible(true); return undefined; }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    },{rootMargin:'180px',threshold:.01});
    observer.observe(node);
    return () => observer.disconnect();
  },[priority]);
  return <img ref={ref} src={visible ? (frame.mobileVideo || frame.video) : undefined} alt="" aria-hidden="true" draggable="false" loading={priority?'eager':'lazy'} className={className}/>;
});

function StickyNote({frame,index,active,onSelect,compact=false}) {
  const layout = NOTE_LAYOUT[index], tone = TONES[layout.tone];
  const pinSvg = (size) => (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden="true"
      className="block overflow-visible"
      style={{ filter: 'drop-shadow(0 0 5px rgba(184, 50, 50, 0.75))' }}
    >
      <circle cx="6" cy="6" r="5" fill="#b83232" stroke="#5e1717" strokeWidth="0.8" />
      <circle cx="4.4" cy="4.2" r="1.5" fill="#e57373" opacity="0.75" />
    </svg>
  );
  if (compact) return (
    <button type="button" onClick={()=>onSelect(index)} aria-label={`Select ${frame.title}`} aria-pressed={active}
      className="relative h-[clamp(54px,8vw,76px)] w-full min-w-0 overflow-hidden rounded-[2px] border text-left transition duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8b2e2e]"
      style={{background:tone.bg,borderColor:active?tone.accent:tone.border,transform:`rotate(${layout.rotate*.45}deg)`,boxShadow:active?`0 8px 20px rgba(0,0,0,.6),0 0 10px ${tone.accent}24`:'0 5px 14px rgba(0,0,0,.42)'}}>
      <span className="pointer-events-none absolute left-1/2 top-[7px] z-10 -translate-x-1/2">{pinSvg(7)}</span>
      <span className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(8px,1.2vw,11px)] uppercase leading-tight tracking-[.05em]" style={{color:active?'#e5d8c8':tone.text}}>{frame.shortTitle}</span>
      {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#a9363d] to-transparent"/>}
    </button>
  );
  return (
    <button type="button" onClick={()=>onSelect(index)} aria-label={`Select ${frame.title}`} aria-pressed={active}
      className={`absolute aspect-[115/78] w-[clamp(88px,8.4vw,115px)] text-left transition-[filter] duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8b2e2e] ${active?'z-30 brightness-[1.08]':'z-10 hover:z-20 hover:brightness-[1.05]'}`}
      style={{left:`${layout.x}%`,top:`${layout.y}%`,transform:`rotate(${layout.rotate}deg)`}}>
      <span className="pointer-events-none absolute left-1/2 top-[9px] z-30 -translate-x-1/2">{pinSvg(10)}</span>
      <span className="absolute inset-0 overflow-hidden rounded-[3px] border" style={{background:tone.bg,borderColor:active?tone.accent:tone.border,boxShadow:active?`0 12px 28px rgba(0,0,0,.65),0 0 14px ${tone.accent}22`:'0 9px 22px rgba(0,0,0,.52)'}}>
        <span className="absolute inset-0 opacity-[.08]" style={{background:'radial-gradient(circle at 30% 30%,rgba(255,255,255,.08),transparent 45%)'}}/>
        <span className="absolute inset-x-2 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(9px,.85vw,11px)] uppercase leading-tight tracking-[.06em]" style={{color:active?'#e5d8c8':tone.text}}>{frame.shortTitle}</span>
        {active && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#a83838] to-transparent"/>}
      </span>
    </button>
  );
}

function StickyWall({activeEntry,selectEntry,compact=false}) {
  return <div className="w-full min-w-0">
    <div className={`mb-4 mt-8 ${compact?'text-center':'pl-1'}`}>
      <p className="font-mono text-[8px] font-medium uppercase tracking-[.32em] text-[#a79a8b]">Sacred Home of ...</p>
      <div className={`mt-2.5 h-px w-16 bg-[#9b343a]/65 ${compact?'mx-auto':''}`}/>
    </div>
    {compact ? <div className="mx-auto grid w-full max-w-[410px] gap-y-1.5">
      {NOTE_ROWS.map((row,rowIndex)=><div key={rowIndex} className="mx-auto grid w-full gap-1.5" style={{gridTemplateColumns:`repeat(${row.length},minmax(0,1fr))`,maxWidth:row.length===3?'100%':'76%'}}>
        {row.map(index=><StickyNote key={FRAMES[index].id} frame={FRAMES[index]} index={index} active={index===activeEntry} onSelect={selectEntry} compact/>)}
      </div>)}
    </div> : <div className="relative mx-auto h-[clamp(280px,28vw,360px)] w-full max-w-[390px] overflow-visible">
      <div className="pointer-events-none absolute inset-[4%_3%] blur-[18px]" style={{background:'radial-gradient(ellipse,rgba(109,74,48,.08),transparent 68%)'}}/>
      {FRAMES.map((frame,index)=><StickyNote key={frame.id} frame={frame} index={index} active={index===activeEntry} onSelect={selectEntry}/>)}
    </div>}
  </div>;
}

function VaultCard({active,navigate,compact=false}) {
  return <button 
    type="button" 
    onClick={()=>navigate('/login')} 
    className={`group relative mx-auto block w-full overflow-hidden rounded-lg border border-white/[0.1] text-left transition-all duration-300 hover:border-[#DB762E]/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#DB762E] ${
      compact ? 'max-w-[380px] px-3.5 py-2.5' : 'max-w-[310px] px-3.5 py-2.5'
    }`}
    style={{
      background: 'linear-gradient(90deg, rgba(219, 118, 46, 0.1) 0%, rgba(14, 13, 18, 0.88) 28%, rgba(10, 10, 14, 0.92) 100%)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    }}
  >
    {/* Left warm orange edge accent */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#DB762E]"
      style={{ boxShadow: '0 0 10px rgba(219, 118, 46, 0.9)' }}
    />

    <div className="flex items-center justify-between gap-3 pl-1">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Glowing burnt-orange waveform emblem */}
        <span
          aria-hidden="true"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[#DB762E]/10 border border-[#DB762E]/25"
        >
          <svg viewBox="0 0 24 20" width="16" height="14" className="overflow-visible" style={{ filter: 'drop-shadow(0 0 4px rgba(219, 118, 46, 0.7))' }}>
            <rect x="1" y="8" width="2" height="4" rx="1" fill="#DB762E" opacity="0.7" />
            <rect x="5" y="5" width="2" height="10" rx="1" fill="#DB762E" opacity="0.85" />
            <rect x="9" y="2" width="2" height="16" rx="1" fill="#E88438" />
            <rect x="13" y="4" width="2" height="12" rx="1" fill="#E88438" />
            <rect x="17" y="6" width="2" height="8" rx="1" fill="#DB762E" opacity="0.85" />
            <rect x="21" y="8" width="2" height="4" rx="1" fill="#DB762E" opacity="0.7" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <span className="font-display text-xs sm:text-[13px] uppercase tracking-[0.12em] text-[#E7DED5] font-medium block truncate">
            {active.shortTitle}
          </span>
          <span className="block font-mono text-[8px] uppercase tracking-[0.14em] text-[#80776d] truncate mt-0.5">
            {active.tagline}
          </span>
        </div>
      </div>

      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#DB762E] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 flex-shrink-0">
        <span>Enter</span>
        <span>→</span>
      </span>
    </div>
  </button>;
}

function CinematicVideo({active,navigate,compact=false,onVideoEnd}) {
  // Handle video end event for GIF (using timer to simulate video end)
  useEffect(() => {
    // Since we're using GIFs, use a timer to simulate video end
    // Approximate GIF duration: ~5 seconds per frame
    const timer = setTimeout(() => {
      if (onVideoEnd) onVideoEnd();
    }, 5000); // 5 seconds per video
    
    return () => clearTimeout(timer);
  }, [active.id, onVideoEnd]);
  
  return <section className="relative min-w-0">
    <div
      className="relative overflow-hidden rounded-lg border border-[#DB762E]/25 bg-[#090909]"
      style={{
        boxShadow: '0 30px 85px rgba(0, 0, 0, 0.72), 0 0 38px rgba(219, 118, 46, 0.1)',
      }}
    >
      <div className={`relative w-full overflow-hidden ${compact?'aspect-[1.7/1]':'aspect-[1.62/1]'}`}>
        <ArchiveVideo key={active.id} frame={active} priority className="absolute inset-0 h-full w-full object-cover brightness-[.86] contrast-[1.06] saturate-[.92]"/>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.22),transparent_42%,rgba(0,0,0,.18)),linear-gradient(0deg,rgba(0,0,0,.28),transparent_38%,rgba(0,0,0,.14))]"/>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,rgba(0,0,0,.45)_100%)]"/>
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 0 40px rgba(219, 118, 46, 0.08)' }}/>
        <div className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center ${compact ? 'px-4' : 'px-6 sm:px-10'}`}>
          <div 
            className="select-none italic"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: '0 4px 24px rgba(0,0,0,0.92), 0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {active.singleLine ? (
              <div className="flex flex-col items-center text-center">
                <p className="text-[clamp(18px,2.8vw,38px)] leading-tight whitespace-nowrap font-medium text-[#F5EFE8]">
                  <span>{active.quoteLine1} </span>
                  <span style={{ color: active.quoteHighlightColor }}>{active.quoteHighlight}</span>
                </p>
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-28 sm:w-40"
                  style={{ background: `linear-gradient(90deg, transparent, ${active.quoteHighlightColor}aa, transparent)` }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-start pl-4 sm:pl-12">
                <p className="text-[clamp(22px,3.6vw,48px)] leading-[1.05] font-medium text-[#F5EFE8] self-center sm:ml-6">
                  {active.quoteLine1}
                </p>
                <div className="flex flex-col items-start mt-0.5">
                  <p className="leading-[1.08] whitespace-nowrap">
                    {active.quoteLine2 ? (
                      <span className="text-[clamp(13px,1.9vw,24px)] text-[#E7DED5]/90 mr-2 font-normal align-baseline">
                        {active.quoteLine2}
                      </span>
                    ) : null}
                    <span
                      className="text-[clamp(22px,3.6vw,48px)] font-medium"
                      style={{ color: active.quoteHighlightColor }}
                    >
                      {active.quoteHighlight}
                    </span>
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-px w-28 sm:w-44"
                    style={{ background: `linear-gradient(90deg, ${active.quoteHighlightColor}cc, ${active.quoteHighlightColor}33 70%, transparent)` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <button type="button" onClick={()=>navigate('/login')} aria-label={`Enter ${active.title}`} className="absolute inset-0 z-30 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DB762E]"><span className="sr-only">Enter {active.title}</span></button>
      </div>
    </div>
  </section>;
}

function FilmStrip({activeEntry,selectEntry}) {
  return <aside className="hidden h-[520px] min-w-0 lg:block" aria-label="Choose a moment">
    <div className="relative h-full w-full">
      <div className="flex h-full flex-col gap-2 pl-1">
        {FRAMES.map((frame,index)=>{
          const selected=index===activeEntry;
          const label = frame.shortTitle.charAt(0) + frame.shortTitle.slice(1).toLowerCase();
          return (
            <button
              key={frame.id}
              type="button"
              onClick={()=>selectEntry(index)}
              aria-label={`Select ${frame.title}`}
              aria-pressed={selected}
              className={`group relative min-h-0 flex-1 overflow-hidden rounded-md text-center transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#DB762E] ${
                selected ? 'border border-[#DB762E]/85' : 'border border-white/[0.08] hover:border-white/25'
              }`}
              style={{
                boxShadow: selected
                  ? '0 0 18px rgba(219, 118, 46, 0.25), inset 0 1px 0 rgba(255, 190, 130, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.35)',
              }}
            >
              <ArchiveVideo
                frame={frame}
                priority={selected}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  selected ? 'scale-100 opacity-70 brightness-95' : 'scale-[1.06] opacity-25 grayscale group-hover:scale-100 group-hover:opacity-55 group-hover:grayscale-0'
                }`}
              />
              <span className={`absolute inset-0 transition-colors ${selected ? 'bg-gradient-to-t from-black/70 via-black/35 to-[#DB762E]/10' : 'bg-black/55 group-hover:bg-black/35'}`} />
              <span
                className={`relative z-10 flex h-full w-full items-center justify-center px-2 text-[11px] tracking-wide transition-colors ${
                  selected ? 'text-[#F5EFE8] font-medium' : 'text-[#928B91] group-hover:text-[#E7DED5]'
                }`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {label}
              </span>
              <span className={`absolute bottom-1 right-1.5 z-10 font-mono text-[7px] ${selected ? 'text-[#DB762E]' : 'text-white/25 group-hover:text-white/55'}`}>
                {frame.number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </aside>;
}

export default function CinematicHero() {
  const navigate=useNavigate();
  const [activeEntry,setActiveEntry]=useState(0); // Start with memory video (index 0)
  const [userInteracted,setUserInteracted]=useState(false); // Track if user manually selected
  const active=FRAMES[activeEntry];
  
  const selectEntry=useCallback(index=>{
    setActiveEntry(index);
    setUserInteracted(true); // User took control
  },[]);
  
  const next=useCallback(()=>setActiveEntry(current=>(current+1)%FRAMES.length),[]);
  const previous=useCallback(()=>setActiveEntry(current=>(current-1+FRAMES.length)%FRAMES.length),[]);
  
  // Auto-advance to next video when current ends (only if user hasn't interacted)
  const handleVideoEnd = useCallback(() => {
    if (!userInteracted) {
      next();
    }
  }, [userInteracted, next]);

  useEffect(()=>{
    const onKeyDown=event=>{
      const target=event.target;
      const typing=target instanceof HTMLElement&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName));
      if(typing||event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.key==='ArrowRight'||event.key==='ArrowDown'){
        next();
        setUserInteracted(true);
      }
      if(event.key==='ArrowLeft'||event.key==='ArrowUp'){
        previous();
        setUserInteracted(true);
      }
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[next,previous]);

  return <main className="relative isolate min-h-screen overflow-hidden bg-transparent text-[#e7e0d4]">
    {/* Subtle warm amber atmosphere, top-left glow, and film grain */}
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at 0% 0%,rgba(219,118,46,.14),transparent 26%),radial-gradient(circle at 56% 48%,rgba(145,82,36,.09),transparent 36%),radial-gradient(circle at 12% 65%,rgba(101,75,49,.04),transparent 28%)'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at center,transparent 35%,rgba(0,0,0,.45) 100%)'}}/>
      <div className="absolute inset-0 opacity-[.035]" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.75'/%3E%3C/svg%3E\")"}}/>
      <div className="absolute inset-0 opacity-[.025]" style={{backgroundImage:'repeating-linear-gradient(to bottom,transparent 0,transparent 4px,rgba(255,255,255,.25) 5px)'}}/>
    </div>

    <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-4 py-8 sm:px-6 sm:py-10 md:px-7 lg:px-8 xl:px-10">
      <div className="mx-auto grid w-full min-w-0 grid-cols-1 items-center gap-y-7 sm:gap-y-8 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.35fr)] md:gap-x-5 md:gap-y-5 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.55fr)_minmax(74px,0.27fr)] lg:gap-x-5 xl:grid-cols-[minmax(340px,0.86fr)_minmax(0,1.55fr)_minmax(88px,0.28fr)] xl:gap-x-7">
        {/* Left column: note wall. Vault is attached here only on desktop. */}
        <aside className="min-w-0 md:col-start-1 md:row-start-1">
          <div className="mx-auto w-full max-w-[420px] md:max-w-none">
            <div className="hidden md:block"><StickyWall activeEntry={activeEntry} selectEntry={selectEntry}/></div>
            <div className="md:hidden"><StickyWall activeEntry={activeEntry} selectEntry={selectEntry} compact/></div>
            <div className="mt-5 hidden lg:block"><VaultCard active={active} navigate={navigate}/></div>
          </div>
        </aside>

        {/* One video instance, sized by the grid's available space. */}
        <div className="min-w-0 md:col-start-2 md:row-start-1">
          <CinematicVideo active={active} navigate={navigate} onVideoEnd={handleVideoEnd}/>
        </div>

        {/* Film strip is intentionally withheld until a wide desktop breakpoint. */}
        <div className="hidden min-w-0 lg:col-start-3 lg:row-start-1 lg:block">
          <FilmStrip activeEntry={activeEntry} selectEntry={selectEntry}/>
        </div>

        {/* Tablet/mobile Vault card sits below the entire main grid. */}
        <div className="min-w-0 md:col-span-2 md:col-start-1 md:row-start-2 lg:hidden">
          <VaultCard active={active} navigate={navigate} compact/>
        </div>
      </div>
    </section>
  </main>;
}
