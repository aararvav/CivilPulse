export function SubmitPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-canvas-raised text-left shadow-sm">
      <div className="border-b border-line bg-canvas px-4 py-2.5">
        <p className="font-display text-sm font-semibold text-ink">Submit a Development Request</p>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-[10px] font-medium text-ink">Title</p>
          <div className="mt-1 h-8 rounded-lg border border-line bg-canvas px-2 text-[10px] leading-8 text-slate-civic">
            School building repair in Ward 3
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-ink">Description</p>
          <div className="mt-1 h-16 rounded-lg border border-line bg-canvas p-2 text-[10px] text-slate-civic">
            स्कूल की बिल्डिंग जर्जर है… (Hindi + English supported)
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 rounded-lg border border-line bg-canvas" />
          <div className="h-8 rounded-lg border border-line bg-canvas" />
        </div>
        <div className="btn-primary pointer-events-none h-9 w-full text-xs">Submit request</div>
      </div>
    </div>
  );
}

export function AiSummaryPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-canvas-raised text-left shadow-sm">
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-display text-sm font-semibold text-ink">My Submissions</p>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-ink">School repair request (roof leak)</p>
        <p className="mt-2 text-[10px] text-slate-civic line-clamp-2">
          Your description: स्कूल की बिल्डिंग जर्जर है और बारिश में पानी टपकता है…
        </p>
        <div className="mt-3 rounded-lg border border-line bg-canvas p-2.5 chakra-accent-border">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-ink/70">AI Analysis</p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink">
            Classroom roof leak poses immediate safety risk; recurring school infrastructure pattern in Ward 1.
          </p>
        </div>
        <span className="mt-2 inline-flex rounded-full border border-danger/30 bg-danger/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-danger">
          High · 72
        </span>
      </div>
    </div>
  );
}

export function MapPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-canvas-raised text-left shadow-sm">
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-display text-sm font-semibold text-ink">Submission Map</p>
      </div>
      <div className="relative h-44 bg-[#e8ecef]">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        {[
          { top: "30%", left: "25%", color: "#2563eb" },
          { top: "45%", left: "55%", color: "#ea580c" },
          { top: "60%", left: "35%", color: "#dc2626" },
          { top: "25%", left: "70%", color: "#0891b2" },
          { top: "55%", left: "78%", color: "#7c3aed" },
        ].map((pin, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 rounded-full border-2 border-white shadow"
            style={{ top: pin.top, left: pin.left, backgroundColor: pin.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-3 py-2 text-[9px] text-slate-civic">
        <span>● Education</span><span>● Roads</span><span>● Health</span>
      </div>
    </div>
  );
}

export function ThemesPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-canvas-raised text-left shadow-sm">
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-display text-sm font-semibold text-ink">Development Themes</p>
      </div>
      <table className="w-full text-[10px]">
        <thead className="bg-canvas text-slate-civic">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Theme</th>
            <th className="px-3 py-2 text-right font-medium">Count</th>
            <th className="px-3 py-2 text-right font-medium">Rank</th>
          </tr>
        </thead>
        <tbody className="text-ink">
          {[
            ["Education & Schools", "12", "480"],
            ["Roads & Transport", "9", "360"],
            ["Health Services", "7", "280"],
          ].map(([name, count, rank]) => (
            <tr key={name} className="border-t border-line">
              <td className="px-3 py-2">{name}</td>
              <td className="px-3 py-2 text-right font-mono">{count}</td>
              <td className="px-3 py-2 text-right font-mono font-semibold text-ink">{rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComparePreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-canvas-raised text-left shadow-sm">
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-display text-sm font-semibold text-ink">Demand vs. Data</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-line">
        <div className="bg-canvas-raised p-3">
          <p className="text-[9px] font-semibold uppercase text-slate-civic">Citizen Demand</p>
          <p className="mt-1 font-mono text-lg font-semibold text-ink">8</p>
          <p className="text-[9px] text-slate-civic">education submissions</p>
        </div>
        <div className="bg-canvas-raised p-3">
          <p className="text-[9px] font-semibold uppercase text-slate-civic">Official Data</p>
          <p className="mt-1 font-mono text-lg font-semibold text-ink">12,400</p>
          <p className="text-[9px] text-slate-civic">enrollment · Ward 1</p>
        </div>
      </div>
      <div className="border-t border-line bg-canvas p-3 chakra-accent-border">
        <p className="text-[9px] leading-relaxed text-ink">
          8 submissions requesting school upgrades in Ward 1 — higher demand signal than vocational proposals.
        </p>
      </div>
    </div>
  );
}
