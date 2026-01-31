import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppState, SpeedSettings, CompletedWorkout } from '../types'
import { getWorkout, formatDurationLong, getIntervalLabel, C25K_PROGRAM } from '../data/program'
import { isWorkoutCompleted } from '../utils/storage'
import { getWorkoutsRemaining } from '../data/story'
import { EverestScene } from './EverestScene/EverestScene'
import { EnvironmentProvider } from '../contexts/EnvironmentContext'

interface TodayWorkoutProps {
  state: AppState
  onStartRun: (speedSettings: SpeedSettings) => void
  onSettings?: () => void
  onUpdateSpeeds?: (speeds: SpeedSettings) => void
  lastCompletedWorkout?: CompletedWorkout | null
  onDismissSummary?: () => void
}

// Calculate next run date based on last completed workout
function calculateNextRunDate(completedWorkouts: { completedAt: string }[]): Date | null {
  if (completedWorkouts.length === 0) {
    return new Date() // No workouts yet - suggest today
  }

  const sorted = [...completedWorkouts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  const lastRun = new Date(sorted[0].completedAt)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastRunDay = new Date(lastRun)
  lastRunDay.setHours(0, 0, 0, 0)

  // Days since last run
  const daysSinceLastRun = Math.floor((today.getTime() - lastRunDay.getTime()) / (1000 * 60 * 60 * 24))

  // If they haven't run in over a week, suggest today
  if (daysSinceLastRun >= 7) {
    return today
  }

  // If completed today, next run is day after tomorrow (1 rest day minimum)
  if (daysSinceLastRun === 0) {
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    return dayAfterTomorrow
  }

  // If completed yesterday, next run is tomorrow
  if (daysSinceLastRun === 1) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  // Otherwise they can run today
  return today
}

function formatNextRunDate(date: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  if (dateOnly.getTime() === today.getTime()) return 'Today'
  if (dateOnly.getTime() === tomorrow.getTime()) return 'Tomorrow'

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function TodayWorkoutContent({
  state,
  onStartRun,
  onSettings,
  onUpdateSpeeds,
  lastCompletedWorkout,
  onDismissSummary
}: TodayWorkoutProps) {
  const [showIntervals, setShowIntervals] = useState(false)
  const [localSpeeds, setLocalSpeeds] = useState(state.speedSettings)

  const workout = getWorkout(state.currentWeek, state.currentDay)
  const isCompleted = workout && isWorkoutCompleted(state, state.currentWeek, state.currentDay)
  const totalCompleted = state.completedWorkouts.length
  const totalWorkouts = C25K_PROGRAM.length
  const isProgramComplete = totalCompleted >= totalWorkouts
  const nextRunDate = calculateNextRunDate(state.completedWorkouts)

  const getSuggestedRunRange = (week: number) => {
    if (week <= 2) return { min: 6.0, max: 8.0 }
    if (week <= 5) return { min: 7.0, max: 9.0 }
    if (week <= 7) return { min: 8.0, max: 10.0 }
    return { min: 9.0, max: 11.0 }
  }

  const suggestedRange = getSuggestedRunRange(state.currentWeek)

  // Calculate completed weeks for the scene
  const completedWeeks = useMemo(() => {
    const weeks: number[] = []
    for (let w = 1; w <= 9; w++) {
      const weekWorkouts = state.completedWorkouts.filter((wo) => wo.week === w)
      if (weekWorkouts.length === 3) {
        weeks.push(w)
      }
    }
    return weeks
  }, [state.completedWorkouts])

  const handleSpeedChange = (type: 'run' | 'walk', delta: number) => {
    const newSpeeds = {
      ...localSpeeds,
      [type === 'run' ? 'runSpeed' : 'walkSpeed']: Math.max(
        type === 'run' ? 3.0 : 2.0,
        Math.min(type === 'run' ? 15.0 : 8.0, localSpeeds[type === 'run' ? 'runSpeed' : 'walkSpeed'] + delta)
      )
    }
    setLocalSpeeds(newSpeeds)
    onUpdateSpeeds?.(newSpeeds)
  }

  const handleStartRun = () => {
    onStartRun(localSpeeds)
  }

  if (isProgramComplete) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-6 pb-28 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-sm mx-auto text-center"
        >
          {/* Summit glow */}
          <motion.div
            className="relative mb-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbbf24]/20 to-transparent blur-3xl" />
            <span className="text-8xl">⛰️</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-caption text-[#fbbf24] mb-2">THE SUMMIT</p>
            <h1 className="text-display text-4xl mb-4">You Made It</h1>
            <p className="text-body text-[var(--text-secondary)] text-lg mb-10">
              You stand at the top. You did what most never will. You're a runner now.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card-elevated p-8"
          >
            <p className="text-5xl font-bold text-[#fbbf24] mb-2">
              {totalCompleted}
            </p>
            <p className="text-caption text-[var(--text-muted)]">
              Summits Conquered
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-6 flex items-center justify-center">
        <p className="text-[var(--text-tertiary)]">No workout found</p>
      </div>
    )
  }

  const displayIntervals = workout.intervals.reduce<{ type: string; duration: number; count: number }[]>(
    (acc, interval) => {
      const last = acc[acc.length - 1]
      if (last && last.type === interval.type && last.duration === interval.duration) {
        last.count++
      } else {
        acc.push({ type: interval.type, duration: interval.duration, count: 1 })
      }
      return acc
    },
    []
  )

  const getIntervalColor = (type: string) => {
    switch (type) {
      case 'run': return { bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316', icon: '🏃' }
      case 'walk': return { bg: 'rgba(45, 212, 191, 0.12)', border: 'rgba(45, 212, 191, 0.3)', text: '#2dd4bf', icon: '🚶' }
      default: return { bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)', text: '#a78bfa', icon: '✨' }
    }
  }

  const workoutsRemaining = getWorkoutsRemaining(workout.week, workout.day)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Scene */}
        <motion.div variants={itemVariants} className="relative mb-4">
          <EverestScene
            currentWeek={state.currentWeek}
            currentDay={state.currentDay}
            completedWeeks={completedWeeks}
            compact
            className="rounded-none"
          />

          {/* Settings button overlay */}
          {onSettings && (
            <button
              onClick={onSettings}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10"
            >
              <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          )}

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        </motion.div>

        <div className="px-5 max-w-md mx-auto -mt-2">

        {/* START BUTTON - Front and Center */}
        <motion.div variants={itemVariants} className="mb-5">
          {isCompleted ? (
            <div className="space-y-3">
              <div className="glass-card p-4 text-center">
                <span className="text-[var(--accent-walk)] font-semibold flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed Today
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartRun}
                className="w-full py-4 rounded-2xl font-semibold text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-all hover:border-[var(--border-light)]"
              >
                Repeat Workout
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartRun}
              className="relative w-full overflow-hidden"
            >
              <div
                className="w-full py-5 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 4px 24px rgba(249, 115, 22, 0.35), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }}
              >
                <span>Begin Trek</span>
                <motion.svg
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </motion.svg>
              </div>
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              />
            </motion.button>
          )}
        </motion.div>

        {/* Next Run Date */}
        {nextRunDate && !isCompleted && (
          <motion.div variants={itemVariants} className="glass-card px-4 py-3 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(249,115,22,0.15)] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Next Trek</p>
              <p className="font-semibold text-[#f97316]">{formatNextRunDate(nextRunDate)}</p>
            </div>
          </motion.div>
        )}

        {lastCompletedWorkout && (
          <motion.div variants={itemVariants} className="glass-card-elevated p-4 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-caption text-[var(--text-muted)]">Nice work</p>
                <p className="text-heading text-lg">
                  Week {lastCompletedWorkout.week} · Day {lastCompletedWorkout.day} completed
                </p>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  {formatDurationLong(lastCompletedWorkout.actualDuration)} · next trek {nextRunDate ? formatNextRunDate(nextRunDate) : 'soon'}
                </p>
              </div>
              {onDismissSummary && (
                <button
                  onClick={onDismissSummary}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--accent-run)]">{workoutsRemaining}</span>
            <span className="text-xs text-[var(--text-muted)]">to Kala Patthar</span>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-xl font-bold text-[#2dd4bf]">{Math.round((totalCompleted / totalWorkouts) * 100)}%</span>
            <span className="text-xs text-[var(--text-muted)]">complete</span>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{formatDurationLong(workout.totalDuration)}</span>
          </div>
        </motion.div>

        {/* Treadmill Speeds */}
        <motion.div variants={itemVariants} className="glass-card p-4 mb-4">
          <p className="text-caption text-[var(--text-muted)] mb-3">Treadmill Speeds</p>
          <div className="space-y-3">
            {/* Run Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏃</span>
                <span className="font-medium text-[#f97316]">Run</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeedChange('run', -0.5)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]"
                >
                  -
                </button>
                <span className="w-20 text-center font-bold">{localSpeeds.runSpeed.toFixed(1)} km/h</span>
                <button
                  onClick={() => handleSpeedChange('run', 0.5)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]"
                >
                  +
                </button>
              </div>
            </div>
            {/* Walk Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚶</span>
                <span className="font-medium text-[#2dd4bf]">Walk</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeedChange('walk', -0.5)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]"
                >
                  -
                </button>
                <span className="w-20 text-center font-bold">{localSpeeds.walkSpeed.toFixed(1)} km/h</span>
                <button
                  onClick={() => handleSpeedChange('walk', 0.5)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[rgba(249,115,22,0.25)] bg-[rgba(249,115,22,0.08)] px-3 py-2">
            <p className="text-xs text-[var(--text-muted)]">Suggested run range for week {state.currentWeek}</p>
            <p className="text-sm font-semibold text-[#f97316]">
              {suggestedRange.min.toFixed(1)}–{suggestedRange.max.toFixed(1)} km/h
            </p>
          </div>
        </motion.div>

        {/* Today's Path - Workout Intervals (Collapsible) */}
        <motion.div variants={itemVariants} className="glass-card-elevated p-4">
          <button
            onClick={() => setShowIntervals(!showIntervals)}
            className="w-full flex items-center justify-between"
          >
            <p className="text-caption text-[var(--text-muted)]">Today's Intervals</p>
            <motion.svg
              animate={{ rotate: showIntervals ? 180 : 0 }}
              className="w-4 h-4 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {showIntervals && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-3">
                  {displayIntervals.map((item, index) => {
                    const colors = getIntervalColor(item.type)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{colors.icon}</span>
                          <span className="font-medium text-sm" style={{ color: colors.text }}>
                            {getIntervalLabel(item.type)}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            {formatDurationLong(item.duration)}
                          </span>
                        </div>
                        {item.count > 1 && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: colors.border, color: colors.text }}
                          >
                            x{item.count}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export function TodayWorkout(props: TodayWorkoutProps) {
  return (
    <EnvironmentProvider week={props.state.currentWeek}>
      <TodayWorkoutContent {...props} />
    </EnvironmentProvider>
  )
}
