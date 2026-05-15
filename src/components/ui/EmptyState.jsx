import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No records found", description = "Try adjusting your filters." }) {
  return (
    <div className="glass flex flex-col items-center justify-center px-6 py-14 text-center">
      <Inbox className="h-10 w-10 text-brand-200 light:text-brand-700" />
      <h3 className="mt-4 text-lg font-bold text-title">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
