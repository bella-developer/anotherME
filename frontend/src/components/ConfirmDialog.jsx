import { AlertTriangle } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Beautiful Confirmation Dialog Component
 * Elegant, cozy design matching ESO aesthetic
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // warning, danger, info
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-[#ef4444]',
          confirmBg: 'bg-[#ef4444]',
          confirmHover: 'hover:bg-[#dc2626]'
        };
      case 'info':
        return {
          icon: 'text-[#2EE6FF]',
          confirmBg: 'bg-[#2EE6FF]',
          confirmHover: 'hover:bg-[#1dd5ef]'
        };
      default:
        return {
          icon: 'text-[#f59e0b]',
          confirmBg: 'bg-[#f59e0b]',
          confirmHover: 'hover:bg-[#ea580c]'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      style={{
        animation: prefersReducedMotion ? 'none' : 'fadeIn 200ms ease-out',
      }}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-md"
        style={{
          animation: prefersReducedMotion ? 'none' : 'slideUp 300ms ease-out',
        }}
      >
        {/* Icon & Title */}
        <div className="flex items-start gap-4 p-6 border-b border-[#2a2a2a]">
          <div className={`${colors.icon} flex-shrink-0 mt-1`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
            <p className="text-[#a3a3a3] text-sm mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#2a2a2a] text-[#e5e5e5] hover:bg-[#3a3a3a] transition-colors text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg ${colors.confirmBg} ${colors.confirmHover} text-[#050505] transition-colors text-sm font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
