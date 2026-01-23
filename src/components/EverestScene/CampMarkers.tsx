import { motion } from 'framer-motion'
import { CAMP_POSITIONS } from './TrailLayer'

interface CampMarkersProps {
  currentWeek: number
  completedWeeks: number[]
  onCampClick?: (week: number) => void
}

const CAMP_NAMES = [
  'Kathmandu',
  'Lukla',
  'Namche Bazaar',
  'Tengboche',
  'Dingboche',
  'Lobuche',
  'Gorak Shep',
  'Everest Base Camp',
  'Kala Patthar',
]

export function CampMarkers({
  currentWeek,
  completedWeeks,
  onCampClick,
}: CampMarkersProps) {
  const getMarkerState = (week: number) => {
    if (completedWeeks.includes(week)) return 'completed'
    if (week === currentWeek) return 'current'
    if (week < currentWeek) return 'passed'
    return 'locked'
  }

  const getMarkerStyles = (state: string) => {
    switch (state) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
          border: 'border-orange-300',
          shadow: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
          scale: 1,
        }
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-orange-500 to-amber-500',
          border: 'border-white',
          shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.7)]',
          scale: 1.2,
        }
      case 'passed':
        return {
          bg: 'bg-gradient-to-br from-slate-400 to-slate-500',
          border: 'border-slate-300',
          shadow: 'shadow-md',
          scale: 0.9,
        }
      default: // locked
        return {
          bg: 'bg-slate-700/50',
          border: 'border-slate-600',
          shadow: 'shadow-inner',
          scale: 0.8,
        }
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {CAMP_POSITIONS.map((camp, index) => {
        const week = index + 1
        const state = getMarkerState(week)
        const styles = getMarkerStyles(state)
        const isInteractive = state !== 'locked'

        return (
          <motion.div
            key={week}
            className="absolute"
            style={{
              left: `${camp.x}%`,
              top: `${camp.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: styles.scale }}
            transition={{ delay: index * 0.1, duration: 0.4, type: 'spring' }}
          >
            {/* Pulse ring for current camp */}
            {state === 'current' && (
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500/30"
                style={{ margin: '-8px' }}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}

            {/* Camp marker */}
            <motion.button
              className={`
                relative w-5 h-5 rounded-full border-2
                ${styles.bg} ${styles.border} ${styles.shadow}
                ${isInteractive ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}
                transition-all duration-300
              `}
              onClick={() => isInteractive && onCampClick?.(week)}
              whileHover={isInteractive ? { scale: 1.3 } : {}}
              whileTap={isInteractive ? { scale: 0.95 } : {}}
            >
              {/* Checkmark for completed */}
              {state === 'completed' && (
                <svg
                  className="absolute inset-0 w-full h-full p-1 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}

              {/* Flag icon for current */}
              {state === 'current' && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-3 h-3 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 21V4h16l-4 8 4 8H4z" />
                  </svg>
                </motion.div>
              )}

              {/* Lock icon for locked */}
              {state === 'locked' && (
                <svg
                  className="absolute inset-0 w-full h-full p-1 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V7a3 3 0 00-6 0v4"
                  />
                </svg>
              )}
            </motion.button>

            {/* Camp name label (shown for current and completed) */}
            {(state === 'current' || state === 'completed') && (
              <motion.div
                className={`
                  absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap
                  text-[10px] font-semibold tracking-wide
                  ${state === 'current' ? 'text-orange-300' : 'text-white/70'}
                `}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {CAMP_NAMES[index]}
              </motion.div>
            )}

            {/* Elevation badge for current camp */}
            {state === 'current' && (
              <motion.div
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[9px] font-bold text-orange-400">
                  {camp.elevation.toLocaleString()}m
                </span>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
