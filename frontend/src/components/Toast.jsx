import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Beautiful Toast Notification Component
 * Cozy, artistic design matching ESO aesthetic
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#22c55e]',
          icon: 'text-[#22c55e]',
          text: 'text-[#e5e5e5]'
        };
      case 'error':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#ef4444]',
          icon: 'text-[#ef4444]',
          text: 'text-[#e5e5e5]'
        };
      case 'warning':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#f59e0b]',
          icon: 'text-[#f59e0b]',
          text: 'text-[#e5e5e5]'
        };
      default:
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#2EE6FF]',
          icon: 'text-[#2EE6FF]',
          text: 'text-[#e5e5e5]'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
    >
      <div
        className={`${colors.bg} ${colors.border} border rounded-lg shadow-2xl backdrop-blur-sm`}
        style={{
          minWidth: '280px',
          maxWidth: '400px',
        }}
      >
        <div className="flex items-start gap-3 p-4">
          <div className={colors.icon}>{getIcon()}</div>
          <p className={`${colors.text} text-sm flex-1 leading-relaxed`}>
            {message}
          </p>
          <button
            onClick={handleClose}
            className="text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
