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
  Wind,
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
    title: 'Rain',
    subtitle: 'Kyoto soft rain',
    icon: CloudRain,
  },
  {
    id: 'hearth',
    title: 'Fireplace',
    subtitle: 'Warm quiet hearth',
    icon: Flame,
  },
  {
    id: 'nordic',
    title: 'Wind',
    subtitle: 'Soft distant drone',
    icon: Wind,
  },
  {
    id: 'celestial',
    title: 'Ambient',
    subtitle: 'Calm background hum',
    icon: Radio,
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
      aria-label="Background Sound Player"
    >
      <AnimatePresence>
        {isAudioDockOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="mb-2 w-64 p-3 border shadow-2xl"
            style={{
              background: '#0a0a0a',
              borderRadius: '8px',
              borderColor: '#21262d',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <span className="text-xs font-mono font-medium text-[#e6edf3]">
                Sounds
              </span>

              {!isPatron && (
                <button
                  type="button"
                  onClick={() => dispatch(openMembershipModal())}
                  className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-[#21262d] text-[#8b949e] hover:text-[#e6edf3]"
                >
                  Pass
                </button>
              )}
            </div>

            {/* Track list */}
            <div className="py-1.5 space-y-1">
              {TRACKS.map((t) => {
                const isSelected = t.id === currentTrack;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => dispatch(setSoundscapeTrack(t.id))}
                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left transition-colors ${
                      isSelected
                        ? 'bg-[#21262d] text-[#e6edf3]'
                        : 'text-[#8b949e] hover:bg-white/[0.03] hover:text-[#e6edf3]'
                    }`}
                  >
                    <Icon size={13} className={isSelected ? 'text-[#e6edf3]' : 'text-[#6e7681]'} />
                    <span className="text-xs font-mono truncate">{t.title}</span>
                    {isSelected && isPlaying && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6FF] ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Volume */}
            <div className="pt-2 border-t border-[#21262d] flex items-center gap-2">
              <button
                type="button"
                onClick={handleMuteToggle}
                className="text-[#6e7681] hover:text-[#e6edf3] transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {volume === 0 || isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-[#21262d] rounded appearance-none cursor-pointer accent-[#e6edf3]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded border cursor-pointer select-none transition-colors"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          borderColor: '#21262d',
        }}
        onClick={() => dispatch(toggleAudioDock())}
      >
        <button
          type="button"
          onClick={handlePlayToggle}
          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
          style={{
            backgroundColor: isPlaying ? '#e6edf3' : 'rgba(255,255,255,0.06)',
            color: isPlaying ? '#000000' : '#8b949e',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={9} fill="currentColor" />
          ) : (
            <Play size={9} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <ActiveIcon size={12} className="text-[#8b949e]" />
          <span className="text-xs font-mono text-[#e6edf3]">
            {activeTrackObj.title}
          </span>
        </div>

        <button
          type="button"
          className="text-[#6e7681] hover:text-[#e6edf3] transition-colors ml-1"
        >
          {isAudioDockOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      </div>
    </aside>
  );
}
