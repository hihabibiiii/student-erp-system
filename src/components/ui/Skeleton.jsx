export default function Skeleton({ className = "h-6 w-full" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 light:bg-slate-200 ${className}`} />;
}
