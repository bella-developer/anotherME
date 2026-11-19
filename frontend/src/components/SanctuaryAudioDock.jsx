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
    accent: '#2EE6FF',
  },
  {
    id: 'hearth',
    title: 'Midnight Hearth',
    subtitle: 'Warm ember rumble & fireside pops',
    icon: Flame,
    accent: '#FF9D1C',
  },
  {
    id: 'nordic',
    title: 'Nordic Solitude',
    subtitle: '432Hz ambient drone & harmonic sweep',
    icon: Compass,
    accent: '#e6edf3',
  },
  {
    id: 'celestial',
    title: 'Celestial Theta',
    subtitle: '6Hz binaural beat for deep contemplative focus',
    icon: Radio,
    accent: '#B56DFF',
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
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 max-w-sm"
      aria-label="Sanctuary Soundscape Player"
    >
      <AnimatePresence>
        {isAudioDockOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mb-2 w-72 sm:w-80 p-3.5 border shadow-2xl"
            style={{
              background: '#0a0a0a',
              borderRadius: '8px',
              borderColor: '#21262d',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#21262d]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b949e] font-mono block">
                  Soundscape
                </span>
                <span className="text-xs text-[#e6edf3] font-mono font-medium block">
                  Generative Audio
                </span>
              </div>

              {!isPatron && (
                <button
                  onClick={() => dispatch(openMembershipModal())}
                  className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] font-mono transition-colors"
                >
                  Pass
                </button>
              )}
            </div>

            {/* Soundscape List */}
            <div className="py-2 space-y-1" role="radiogroup" aria-label="Select ambient soundscape">
              {TRACKS.map((t) => {
                const isSelected = t.id === currentTrack;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => dispatch(setSoundscapeTrack(t.id))}
                    role="radio"
                    aria-checked={isSelected}
                    className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-all ${
                      isSelected
                        ? 'bg-[#21262d] border border-[#30363d]'
                        : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-[#e6edf3]' : 'text-[#6e7681]'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#e6edf3] truncate">
                          {t.title}
                        </span>
                        {isSelected && isPlaying && (
                          <span className="flex items-center gap-0.5 h-2.5">
                            <span className="w-0.5 h-full bg-[#2EE6FF] animate-pulse" />
                            <span className="w-0.5 h-2/3 bg-[#2EE6FF] animate-pulse delay-75" />
                            <span className="w-0.5 h-full bg-[#2EE6FF] animate-pulse delay-150" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-[#6e7681] truncate">
                        {t.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="pt-2 border-t border-[#21262d]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6e7681] mb-1">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-[#6e7681] hover:text-[#e6edf3] transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {volume === 0 || isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Soundscape volume slider"
                  className="w-full h-1 bg-[#21262d] rounded appearance-none cursor-pointer accent-[#e6edf3]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Dock */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded border shadow-xl cursor-pointer select-none transition-colors"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          borderColor: '#21262d',
        }}
        onClick={() => dispatch(toggleAudioDock())}
      >
        <button
          onClick={handlePlayToggle}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors flex-shrink-0"
          style={{
            backgroundColor: isPlaying ? '#e6edf3' : 'rgba(255,255,255,0.06)',
            color: isPlaying ? '#000000' : '#8b949e',
          }}
          aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
        >
          {isPlaying ? (
            <Pause size={10} fill="currentColor" />
          ) : (
            <Play size={10} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <div className="flex items-center gap-1.5 pr-1">
          <ActiveIcon size={12} className="text-[#8b949e]" />
          <span className="text-xs font-mono text-[#e6edf3]">
            {activeTrackObj.title}
          </span>
          {isPlaying && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6FF] animate-pulse ml-0.5" />
          )}
        </div>

        <button
          type="button"
          className="text-[#6e7681] hover:text-[#e6edf3] transition-colors"
          aria-label={isAudioDockOpen ? 'Collapse player' : 'Expand player'}
        >
          {isAudioDockOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
      </div>
    </aside>
  );
}
