import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toastOrMessage, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    let toastItem;

    if (typeof toastOrMessage === 'object' && toastOrMessage !== null) {
      toastItem = {
        id,
        title: toastOrMessage.title || null,
        message: toastOrMessage.message || '',
        type: toastOrMessage.type || type || 'info',
        duration: toastOrMessage.duration || duration,
      };
    } else {
      toastItem = {
        id,
        title: null,
        message: String(toastOrMessage ?? ''),
        type: type || 'info',
        duration,
      };
    }

    setToasts((prev) => [...prev, toastItem]);
    return id;
  }, []);

  const showToast = addToast;

  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );
  const showSuccess = success;

  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );
  const showError = error;

  const warning = useCallback(
    (message, duration) => addToast(message, 'warning', duration),
    [addToast]
  );
  const showWarning = warning;

  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );
  const showInfo = info;

  return (
    <ToastContext.Provider
      value={{
        addToast,
        showToast,
        success,
        showSuccess,
        error,
        showError,
        warning,
        showWarning,
        info,
        showInfo,
        removeToast,
      }}
    >
      {children}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
