import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface FloatingCloudsProps {
  density: number // 0-1
  className?: string
}

interface Cloud {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
  duration: number
  delay: number
}

export function FloatingClouds({ density, className = '' }: FloatingCloudsProps) {
  const clouds = useMemo<Cloud[]>(() => {
    if (density <= 0) return []

    const count = Math.floor(density * 6) // 0-6 clouds
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: -20 + Math.random() * 10,
      y: 10 + Math.random() * 40,
      scale: 0.5 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 60 + Math.random() * 40,
      delay: Math.random() * 30,
    }))
  }, [density])

  if (density <= 0) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: `${cloud.y}%`,
            transform: `scale(${cloud.scale})`,
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: ['0%', '120vw'],
            opacity: [0, cloud.opacity, cloud.opacity, 0],
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <CloudSVG opacity={cloud.opacity} />
        </motion.div>
      ))}
    </div>
  )
}

function CloudSVG({ opacity }: { opacity: number }) {
  return (
    <svg
      width="200"
      height="80"
      viewBox="0 0 200 80"
      fill="none"
      style={{ filter: 'blur(2px)' }}
    >
      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity={opacity} />
          <stop offset="100%" stopColor="white" stopOpacity={opacity * 0.5} />
        </linearGradient>
      </defs>
      {/* Main cloud body */}
      <ellipse cx="100" cy="50" rx="60" ry="25" fill="url(#cloudGradient)" />
      <ellipse cx="60" cy="45" rx="40" ry="20" fill="url(#cloudGradient)" />
      <ellipse cx="140" cy="48" rx="35" ry="18" fill="url(#cloudGradient)" />
      <ellipse cx="80" cy="35" rx="30" ry="15" fill="url(#cloudGradient)" />
      <ellipse cx="120" cy="38" rx="25" ry="12" fill="url(#cloudGradient)" />
    </svg>
  )
}
