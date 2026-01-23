import { memo, useMemo } from 'react'

interface StarfieldProps {
  visibility: number // 0-1
  className?: string
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  brightness: number
  twinkleDuration: number
  twinkleDelay: number
}

// Reduced from 50 to 20 stars for better performance
const MAX_STARS = 20

export const Starfield = memo(function Starfield({ visibility, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    if (visibility <= 0) return []

    const count = Math.floor(visibility * MAX_STARS)
    // Use deterministic values for stable rendering
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 17 + 13) % 100,
      y: (i * 11 + 5) % 55, // Only in upper 55% of sky
      size: 1 + (i % 3),
      brightness: 0.4 + ((i * 7) % 60) / 100,
      twinkleDuration: 3 + (i % 3),
      twinkleDelay: (i * 0.5) % 5,
    }))
  }, [visibility])

  if (visibility <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.brightness * visibility,
            animationDuration: `${star.twinkleDuration}s`,
            animationDelay: `${star.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  )
})
