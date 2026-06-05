'use client';
import { createContext, useContext, useState, useCallback } from "react";
import Toast from "@/components/ui/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    // Primero marca como leaving para disparar animación de salida
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    // Después de la animación, elimina del array
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(({ msg, color, icon }) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, msg, color, icon, leaving: false }]);
    // Timer automático
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 end-2 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            icon={toast.icon}
            msg={toast.msg}
            color={toast.color}
            leaving={toast.leaving}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}