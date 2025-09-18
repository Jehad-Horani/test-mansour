interface PixelIconProps {
  type:
  | "gavel"
  | "code"
  | "heart-beat"
  | "calendar"
  | "upload"
  | "user"
  | "book"
  | "cog"
  | "briefcase"
  | "shopping-cart"
  | "message-circle"
  | "arrow-right"
  | "send"
  | "shield"
  | "filter"
  | "file"
  | "building"
  | "graduation-cap"
  | "download"
  | "alert"
  | "arrow-left"
  | "check"
  | "info"
  className?: string
}

export default function PixelIcon({
  type,
  className = "w-4 h-4",
}: PixelIconProps) {
  const icons: Record<string, JSX.Element> = {
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
    "shopping-cart": (
      <svg className={className} viewBox="0 0 16 16">
        <rect x="1" y="3" width="2" height="2" fill="currentColor" />
        <rect x="3" y="3" width="10" height="2" fill="currentColor" />
        <rect x="12" y="5" width="2" height="6" fill="currentColor" />
        <rect x="3" y="5" width="9" height="6" fill="currentColor" />
        <rect x="4" y="11" width="2" height="2" fill="currentColor" />
        <rect x="10" y="11" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    "message-circle": (
      <svg className={className} viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" />
        <rect x="4" y="6" width="8" height="2" fill="currentColor" />
      </svg>
    ),
    "arrow-right": (
      <svg className={className} viewBox="0 0 16 16">
        <rect x="2" y="7" width="10" height="2" fill="currentColor" />
        <rect x="12" y="5" width="2" height="6" fill="currentColor" transform="rotate(45 12 5)" />
        <rect x="12" y="5" width="2" height="6" fill="currentColor" transform="rotate(-45 12 5)" />
      </svg>
    ),

    send: (
      <svg className={className} viewBox="0 0 16 16">
        <rect x="1" y="7" width="12" height="2" fill="currentColor" />
        <rect x="11" y="5" width="4" height="6" fill="currentColor" transform="rotate(45 11 5)" />
      </svg>
    ),

    shield: (
      <svg className={className} viewBox="0 0 16 16">
        <rect x="6" y="2" width="4" height="2" fill="currentColor" />
        <rect x="4" y="4" width="8" height="6" fill="currentColor" />
        <rect x="5" y="10" width="6" height="4" fill="currentColor" />
      </svg>
    ),

    file: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="4" y="2" width="8" height="12" fill="none" stroke="currentColor" />
        <rect x="4" y="2" width="6" height="4" fill="currentColor" />
        <rect x="4" y="8" width="8" height="2" fill="currentColor" />
        <rect x="4" y="11" width="8" height="2" fill="currentColor" />
      </svg>
    ),

    building: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="3" y="4" width="10" height="10" fill="currentColor" />
        <rect x="5" y="6" width="2" height="2" fill="white" />
        <rect x="9" y="6" width="2" height="2" fill="white" />
        <rect x="5" y="10" width="2" height="2" fill="white" />
        <rect x="9" y="10" width="2" height="2" fill="white" />
        <rect x="7" y="2" width="2" height="2" fill="currentColor" />
      </svg>
    ),

    "graduation-cap": (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="2" y="6" width="12" height="2" fill="currentColor" />
        <rect x="6" y="8" width="4" height="4" fill="currentColor" />
        <rect x="8" y="8" width="1" height="4" fill="currentColor" />
        <rect x="7" y="5" width="2" height="1" fill="currentColor" />
      </svg>
    ),

    download: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="7" y="2" width="2" height="6" fill="currentColor" />
        <rect x="5" y="6" width="6" height="2" fill="currentColor" />
        <rect x="4" y="10" width="8" height="2" fill="currentColor" />
      </svg>
    ),

    alert: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="7" y="2" width="2" height="6" fill="currentColor" />
        <rect x="7" y="10" width="2" height="2" fill="currentColor" />
        <rect x="4" y="14" width="8" height="2" fill="currentColor" />
      </svg>
    ),

    "arrow-left": (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="4" y="7" width="10" height="2" fill="currentColor" />
        <rect x="4" y="5" width="2" height="6" fill="currentColor" transform="rotate(45 4 5)" />
        <rect x="4" y="5" width="2" height="6" fill="currentColor" transform="rotate(-45 4 5)" />
      </svg>
    ),

    check: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="4" y="8" width="2" height="2" fill="currentColor" />
        <rect x="6" y="10" width="6" height="2" fill="currentColor" />
        <rect x="12" y="4" width="2" height="2" fill="currentColor" />
      </svg>
    ),

    info: (
      <svg className={className} viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
        <rect x="7" y="4" width="2" height="2" fill="currentColor" />
        <rect x="7" y="8" width="2" height="4" fill="currentColor" />
        <rect x="7" y="14" width="2" height="2" fill="currentColor" />
      </svg>
    ),


  }

  return icons[type] || null
}
