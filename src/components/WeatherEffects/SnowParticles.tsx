import { useMemo } from 'react'
import { motion } from 'framer-motion'

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

export function SnowParticles({ intensity, className = '' }: SnowParticlesProps) {
  // Generate snowflakes based on intensity
  const snowflakes = useMemo<Snowflake[]>(() => {
    if (intensity <= 0) return []

    const count = Math.floor(intensity * 40) // 0-40 snowflakes
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() < 0.5 ? 'sm' : Math.random() < 0.8 ? 'md' : 'lg',
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 8,
      driftDuration: 3 + Math.random() * 4,
    }))
  }, [intensity])

  if (intensity <= 0) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className={`snow-particle snow-particle-${flake.size}`}
          style={{
            left: `${flake.x}%`,
            animationDuration: `${flake.duration}s, ${flake.driftDuration}s`,
            animationDelay: `${flake.delay}s, ${flake.delay}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      ))}
    </div>
  )
}
