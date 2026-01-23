import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useEnvironmentTheme } from '../../contexts/EnvironmentContext'
import { SkyLayer } from './SkyLayer'
import { MainMountain } from './MainMountain'
import { TrailLayer } from './TrailLayer'
import { CampMarkers } from './CampMarkers'
import { ClimberAvatar } from './ClimberAvatar'
import { WeatherEffects } from '../WeatherEffects/WeatherEffects'

interface EverestSceneProps {
  currentWeek: number
  currentDay: number // 1-3
  completedWeeks?: number[]
  onCampClick?: (week: number) => void
  isRunning?: boolean
  compact?: boolean // For mini version on TodayWorkout
  className?: string
}

export function EverestScene({
  currentWeek,
  currentDay,
  completedWeeks = [],
  onCampClick,
  isRunning = false,
  compact = false,
  className = '',
}: EverestSceneProps) {
  const theme = useEnvironmentTheme(currentWeek)

  // Calculate overall journey progress (0-1)
  const journeyProgress = useMemo(() => {
    const weeksCompleted = completedWeeks.filter(w => w < currentWeek).length
    const dayProgressInWeek = (currentDay - 1) / 3 // 0, 0.33, 0.66
    return (weeksCompleted + dayProgressInWeek) / 9
  }, [completedWeeks, currentWeek, currentDay])

  // Calculate day progress within current week
  const dayProgress = useMemo(() => {
    return (currentDay - 1) / 3
  }, [currentDay])

  const containerHeight = compact ? 'h-48' : 'h-80'

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${containerHeight} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Layer 1: Sky gradient background */}
      <SkyLayer theme={theme} />

      {/* Layer 2: Main mountain silhouette */}
      <div className="absolute inset-0 flex items-end">
        <MainMountain theme={theme} />
      </div>

      {/* Layer 2.5: Weather effects */}
      <WeatherEffects theme={theme} />

      {/* Layer 3: Trail connecting camps */}
      <TrailLayer progress={journeyProgress} />

      {/* Layer 4: Camp markers */}
      <CampMarkers
        currentWeek={currentWeek}
        completedWeeks={completedWeeks}
        onCampClick={onCampClick}
      />

      {/* Layer 5: Climber avatar */}
      <ClimberAvatar
        currentWeek={currentWeek}
        dayProgress={dayProgress}
        isAnimating={isRunning}
      />

      {/* Atmosphere overlay based on temperature */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            theme.temperature === 'freezing'
              ? 'linear-gradient(180deg, rgba(223,230,233,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              : theme.temperature === 'cold'
                ? 'linear-gradient(180deg, rgba(116,185,255,0.08) 0%, transparent 100%)'
                : 'transparent',
        }}
      />

      {/* Top gradient fade for text readability */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

      {/* Camp info overlay (compact mode) */}
      {compact && (
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <div>
            <motion.p
              className="text-[10px] font-semibold uppercase tracking-wider text-white/60"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Week {currentWeek} • Day {currentDay}
            </motion.p>
            <motion.h3
              className="text-lg font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {theme.campName}
            </motion.h3>
          </div>
          <motion.div
            className="bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs font-bold text-orange-400">
              {theme.elevation.toLocaleString()}m
            </span>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export { SkyLayer } from './SkyLayer'
export { MainMountain } from './MainMountain'
export { TrailLayer, CAMP_POSITIONS } from './TrailLayer'
export { CampMarkers } from './CampMarkers'
export { ClimberAvatar } from './ClimberAvatar'
