import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Tiny Confirmation Dialog Component
 * Minimal, cozy design - just asks "Delete?" with Yes/No
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'danger' // danger, warning, info
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      style={{
        animation: prefersReducedMotion ? 'none' : 'fadeIn 150ms ease-out',
      }}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl"
        style={{
          animation: prefersReducedMotion ? 'none' : 'slideUp 200ms ease-out',
          minWidth: '240px',
          maxWidth: '280px',
        }}
      >
        {/* Message */}
        <div className="p-4 text-center">
          <p className="text-[#e5e5e5] text-sm">Delete?</p>
        </div>

        {/* Actions */}
        <div className="flex items-center border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#2a2a2a] transition-all text-sm font-medium border-r border-[#2a2a2a]"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-[#ef4444] hover:text-[#ff5555] hover:bg-[#2a2a2a] transition-all text-sm font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
