interface PixelIconProps {
  type: "gavel" | "code" | "heart-beat" | "calendar" | "upload" | "user" | "book" | "cog" | "briefcase"
  className?: string
}

export function PixelIcon({ type, className = "w-4 h-4" }: PixelIconProps) {
  const icons = {
    gavel: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="2" y="2" width="4" height="2" fill="currentColor" />
        <rect x="6" y="4" width="2" height="8" fill="currentColor" />
        <rect x="8" y="10" width="4" height="2" fill="currentColor" />
      </svg>
    ),
    code: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="2" y="6" width="2" height="2" fill="currentColor" />
        <rect x="4" y="4" width="2" height="2" fill="currentColor" />
        <rect x="4" y="8" width="2" height="2" fill="currentColor" />
        <rect x="10" y="4" width="2" height="2" fill="currentColor" />
        <rect x="10" y="8" width="2" height="2" fill="currentColor" />
        <rect x="12" y="6" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    "heart-beat": (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="4" y="4" width="2" height="2" fill="currentColor" />
        <rect x="6" y="2" width="2" height="2" fill="currentColor" />
        <rect x="8" y="4" width="2" height="2" fill="currentColor" />
        <rect x="10" y="6" width="2" height="2" fill="currentColor" />
        <rect x="8" y="8" width="2" height="2" fill="currentColor" />
        <rect x="6" y="10" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    calendar: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" />
        <rect x="2" y="4" width="12" height="2" fill="currentColor" />
        <rect x="6" y="6" width="2" height="2" fill="currentColor" />
        <rect x="10" y="6" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    upload: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="7" y="2" width="2" height="8" fill="currentColor" />
        <rect x="5" y="4" width="2" height="2" fill="currentColor" />
        <rect x="9" y="4" width="2" height="2" fill="currentColor" />
        <rect x="4" y="12" width="8" height="2" fill="currentColor" />
      </svg>
    ),
    user: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="6" y="2" width="4" height="4" fill="currentColor" />
        <rect x="4" y="8" width="8" height="6" fill="currentColor" />
      </svg>
    ),
    book: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="3" y="2" width="10" height="12" fill="none" stroke="currentColor" />
        <rect x="5" y="4" width="6" height="2" fill="currentColor" />
        <rect x="5" y="7" width="6" height="2" fill="currentColor" />
      </svg>
    ),
    cog: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="6" y="2" width="4" height="2" fill="currentColor" />
        <rect x="2" y="6" width="2" height="4" fill="currentColor" />
        <rect x="12" y="6" width="2" height="4" fill="currentColor" />
        <rect x="6" y="12" width="4" height="2" fill="currentColor" />
        <rect x="7" y="7" width="2" height="2" fill="currentColor" />
        <rect x="4" y="4" width="2" height="2" fill="currentColor" />
        <rect x="10" y="4" width="2" height="2" fill="currentColor" />
        <rect x="4" y="10" width="2" height="2" fill="currentColor" />
        <rect x="10" y="10" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    briefcase: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="2" y="6" width="12" height="8" fill="currentColor" />
        <rect x="6" y="4" width="4" height="2" fill="currentColor" />
        <rect x="7" y="2" width="2" height="2" fill="currentColor" />
        <rect x="2" y="8" width="12" height="2" fill="none" stroke="currentColor" />
      </svg>
    ),
  }

  return icons[type] || null
}
