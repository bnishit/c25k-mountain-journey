import { memo } from 'react'

interface SunRaysProps {
  intensity: number // 0-1
  className?: string
}

// Simplified sun rays - removed animated rays and lens flares
export const SunRays = memo(function SunRays({ intensity, className = '' }: SunRaysProps) {
  if (intensity <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Main sun glow - static with CSS animation */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 sun-pulse"
        style={{
          background: `radial-gradient(circle at center, rgba(255,200,100,${intensity * 0.6}) 0%, rgba(255,150,50,${intensity * 0.3}) 30%, transparent 70%)`,
          opacity: intensity * 0.9,
        }}
      />

      {/* Warm atmosphere overlay - static */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(255,200,100,${intensity * 0.1}) 0%, transparent 50%)`,
        }}
      />
    </div>
  )
})
