import { motion } from 'framer-motion'
import { CAMPS } from '../data/story'

interface MountainMapProps {
  currentWeek: number
  currentDay: number
  completedWorkouts: { week: number; day: number }[]
  compact?: boolean
}

// Path coordinates for the mountain trail (x, y) - normalized 0-100
const TRAIL_POINTS = [
  { x: 15, y: 95 },  // Base Camp
  { x: 25, y: 82 },  // Week 2
  { x: 20, y: 68 },  // Week 3 - Vista
  { x: 35, y: 58 },  // Week 4 - Meadow
  { x: 45, y: 45 },  // Week 5 - Ascent
  { x: 55, y: 35 },  // Week 6 - Above Clouds
  { x: 60, y: 25 },  // Week 7 - Final Ridge
  { x: 65, y: 15 },  // Week 8 - Push
  { x: 50, y: 5 },   // Summit
]

function isWorkoutCompleted(completedWorkouts: { week: number; day: number }[], week: number) {
  return completedWorkouts.filter(w => w.week === week).length === 3
}

export function MountainMap({ currentWeek, completedWorkouts, compact = false }: MountainMapProps) {
  const width = compact ? 120 : 320
  const height = compact ? 80 : 400

  const scaleX = (x: number) => (x / 100) * width
  const scaleY = (y: number) => (y / 100) * height

  // Generate path string
  const pathD = TRAIL_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ')

  // Calculate completed path length (based on weeks completed)
  const completedWeeks = Math.max(0, currentWeek - 1)
  const progressRatio = completedWeeks / 8 // 8 segments between 9 camps

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Mountain silhouette */}
      <defs>
        <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Mountain shape */}
      <path
        d={`M 0 ${height} L ${scaleX(50)} ${scaleY(5)} L ${width} ${height} Z`}
        fill="url(#mountainGradient)"
      />

      {/* Trail - future (dotted) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={compact ? 1 : 2}
        strokeDasharray={compact ? "2 4" : "4 8"}
        strokeLinecap="round"
      />

      {/* Trail - completed (solid) */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#pathGradient)"
        strokeWidth={compact ? 1.5 : 3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progressRatio }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Camp markers */}
      {!compact && CAMPS.map((camp, index) => {
        const point = TRAIL_POINTS[index]
        const isCompleted = isWorkoutCompleted(completedWorkouts, camp.week)
        const isCurrent = camp.week === currentWeek
        const isFuture = camp.week > currentWeek

        return (
          <g key={camp.week} transform={`translate(${scaleX(point.x)}, ${scaleY(point.y)})`}>
            {/* Camp marker */}
            <motion.circle
              r={isCurrent ? 10 : 6}
              fill={isCompleted ? '#2dd4bf' : isCurrent ? '#f97316' : 'rgba(255,255,255,0.2)'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              filter={isCurrent ? 'url(#glow)' : undefined}
            />

            {/* Current position pulse */}
            {isCurrent && (
              <motion.circle
                r={10}
                fill="none"
                stroke="#f97316"
                strokeWidth={2}
                animate={{ r: [10, 20], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* Camp label */}
            <text
              x={index % 2 === 0 ? 15 : -15}
              y={4}
              fill={isFuture ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)'}
              fontSize={10}
              fontWeight={isCurrent ? 700 : 500}
              textAnchor={index % 2 === 0 ? 'start' : 'end'}
            >
              {camp.name}
            </text>
          </g>
        )
      })}

      {/* Compact mode: just show current position */}
      {compact && (
        <motion.circle
          cx={scaleX(TRAIL_POINTS[currentWeek - 1]?.x || 15)}
          cy={scaleY(TRAIL_POINTS[currentWeek - 1]?.y || 95)}
          r={4}
          fill="#f97316"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}

      {/* Summit star */}
      <motion.g
        transform={`translate(${scaleX(50)}, ${scaleY(5)})`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.circle
          r={compact ? 3 : 8}
          fill={currentWeek === 9 && completedWorkouts.filter(w => w.week === 9).length === 3 ? '#fbbf24' : 'rgba(251,191,36,0.3)'}
          animate={currentWeek < 9 ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>
    </svg>
  )
}

// Mini version for home screen
export function MiniMountain({ currentWeek, completedWorkouts }: { currentWeek: number; completedWorkouts: { week: number; day: number }[] }) {
  return (
    <div className="relative">
      <MountainMap
        currentWeek={currentWeek}
        currentDay={1}
        completedWorkouts={completedWorkouts}
        compact
      />
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  )
}
