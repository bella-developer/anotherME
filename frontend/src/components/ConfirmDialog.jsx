import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Professional Minimal Confirmation Dialog
 * Dark aesthetic with subtle glow, minimal borders, artistic design
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'danger'
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 200ms ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          minWidth: '280px',
          maxWidth: '320px',
          animation: prefersReducedMotion ? 'none' : 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Message */}
        <div className="px-8 pt-8 pb-6 text-center">
          <p 
            className="text-[#e5e5e5] tracking-wide"
            style={{
              fontSize: '15px',
              fontWeight: '400',
              letterSpacing: '0.02em',
            }}
          >
            Delete?
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-stretch">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-[#9b9b9b] hover:text-[#e5e5e5] transition-all duration-200 relative group"
            style={{
              fontSize: '13px',
              fontWeight: '500',
              letterSpacing: '0.04em',
              background: 'transparent',
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              borderRight: '1px solid rgba(255, 255, 255, 0.03)',
              borderBottomLeftRadius: '8px',
            }}
          >
            <span className="relative z-10">No</span>
            <div 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-200"
              style={{ borderBottomLeftRadius: '8px' }}
            />
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 transition-all duration-200 relative group"
            style={{
              fontSize: '13px',
              fontWeight: '500',
              letterSpacing: '0.04em',
              color: '#ef4444',
              background: 'transparent',
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              borderBottomRightRadius: '8px',
            }}
          >
            <span className="relative z-10 group-hover:text-[#ff5555]">Yes</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-200"
              style={{ 
                background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                borderBottomRightRadius: '8px'
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
