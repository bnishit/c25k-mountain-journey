import { useMemo } from 'react'
import { motion } from 'framer-motion'

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

export function Starfield({ visibility, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    if (visibility <= 0) return []

    const count = Math.floor(visibility * 50) // 0-50 stars
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Only in upper 60% of sky
      size: 1 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleDuration: 2 + Math.random() * 3,
      twinkleDelay: Math.random() * 5,
    }))
  }, [visibility])

  if (visibility <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.twinkleDuration}s`,
            animationDelay: `${star.twinkleDelay}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: star.brightness * visibility }}
          transition={{ duration: 2 }}
        />
      ))}

      {/* Bright stars with glow */}
      {visibility > 0.5 &&
        stars.slice(0, Math.floor(stars.length * 0.15)).map((star) => (
          <motion.div
            key={`glow-${star.id}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 4,
              height: star.size * 4,
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.twinkleDuration * 1.5,
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Shooting star (rare, only at high visibility) */}
      {visibility > 0.7 && (
        <motion.div
          className="absolute"
          style={{
            width: 2,
            height: 2,
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8), -20px 0 15px 1px rgba(255,255,255,0.3)',
          }}
          initial={{ x: '10%', y: '10%', opacity: 0 }}
          animate={{
            x: ['10%', '30%'],
            y: ['10%', '25%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: 15,
            repeat: Infinity,
            repeatDelay: 25,
            ease: 'easeOut',
          }}
        />
      )}
    </div>
  )
}
