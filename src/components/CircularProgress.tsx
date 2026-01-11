import { motion } from 'framer-motion'

interface CircularProgressProps {
  progress: number // 0 to 1
  size?: number
  strokeWidth?: number
  timeRemaining: number
  totalTime: number
}

export function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 8,
  timeRemaining,
  totalTime
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  // Color based on time remaining
  const getColor = () => {
    const percentRemaining = timeRemaining / totalTime
    if (percentRemaining <= 0.1) return '#ef4444' // red - last 10%
    if (percentRemaining <= 0.25) return '#f97316' // orange - last 25%
    return '#10b981' // emerald
  }

  const color = getColor()

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </svg>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 20px ${color}20`,
            `0 0 40px ${color}30`,
            `0 0 20px ${color}20`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
