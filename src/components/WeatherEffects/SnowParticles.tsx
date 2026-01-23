import { memo, useMemo } from 'react'

interface SnowParticlesProps {
  intensity: number // 0-1
  className?: string
}

interface Snowflake {
  id: number
  x: number
  size: 'sm' | 'md' | 'lg'
  delay: number
  duration: number
  driftDuration: number
}

// Reduced max from 40 to 15 particles for better performance
const MAX_SNOWFLAKES = 15

export const SnowParticles = memo(function SnowParticles({ intensity, className = '' }: SnowParticlesProps) {
  // Generate snowflakes based on intensity - use stable seed-based values
  const snowflakes = useMemo<Snowflake[]>(() => {
    if (intensity <= 0) return []

    const count = Math.floor(intensity * MAX_SNOWFLAKES)
    // Use deterministic values based on index for stable rendering
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 23 + 7) % 100, // Pseudo-random but deterministic
      size: i % 3 === 0 ? 'lg' : i % 2 === 0 ? 'md' : 'sm',
      delay: (i * 0.7) % 5,
      duration: 8 + (i % 5),
      driftDuration: 4 + (i % 3),
    }))
  }, [intensity])

  if (intensity <= 0) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`snow-particle snow-particle-${flake.size}`}
          style={{
            left: `${flake.x}%`,
            animationDuration: `${flake.duration}s, ${flake.driftDuration}s`,
            animationDelay: `${flake.delay}s, ${flake.delay}s`,
          }}
        />
      ))}
    </div>
  )
})
