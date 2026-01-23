import { memo } from 'react'

interface MistLayerProps {
  opacity: number // 0-1
  className?: string
}

// Simplified mist layer - uses CSS animations instead of Framer Motion
export const MistLayer = memo(function MistLayer({ opacity, className = '' }: MistLayerProps) {
  if (opacity <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Lower mist bank - static gradient, no animation */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 mist-breathe"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${opacity * 0.4}) 100%)`,
          opacity: opacity * 0.8,
        }}
      />

      {/* Mid-level mist - simplified */}
      <div
        className="absolute bottom-1/4 left-0 right-0 h-1/4"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 30% 100%, rgba(255,255,255,${opacity * 0.3}) 0%, transparent 70%)`,
          opacity: opacity * 0.4,
        }}
      />
    </div>
  )
})
