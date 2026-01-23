import { motion } from 'framer-motion'

interface TrailLayerProps {
  progress: number // 0-1 representing overall journey progress
  width?: number
  height?: number
}

// Camp positions along the trail (x%, y% of container)
// Positioned to follow the mountain slope from bottom-left to top-right
export const CAMP_POSITIONS = [
  { x: 5, y: 92, elevation: 1400 },   // Week 1: Kathmandu
  { x: 12, y: 85, elevation: 2860 },  // Week 2: Lukla
  { x: 22, y: 75, elevation: 3440 },  // Week 3: Namche Bazaar
  { x: 32, y: 65, elevation: 3867 },  // Week 4: Tengboche
  { x: 44, y: 52, elevation: 4410 },  // Week 5: Dingboche
  { x: 56, y: 40, elevation: 4940 },  // Week 6: Lobuche
  { x: 68, y: 28, elevation: 5164 },  // Week 7: Gorak Shep
  { x: 80, y: 18, elevation: 5364 },  // Week 8: Everest Base Camp
  { x: 92, y: 8, elevation: 5545 },   // Week 9: Kala Patthar (summit view)
]

export function TrailLayer({ progress, width = 400, height = 300 }: TrailLayerProps) {
  // Generate SVG path through all camp positions
  const generateTrailPath = () => {
    const points = CAMP_POSITIONS.map((camp) => ({
      x: (camp.x / 100) * width,
      y: (camp.y / 100) * height,
    }))

    // Create a smooth curve through all points using quadratic beziers
    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      // Control point for smooth curve
      const cpX = (prev.x + curr.x) / 2
      const cpY = prev.y - (prev.y - curr.y) * 0.3
      path += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`
    }

    return path
  }

  const trailPath = generateTrailPath()

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Trail shadow for depth */}
        <filter id="trailShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="black" floodOpacity="0.3" />
        </filter>

        {/* Gradient for completed trail */}
        <linearGradient id="trailCompletedGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
        </linearGradient>

        {/* Gradient for incomplete trail */}
        <linearGradient id="trailIncompleteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </linearGradient>
      </defs>

      {/* Background trail (full path, faded) */}
      <motion.path
        d={trailPath}
        fill="none"
        stroke="url(#trailIncompleteGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 4"
        filter="url(#trailShadow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Completed trail (highlighted portion) */}
      <motion.path
        d={trailPath}
        fill="none"
        stroke="url(#trailCompletedGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.5))',
        }}
      />

      {/* Trail glow effect for completed portion */}
      <motion.path
        d={trailPath}
        fill="none"
        stroke="rgba(249, 115, 22, 0.3)"
        strokeWidth="12"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: progress, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ filter: 'blur(4px)' }}
      />
    </svg>
  )
}
