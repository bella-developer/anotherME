import { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

/**
 * VideoModal - In-app YouTube player with minimal, artistic design
 * Plays videos within the app without external redirects
 */
function VideoModal({ video, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!video) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&modestbranding=1&rel=0`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      onClick={onClose}
    >
      <div 
        className={`relative bg-black border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 ${
          isExpanded ? 'w-full max-w-6xl' : 'w-full max-w-3xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-start justify-between bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex-1 pr-4">
            <h3 className="text-white font-medium text-sm mb-1">{video.title}</h3>
            <p className="text-white/50 text-xs">{video.creator}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? (
                <Minimize2 size={16} className="text-white/70" />
              ) : (
                <Maximize2 size={16} className="text-white/70" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className={`relative ${isExpanded ? 'aspect-video' : 'aspect-video'}`}>
          <iframe
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40 uppercase tracking-wider">{video.category}</span>
            <span className="text-white/40">{video.duration}</span>
          </div>
          {video.description && (
            <p className="text-white/60 text-xs mt-3 leading-relaxed">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
