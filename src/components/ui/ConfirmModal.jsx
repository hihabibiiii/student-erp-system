import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ open, title, description, confirmHref, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/72 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            className="panel w-full max-w-md"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="rounded-2xl bg-rose-400/15 p-2 text-rose-200 light:text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-title">{title}</h2>
                  <p className="mt-1 text-sm text-muted">{description}</p>
                </div>
              </div>
              <button className="btn-ghost p-2" type="button" onClick={onClose} aria-label="Close modal">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="btn-ghost" type="button" onClick={onClose}>Cancel</button>
              <a className="btn-danger" href={confirmHref}>Delete</a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
