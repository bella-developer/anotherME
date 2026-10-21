import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ESO — BLACK VAULT | Responsive cinematic hero
   Mobile: notes, video, vault in one column.
   Tablet: notes left + dominant video right; vault below both.
   Desktop: notes/vault left + cinematic video center + film strip right. */

const FRAMES = [
  { id:'welcome', number:'01', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame1_gnpv3w.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame1_gnpv3w.gif', title:'THE MEMORY PALACE', shortTitle:'MEMORY', tagline:'Rooms of memory.', quote:'REMEMBER', description:'A space for introspection and personal history' },
  { id:'dark-confession', number:'02', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410932/frame2_lia8kg.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410932/frame2_lia8kg.gif', title:'CONFESSION', shortTitle:'CONFESSION', tagline:'Things left unsaid.', quote:'RELEASE', description:'Release your burdens without judgment' },
  { id:'dark-understanding', number:'03', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame3_yrjfiw.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410933/frame3_yrjfiw.gif', title:'UNDERSTANDING', shortTitle:'UNDERSTANDING', tagline:'A shared darkness.', quote:'WITNESS', description:'Connect with those who truly understand' },
  { id:'fantasy-daydream', number:'04', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410935/frame4_lfwlgn.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410935/frame4_lfwlgn.gif', title:'IMAGINATION', shortTitle:'IMAGINATION', tagline:'Beyond imagination.', quote:'CREATE', description:'Explore worlds beyond the ordinary' },
  { id:'fantasy-vibes', number:'05', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410934/frame5_lwtld5.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410934/frame5_lwtld5.gif', title:'VIBES', shortTitle:'VIBES', tagline:'A space for anything.', quote:'FLOW', description:'Flow freely in unstructured expression' },
  { id:'philo-questioning', number:'06', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410942/frame6_fbhc4b.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410942/frame6_fbhc4b.gif', title:'QUESTIONING', shortTitle:'QUESTIONING', tagline:'Questions without answers.', quote:'QUESTION', description:'Challenge everything, seek deeper truth' },
  { id:'philo-truth', number:'07', video:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410949/frame7_dnusjj.gif', mobileVideo:'https://res.cloudinary.com/dbtm7etag/image/upload/v1792410949/frame7_dnusjj.gif', title:'TRUTH', shortTitle:'TRUTH', tagline:'Where mystery begins.', quote:'SEEK', description:'Embrace the uncomfortable realities' },
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
  if (compact) return (
    <button type="button" onClick={()=>onSelect(index)} aria-label={`Select ${frame.title}`} aria-pressed={active}
      className="relative h-[clamp(54px,8vw,76px)] w-full min-w-0 overflow-hidden rounded-[2px] border text-left transition duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8b2e2e]"
      style={{background:tone.bg,borderColor:active?tone.accent:tone.border,transform:`rotate(${layout.rotate*.45}deg)`,boxShadow:active?`0 8px 20px rgba(0,0,0,.6),0 0 10px ${tone.accent}24`:'0 5px 14px rgba(0,0,0,.42)'}}>
      <span className="absolute left-1/2 top-[8px] z-10 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#87302d]"/>
      <span className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(8px,1.2vw,11px)] uppercase leading-tight tracking-[.05em]" style={{color:active?'#e5d8c8':tone.text}}>{frame.shortTitle}</span>
      {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#a9363d] to-transparent"/>}
    </button>
  );
  return (
    <button type="button" onClick={()=>onSelect(index)} aria-label={`Select ${frame.title}`} aria-pressed={active}
      className={`absolute aspect-[115/78] w-[clamp(88px,8.4vw,115px)] text-left transition-[filter] duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8b2e2e] ${active?'z-30 brightness-[1.08]':'z-10 hover:z-20 hover:brightness-[1.05]'}`}
      style={{left:`${layout.x}%`,top:`${layout.y}%`,transform:`rotate(${layout.rotate}deg)`}}>
      <span className="absolute left-1/2 top-[10px] z-30 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#a83838] to-[#6b1f1f] shadow-[0_0_8px_rgba(168,56,56,.5)]"/>
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
    <div className={`mb-4 ${compact?'text-center':'pl-1'}`}>
      <p className="font-mono text-[8px] font-medium uppercase tracking-[.32em] text-[#a79a8b]">Sacred Home of ...</p>
      <div className={`mt-2.5 h-px w-16 bg-[#9b343a]/65 ${compact?'mx-auto':''}`}/>
    </div>
    {compact ? <div className="mx-auto grid w-full max-w-[410px] gap-y-2.5">
      {NOTE_ROWS.map((row,rowIndex)=><div key={rowIndex} className="mx-auto grid w-full gap-2" style={{gridTemplateColumns:`repeat(${row.length},minmax(0,1fr))`,maxWidth:row.length===3?'100%':'76%'}}>
        {row.map(index=><StickyNote key={FRAMES[index].id} frame={FRAMES[index]} index={index} active={index===activeEntry} onSelect={selectEntry} compact/>)}
      </div>)}
    </div> : <div className="relative mx-auto h-[clamp(280px,28vw,360px)] w-full max-w-[390px] overflow-visible">
      <div className="pointer-events-none absolute inset-[4%_3%] blur-[18px]" style={{background:'radial-gradient(ellipse,rgba(109,74,48,.08),transparent 68%)'}}/>
      {FRAMES.map((frame,index)=><StickyNote key={frame.id} frame={frame} index={index} active={index===activeEntry} onSelect={selectEntry}/>)}
    </div>}
  </div>;
}

function VaultCard({active,navigate,compact=false}) {
  return <button type="button" onClick={()=>navigate('/login')} className={`group relative mx-auto block w-full overflow-hidden border border-[#9b8066]/20 bg-[#0b0a09] text-left shadow-[0_18px_48px_rgba(0,0,0,.48)] transition-all duration-500 hover:rotate-0 hover:border-[#a9363d]/35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#a9363d] ${compact?'min-h-[84px] max-w-[520px] px-5 py-3':'min-h-[94px] max-w-[350px] -rotate-[.6deg] px-5 py-3.5'}`}>
    <span className="pointer-events-none absolute inset-0 opacity-[.08]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)',backgroundSize:'10px 10px'}}/>
    <span className="relative block">
      <span className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[.25em] text-[#70685f]"><span>ESO — VAULT</span><span className="text-[#4f4943]">{active.number}</span></span>
      <span className="mt-2 block font-display text-[clamp(15px,1.4vw,19px)] uppercase leading-tight tracking-[.05em] text-[#c9c0b4]">{active.shortTitle}</span>
      <span className="mt-1.5 block font-mono text-[7px] uppercase tracking-[.15em] text-[#5d5750]">{active.tagline}</span>
      <span className="mt-2 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[.18em] text-[#a9363d]"><span>Enter Vault</span><span className="text-[10px] transition-transform group-hover:translate-x-1">→</span></span>
    </span>
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
    <div className="relative overflow-hidden border border-white/[.12] bg-[#090909] shadow-[0_30px_85px_rgba(0,0,0,.55)]">
      <div className={`relative w-full overflow-hidden ${compact?'aspect-[1.7/1]':'aspect-[1.62/1]'}`}>
        <ArchiveVideo key={active.id} frame={active} priority className="absolute inset-0 h-full w-full object-cover brightness-[.72] contrast-[1.08] saturate-[.76]"/>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.25),transparent_40%,rgba(0,0,0,.15)),linear-gradient(0deg,rgba(0,0,0,.3),transparent_35%,rgba(0,0,0,.18))]"/>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,.62)_100%)]"/>
        <div className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center ${compact?'px-4':'px-6 sm:px-10'}`}>
          <div className="relative flex items-center gap-3 sm:gap-4">
            <span className="font-mono text-[clamp(48px,6vw,72px)] font-black leading-none text-[#a9363d]" style={{textShadow:'0 0 20px rgba(169,54,61,.4)'}}>"</span>
            <p className="font-display text-[clamp(32px,5vw,56px)] font-black uppercase leading-none tracking-[.08em]" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #ff8c42 40%, #a9363d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,.95)) drop-shadow(0 0 12px rgba(169,54,61,.3))'
            }}>{active.quote}</p>
            <span className="font-mono text-[clamp(48px,6vw,72px)] font-black leading-none text-[#a9363d]" style={{textShadow:'0 0 20px rgba(169,54,61,.4)'}}>"</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 border border-white/[.07]"/>
        <button type="button" onClick={()=>navigate('/login')} aria-label={`Enter ${active.title}`} className="absolute inset-0 z-30 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a9363d]"><span className="sr-only">Enter {active.title}</span></button>
      </div>
    </div>
  </section>;
}

function FilmStrip({activeEntry,selectEntry}) {
  return <aside className="hidden h-[545px] min-w-0 lg:block" aria-label="Choose a memory">
    <div className="relative h-full w-full">
      <div className="absolute bottom-0 left-0 top-0 w-px bg-white/[.09]"/>
      <div className="flex h-full flex-col gap-[5px] pl-3">
        {FRAMES.map((frame,index)=>{const selected=index===activeEntry;return <button key={frame.id} type="button" onClick={()=>selectEntry(index)} aria-label={`Select ${frame.title}`} aria-pressed={selected} className="group relative min-h-0 flex-1 overflow-hidden text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#a9363d]">
          <ArchiveVideo frame={frame} priority={selected} className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${selected?'scale-100 opacity-80 grayscale-[.15]':'scale-[1.08] opacity-[.22] grayscale'} group-hover:scale-100 group-hover:opacity-[.62]`}/>
          <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20"/>
          <span className={`absolute right-2 top-2 z-10 font-mono text-[7px] ${selected?'text-[#e7dfd2]':'text-white/35 group-hover:text-white/70'}`}>{frame.number}</span>
          <span className="absolute bottom-1 left-1 top-1 flex flex-col justify-around">{Array.from({length:5}).map((_,hole)=><span key={hole} className="h-[3px] w-[3px] rounded-full bg-white/20"/>)}</span>
          {selected&&<span className="absolute bottom-2 left-3 h-[2px] w-5 bg-[#b9363f] shadow-[0_0_10px_rgba(185,54,63,.55)]"/>}
          <span className={`pointer-events-none absolute inset-0 border ${selected?'border-[#a9363d]/80':'border-white/[.04]'}`}/>
        </button>})}
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

  return <main className="relative isolate min-h-screen overflow-hidden bg-[#050505] text-[#e7e0d4]">
    {/* Subtle black / coffee atmosphere and film grain */}
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]"/>
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at 56% 48%,rgba(93,58,35,.08),transparent 32%),radial-gradient(circle at 12% 65%,rgba(101,75,49,.035),transparent 27%)'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at center,transparent 35%,rgba(0,0,0,.65) 100%)'}}/>
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
