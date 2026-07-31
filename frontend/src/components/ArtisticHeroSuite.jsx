import { useRef } from 'react';
import IntrovertHomeSection from './IntrovertHomeSection';
import FloatingThoughtsGrid from './FloatingThoughtsGrid';
import HorizontalHero from './HorizontalHero';

export default function ArtisticHeroSuite() {
  const thoughtsRef = useRef(null);
  const roomsRef = useRef(null);

  const scrollToThoughts = () => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRooms = () => {
    if (roomsRef.current) {
      roomsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-black">
      {/* Hero Stage 1: "It's an Introvert's Home" Silhouette Experience */}
      <IntrovertHomeSection 
        onExploreClick={scrollToThoughts}
        onWhisperClick={scrollToThoughts}
      />

      {/* Hero Stage 2: Floating Artistic Message Grid of Deep Thoughts */}
      <div ref={thoughtsRef}>
        <FloatingThoughtsGrid onWhisperTrigger={scrollToRooms} />
      </div>

      {/* Hero Stage 3: The Three Sanctuaries (Dark, Fantasy, Philo Rooms) */}
      <div ref={roomsRef} className="relative z-20">
        <div className="relative bg-black pt-12 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-semibold">
              ✦ STEP INTO THE SANCTUARIES
            </span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-extralight text-white tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore the <span className="italic text-purple-200">Three Rooms</span>
          </h2>
        </div>
        <HorizontalHero />
      </div>
    </div>
  );
}
