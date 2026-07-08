interface ChakraMotifProps {
  size?: number;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  animate?: boolean;
  fast?: boolean;
}

export function ChakraMotif({
  size = 32,
  className = "",
  stroke = "currentColor",
  strokeWidth = 1.5,
  animate = false,
  fast = false,
}: ChakraMotifProps) {
  const spokes = 24;
  const cx = 50;
  const cy = 50;
  const outerR = 46;
  const innerR = 8;

  const spokeLines = Array.from({ length: spokes }, (_, i) => {
    const angle = (i * 360) / spokes - 90;
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + innerR * Math.cos(rad);
    const y1 = cy + innerR * Math.sin(rad);
    const x2 = cx + outerR * Math.cos(rad);
    const y2 = cy + outerR * Math.sin(rad);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  });

  const animClass = fast ? "chakra-spin-fast" : animate ? "chakra-spin" : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animClass} ${className}`}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r={outerR} stroke={stroke} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cy} r={innerR} stroke={stroke} strokeWidth={strokeWidth} />
      {spokeLines}
      <circle cx={cx} cy={cy} r={2.5} fill={stroke} />
    </svg>
  );
}

export function ChakraSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <ChakraMotif size={24} stroke="var(--color-ink)" fast className="text-ink" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
