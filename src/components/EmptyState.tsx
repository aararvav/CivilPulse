import { ChakraMotif } from "@/components/ui/Chakra";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-[12px] border border-dashed border-line bg-canvas-raised px-6 py-14 text-center">
      <div className="mb-4 opacity-20 text-ink">
        <ChakraMotif size={48} stroke="var(--color-ink)" />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-civic">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
