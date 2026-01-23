import { memo, useMemo } from 'react'

interface FloatingCloudsProps {
  density: number // 0-1
  className?: string
}

interface Cloud {
  id: number
  y: number
  scale: number
  opacity: number
  duration: number
  delay: number
}

// Reduced from 6 to 3 clouds for better performance
const MAX_CLOUDS = 3

export const FloatingClouds = memo(function FloatingClouds({ density, className = '' }: FloatingCloudsProps) {
  const clouds = useMemo<Cloud[]>(() => {
    if (density <= 0) return []

    const count = Math.floor(density * MAX_CLOUDS)
    // Deterministic values for stable rendering
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      y: 15 + (i * 17) % 35,
      scale: 0.6 + (i * 0.15),
      opacity: 0.35 + (i * 0.1),
      duration: 80 + i * 20,
      delay: i * 15,
    }))
  }, [density])

  if (density <= 0) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud-drift"
          style={{
            position: 'absolute',
            top: `${cloud.y}%`,
            transform: `scale(${cloud.scale})`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <CloudSVG opacity={cloud.opacity} id={cloud.id} />
        </div>
      ))}
    </div>
  )
})

const CloudSVG = memo(function CloudSVG({ opacity, id }: { opacity: number; id: number }) {
  return (
    <svg
      width="150"
      height="60"
      viewBox="0 0 150 60"
      fill="none"
    >
      <defs>
        <linearGradient id={`cloudGradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity={opacity} />
          <stop offset="100%" stopColor="white" stopOpacity={opacity * 0.5} />
        </linearGradient>
      </defs>
      {/* Simplified cloud - fewer ellipses */}
      <ellipse cx="75" cy="35" rx="50" ry="20" fill={`url(#cloudGradient-${id})`} />
      <ellipse cx="45" cy="32" rx="30" ry="15" fill={`url(#cloudGradient-${id})`} />
      <ellipse cx="105" cy="34" rx="28" ry="14" fill={`url(#cloudGradient-${id})`} />
    </svg>
  )
})
