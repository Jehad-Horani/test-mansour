interface RetroStatProps {
  value: string
  label: string
  className?: string
}

export function RetroStat({ value, label, className = "" }: RetroStatProps) {
  return (
    <div className={`retro-stat ${className}`}>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
