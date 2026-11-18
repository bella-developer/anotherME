import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CloudRain,
  Flame,
  Compass,
  Radio,
} from 'lucide-react';
import {
  toggleSoundscape,
  setSoundscapeTrack,
  setSoundscapeVolume,
  toggleAudioDock,
  openMembershipModal,
} from '../features/sanctuarySlice';

const TRACKS = [
  {
    id: 'rain',
    title: 'Kyoto Rain',
    subtitle: 'Filtered pink noise & droplet resonance',
    icon: CloudRain,
    accent: '#397982',
  },
  {
    id: 'hearth',
    title: 'Midnight Hearth',
    subtitle: 'Warm ember rumble & fireside pops',
    icon: Flame,
    accent: '#D97757',
  },
  {
    id: 'nordic',
    title: 'Nordic Solitude',
    subtitle: '432Hz ambient drone & slow harmonic sweep',
    icon: Compass,
    accent: '#8BA4B4',
  },
  {
    id: 'celestial',
    title: 'Celestial Theta',
    subtitle: '6Hz binaural beat for deep contemplative focus',
    icon: Radio,
    accent: '#76517F',
  },
];

export default function SanctuaryAudioDock() {
  const dispatch = useDispatch();
  const { isPlaying, currentTrack, volume, isAudioDockOpen, isPatron } = useSelector(
    (state) => state.sanctuary
  );
  const [isMuted, setIsMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(volume);

  const activeTrackObj = TRACKS.find((t) => t.id === currentTrack) || TRACKS[0];
  const ActiveIcon = activeTrackObj.icon;

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleSoundscape());
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setSoundscapeVolume(val));
    if (val > 0 && isMuted) setIsMuted(false);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (isMuted) {
      dispatch(setSoundscapeVolume(lastVolume || 0.5));
      setIsMuted(false);
    } else {
      setLastVolume(volume);
      dispatch(setSoundscapeVolume(0));
      setIsMuted(true);
    }
  };

  return (
    <aside
      className="fixed bottom-4 right-4 z-40 max-w-sm"
      aria-label="Zenith Sanctuary Soundscape Player"
    >
      <AnimatePresence>
        {isAudioDockOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 w-80 rounded-2xl p-4 shadow-2xl border"
            style={{
              background: 'rgba(10, 10, 12, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${activeTrackObj.accent}25`,
                    color: activeTrackObj.accent,
                  }}
                >
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-white/90">
                    Zenith Sanctuary
                  </h3>
                  <p className="text-[10px] text-white/40 tracking-wide">
                    Generative Focus Soundscapes
                  </p>
                </div>
              </div>

              {!isPatron && (
                <button
                  onClick={() => dispatch(openMembershipModal())}
                  className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                >
                  Sanctuary Pass
                </button>
              )}
            </div>

            {/* Soundscape List */}
            <div className="py-3 space-y-1.5" role="radiogroup" aria-label="Select ambient soundscape">
              {TRACKS.map((t) => {
                const isSelected = t.id === currentTrack;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => dispatch(setSoundscapeTrack(t.id))}
                    role="radio"
                    aria-checked={isSelected}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-white/10 border border-white/15'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? `${t.accent}33` : 'rgba(255,255,255,0.04)',
                        color: isSelected ? t.accent : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/90 truncate">
                          {t.title}
                        </span>
                        {isSelected && isPlaying && (
                          <span className="flex items-center gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                            <span className="w-0.5 h-2/3 bg-cyan-400 animate-pulse delay-75" />
                            <span className="w-0.5 h-full bg-cyan-400 animate-pulse delay-150" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 truncate">{t.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-1.5">
                <span>Sanctuary Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {volume === 0 || isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Soundscape volume slider"
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D97757]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Dock */}
      <motion.div
        layout
        className="flex items-center gap-2 px-3 py-2 rounded-full border shadow-xl cursor-pointer"
        style={{
          background: 'rgba(15, 15, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: isPlaying ? `${activeTrackObj.accent}55` : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isPlaying
            ? `0 10px 30px rgba(0,0,0,0.6), 0 0 20px ${activeTrackObj.accent}25`
            : '0 10px 30px rgba(0,0,0,0.5)',
        }}
        onClick={() => dispatch(toggleAudioDock())}
      >
        <button
          onClick={handlePlayToggle}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
          style={{
            backgroundColor: isPlaying ? activeTrackObj.accent : 'rgba(255,255,255,0.1)',
            color: isPlaying ? '#000' : '#fff',
          }}
          aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
        >
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="flex items-center gap-1.5 pl-0.5 pr-1">
          <ActiveIcon size={13} style={{ color: activeTrackObj.accent }} />
          <span className="text-xs font-medium text-white/90 tracking-wide">
            {activeTrackObj.title}
          </span>
          {isPlaying && (
            <span className="flex items-center gap-0.5 h-2.5 ml-1">
              <span className="w-0.5 h-full bg-emerald-400/80 animate-pulse" />
              <span className="w-0.5 h-1/2 bg-emerald-400/80 animate-pulse delay-75" />
              <span className="w-0.5 h-3/4 bg-emerald-400/80 animate-pulse delay-150" />
            </span>
          )}
        </div>

        <button
          type="button"
          className="text-white/40 hover:text-white transition-colors pl-1"
          aria-label={isAudioDockOpen ? 'Collapse player' : 'Expand player'}
        >
          {isAudioDockOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </motion.div>
    </aside>
  );
}
