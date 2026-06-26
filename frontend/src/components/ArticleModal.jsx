import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

/**
 * ArticleModal - In-app article viewer with iframe
 * Displays external articles within the app
 */
function ArticleModal({ article, onClose }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      onClick={onClose}
    >
      <div 
        className="relative bg-black border border-white/10 rounded-2xl overflow-hidden w-full max-w-5xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 flex items-start justify-between border-b border-white/10 bg-black">
          <div className="flex-1 pr-4">
            <h3 className="text-white font-medium text-sm mb-1">{article.title}</h3>
            <p className="text-white/50 text-xs">{article.source}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink size={16} className="text-white/70" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Article Iframe */}
        <div className="flex-1 relative bg-white">
          <iframe
            src={article.link}
            title={article.title}
            className="absolute inset-0 w-full h-full"
            onLoad={() => setLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs uppercase tracking-wider">{article.category}</span>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-xs flex items-center gap-2 transition-colors"
            >
              View Original
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleModal;
