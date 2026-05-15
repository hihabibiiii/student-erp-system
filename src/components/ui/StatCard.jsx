import { motion } from "framer-motion";
import { cardHover } from "../../animations/transitions";

export default function StatCard({ icon: Icon, label, value, tone = "cyan", meta }) {
  const tones = {
    cyan: "text-brand-200 bg-brand-300/12 light:text-brand-700",
    violet: "text-indigo-200 bg-indigo-300/12 light:text-indigo-700",
    lime: "text-emerald-200 bg-emerald-300/12 light:text-emerald-700",
    rose: "text-rose-200 bg-rose-300/12 light:text-rose-700"
  };

  return (
    <motion.article {...cardHover} className="panel interactive-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-2xl font-extrabold tracking-normal text-title">{value}</p>
          {meta ? <p className="mt-2 text-xs font-semibold text-muted">{meta}</p> : null}
        </div>
        <div className={`rounded-2xl p-3 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.article>
  );
}
