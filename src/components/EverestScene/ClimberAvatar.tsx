import { motion } from 'framer-motion'
import { CAMP_POSITIONS } from './TrailLayer'

interface ClimberAvatarProps {
  currentWeek: number
  dayProgress: number // 0-1 progress within current week (0, 0.33, 0.66, 1)
  isAnimating?: boolean
}

export function ClimberAvatar({
  currentWeek,
  dayProgress,
  isAnimating = false,
}: ClimberAvatarProps) {
  // Calculate position between current camp and next camp based on day progress
  const currentCampIndex = currentWeek - 1
  const nextCampIndex = Math.min(currentCampIndex + 1, CAMP_POSITIONS.length - 1)

  const currentCamp = CAMP_POSITIONS[currentCampIndex]
  const nextCamp = CAMP_POSITIONS[nextCampIndex]

  // Interpolate position
  const x = currentCamp.x + (nextCamp.x - currentCamp.x) * dayProgress
  const y = currentCamp.y + (nextCamp.y - currentCamp.y) * dayProgress

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
    >
      {/* Climber figure */}
      <motion.div
        animate={isAnimating ? { y: [0, -3, 0] } : {}}
        transition={isAnimating ? { duration: 0.5, repeat: Infinity } : {}}
      >
        <svg
          width="24"
          height="32"
          viewBox="0 0 24 32"
          fill="none"
          className="drop-shadow-lg"
        >
          {/* Backpack */}
          <rect
            x="8"
            y="12"
            width="8"
            height="10"
            rx="2"
            fill="#ea580c"
            className="drop-shadow"
          />
          <rect
            x="9"
            y="13"
            width="6"
            height="3"
            rx="1"
            fill="#f97316"
          />

          {/* Body/Jacket */}
          <path
            d="M6 14 C6 11 8 10 12 10 C16 10 18 11 18 14 L18 22 C18 23 17 24 16 24 L8 24 C7 24 6 23 6 22 Z"
            fill="#0ea5e9"
          />

          {/* Head */}
          <circle
            cx="12"
            cy="6"
            r="5"
            fill="#fcd34d"
          />

          {/* Hat/Beanie */}
          <path
            d="M7 6 Q7 2 12 2 Q17 2 17 6 L16 7 L8 7 Z"
            fill="#dc2626"
          />
          <circle cx="12" cy="1" r="1.5" fill="#dc2626" />

          {/* Face */}
          <circle cx="10" cy="6" r="0.8" fill="#1e293b" />
          <circle cx="14" cy="6" r="0.8" fill="#1e293b" />
          <path
            d="M10 8 Q12 9 14 8"
            stroke="#1e293b"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Legs */}
          <motion.g
            animate={isAnimating ? { rotate: [-5, 5, -5] } : {}}
            transition={isAnimating ? { duration: 0.3, repeat: Infinity } : {}}
            style={{ transformOrigin: '10px 24px' }}
          >
            <rect x="8" y="24" width="4" height="6" rx="1" fill="#1e293b" />
            <rect x="8" y="29" width="5" height="2" rx="0.5" fill="#78350f" />
          </motion.g>
          <motion.g
            animate={isAnimating ? { rotate: [5, -5, 5] } : {}}
            transition={isAnimating ? { duration: 0.3, repeat: Infinity } : {}}
            style={{ transformOrigin: '14px 24px' }}
          >
            <rect x="12" y="24" width="4" height="6" rx="1" fill="#1e293b" />
            <rect x="11" y="29" width="5" height="2" rx="0.5" fill="#78350f" />
          </motion.g>

          {/* Hiking poles */}
          <motion.line
            x1="4"
            y1="28"
            x2="6"
            y2="16"
            stroke="#a8a29e"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={isAnimating ? { rotate: [-10, 10, -10] } : {}}
            transition={isAnimating ? { duration: 0.3, repeat: Infinity } : {}}
            style={{ transformOrigin: '5px 22px' }}
          />
          <motion.line
            x1="20"
            y1="28"
            x2="18"
            y2="16"
            stroke="#a8a29e"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={isAnimating ? { rotate: [10, -10, 10] } : {}}
            transition={isAnimating ? { duration: 0.3, repeat: Infinity } : {}}
            style={{ transformOrigin: '19px 22px' }}
          />
        </svg>
      </motion.div>

      {/* Ground shadow */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-4 h-1 bg-black/30 rounded-full blur-[2px]"
        style={{ bottom: '-2px' }}
        animate={isAnimating ? { scaleX: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] } : {}}
        transition={isAnimating ? { duration: 0.5, repeat: Infinity } : {}}
      />
    </motion.div>
  )
}
