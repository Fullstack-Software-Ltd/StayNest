// Imigongo SVG Pattern — Rwandan geometric art for UrugoStay backgrounds
// Usage: <ImigonoPattern variant="gold" /> or <ImigonoPattern variant="green" />
// Place inside any relative/overflow-hidden container as an absolute layer

interface ImigongoPatternProps {
  variant?: 'gold' | 'green' | 'dark'
  opacity?: number
  className?: string
}

export function ImigongoPattern({ 
  variant = 'gold', 
  opacity = 1,
  className = ''
}: ImigongoPatternProps) {
  const colorMap = {
    gold: {
      primary: '#D4A853',
      secondary: '#B8912F',
      accent: '#E8C97A',
      fill: 'rgba(212, 168, 83, 0.15)',
    },
    green: {
      primary: '#1B4332',
      secondary: '#0F2E21',
      accent: '#2D6A4F',
      fill: 'rgba(27, 67, 50, 0.12)',
    },
    dark: {
      primary: 'rgba(255,255,255,0.12)',
      secondary: 'rgba(255,255,255,0.06)',
      accent: 'rgba(212, 168, 83, 0.3)',
      fill: 'rgba(255,255,255,0.04)',
    }
  }

  const c = colorMap[variant]

  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        {/* Imigongo tile pattern — 80x80 cell */}
        <pattern id={`imigongo-${variant}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Background cell */}
          <rect width="80" height="80" fill="transparent" />

          {/* ── Row 1: top-left to center diagonal blocks ── */}
          <polygon points="0,0 20,0 0,20" fill={c.primary} />
          <polygon points="20,0 40,0 40,20 20,20" fill={c.fill} />
          <polygon points="40,0 60,0 60,20 40,20" fill={c.secondary} />
          <polygon points="60,0 80,0 80,20" fill={c.accent} />

          {/* ── Row 2: hourglass motif ── */}
          <polygon points="0,20 20,20 10,40" fill={c.accent} />
          <polygon points="20,20 40,20 40,40 20,40" fill={c.secondary} />
          <polygon points="40,20 60,20 40,40" fill={c.fill} />
          <polygon points="60,20 80,20 80,40 70,40" fill={c.primary} />

          {/* ── Row 3: central diamond ── */}
          <polygon points="0,40 20,40 0,60" fill={c.secondary} />
          <polygon points="10,40 40,40 40,60 10,60" fill={c.fill} />
          <polygon points="40,40 60,40 60,60 40,60" fill={c.accent} />
          <polygon points="70,40 80,40 80,60" fill={c.primary} />

          {/* ── Row 4: mirrored bottom ── */}
          <polygon points="0,60 20,60 0,80" fill={c.accent} />
          <polygon points="20,60 40,60 20,80" fill={c.secondary} />
          <polygon points="40,60 60,60 60,80 40,80" fill={c.fill} />
          <polygon points="60,60 80,60 80,80" fill={c.primary} />

          {/* ── Centre motif: cross-hatched diamond ── */}
          <polygon points="40,20 60,40 40,60 20,40" fill={c.secondary} opacity="0.7" />
          <polygon points="40,28 52,40 40,52 28,40" fill={c.accent} opacity="0.5" />
          <polygon points="40,34 46,40 40,46 34,40" fill={c.primary} opacity="0.8" />
        </pattern>

        {/* Subtle radial fade mask so edges blend into the background */}
        <radialGradient id={`imigongo-fade-${variant}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`imigongo-mask-${variant}`}>
          <rect width="100%" height="100%" fill={`url(#imigongo-fade-${variant})`} />
        </mask>
      </defs>

      {/* Apply the repeating pattern across the full area */}
      <rect
        width="100%"
        height="100%"
        fill={`url(#imigongo-${variant})`}
        mask={`url(#imigongo-mask-${variant})`}
      />
    </svg>
  )
}
