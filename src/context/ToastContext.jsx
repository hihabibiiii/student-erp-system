import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3400);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toast.type === "error" ? XCircle : CheckCircle2;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.98 }}
                className="glass flex items-start gap-3 p-4"
                role="status"
              >
                <Icon className={toast.type === "error" ? "h-5 w-5 text-rose-300 light:text-rose-700" : "h-5 w-5 text-emerald-300 light:text-emerald-700"} />
                <p className="text-sm font-semibold text-title">{toast.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
