/** Crispy's face as a compact mark: the same drawing as the favicon. */
export function CrispyMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path d="M30 17L20 7" stroke="#000" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M34 17L43 8L52 10" fill="none" stroke="#000" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={53} cy={10.5} r={3.2} fill="#FF5A1F" stroke="#000" strokeWidth={2.5} />
      <g transform="translate(19.5 9.5) scale(0.36)">
        <path
          d="M0 0C-8 0-11-7-8-13C-6-17-2-19-1-26C4-22 6-18 5-13C7-15 8-17 8-19C12-14 11-6 7-3C5-1 3 0 0 0Z"
          fill="#FF5A1F"
          stroke="#000"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <path d="M0-3C-4-3-5-6-3-9C-2-11 0-12 0-15C3-12 4-9 3-6C3-4 2-3 0-3Z" fill="#FFD23F" />
      </g>
      <rect x={3.5} y={17} width={57} height={44} rx={12} fill="#FF5A1F" stroke="#000" strokeWidth={3.5} />
      <rect x={9.5} y={23} width={37} height={32} rx={8} fill="#000" />
      <circle cx={21} cy={37} r={5.6} fill="#FFFDF7" />
      <circle cx={35} cy={37} r={5.6} fill="#FFFDF7" />
      <circle cx={22.2} cy={39} r={2.6} fill="#000" />
      <circle cx={36.2} cy={39} r={2.6} fill="#000" />
      <rect x={14} y={30} width={28} height={6.6} fill="#000" />
      <path d="M30.5 30Q35 26 40.5 28.5" fill="none" stroke="#FFFDF7" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M20.5 47.5Q29 51 36.5 44.5" fill="none" stroke="#FFFDF7" strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={53.5} cy={31} r={3.2} fill="#FFD23F" stroke="#000" strokeWidth={2} />
      <circle cx={53.5} cy={42} r={3.2} fill="#FFD23F" stroke="#000" strokeWidth={2} />
      <path d="M50.5 50H56.5" stroke="#000" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/** App-icon style tile used beside the name and on notification cards. */
export function CrispyTile({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center bg-[#1a1a1a] ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
    >
      <CrispyMark size={size * 0.8} />
    </span>
  );
}
