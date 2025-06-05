import React, { createContext, useContext, useRef } from 'react';
import ToastMessage, { ToastMessageRef } from '../components/Toast';

interface ToastContextData {
  showToast: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'danger') => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastRef = useRef<ToastMessageRef>(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'danger') => {
    toastRef.current?.show(title, message, type);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastMessage ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 