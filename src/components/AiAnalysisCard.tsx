import { ChakraMotif } from "@/components/ui/Chakra";

export function AiAnalysisCard({ summary }: { summary: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-canvas p-3.5 chakra-accent-border">
      <div className="mb-2 flex items-center gap-2">
        <ChakraMotif size={20} stroke="var(--color-ink)" className="opacity-60" />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/80">
          AI Analysis
        </span>
      </div>
      <p className="text-sm leading-relaxed text-ink">{summary}</p>
    </div>
  );
}
