import { motion } from 'framer-motion'
import type { AppState } from '../types'
import { getWorkout, formatDurationLong, getIntervalLabel, C25K_PROGRAM } from '../data/program'
import { isWorkoutCompleted } from '../utils/storage'
import { getCamp, getWorkoutsRemaining } from '../data/story'
import { MessageCard } from './MessageCard'
import { MiniMountain } from './MountainMap'

interface TodayWorkoutProps {
  state: AppState
  onStartRun: () => void
  onSettings?: () => void
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

export function TodayWorkout({ state, onStartRun, onSettings }: TodayWorkoutProps) {
  const workout = getWorkout(state.currentWeek, state.currentDay)
  const isCompleted = workout && isWorkoutCompleted(state, state.currentWeek, state.currentDay)
  const totalCompleted = state.completedWorkouts.length
  const totalWorkouts = C25K_PROGRAM.length
  const isProgramComplete = totalCompleted >= totalWorkouts

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

  const camp = getCamp(workout.week)
  const workoutsRemaining = getWorkoutsRemaining(workout.week, workout.day)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-4"
      >
        {/* Settings Button */}
        {onSettings && (
          <motion.div variants={itemVariants} className="flex justify-end mb-2">
            <button
              onClick={onSettings}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Story Header with Camp */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-[var(--accent-run)] mb-1">
                Week {workout.week} · Day {workout.day}
              </p>
              <h1 className="text-display text-[26px] mb-1">{camp.name}</h1>
              <p className="text-sm text-[var(--text-tertiary)]">
                {camp.message}
              </p>
            </div>
            {/* Mini Mountain Map */}
            <div className="flex-shrink-0 opacity-80">
              <MiniMountain
                currentWeek={state.currentWeek}
                completedWorkouts={state.completedWorkouts}
              />
            </div>
          </div>
        </motion.div>

        {/* Motivational Message + Progress Row */}
        <motion.div variants={itemVariants} className="mb-4">
          <MessageCard
            week={workout.week}
            day={workout.day}
            completedWorkouts={totalCompleted}
          />
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--accent-run)]">{workoutsRemaining}</span>
            <span className="text-xs text-[var(--text-muted)]">to summit</span>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2">
            <span className="text-xl font-bold text-[#2dd4bf]">{Math.round((totalCompleted / totalWorkouts) * 100)}%</span>
            <span className="text-xs text-[var(--text-muted)]">complete</span>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{formatDurationLong(workout.totalDuration)}</span>
          </div>
        </motion.div>

        {/* Today's Path - Workout Intervals */}
        <motion.div variants={itemVariants} className="glass-card-elevated p-4 mb-5">
          <p className="text-caption text-[var(--text-muted)] mb-3">Today's Path</p>
          <div className="space-y-2">
            {displayIntervals.map((item, index) => {
              const colors = getIntervalColor(item.type)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
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
                      ×{item.count}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants}>
          {isCompleted ? (
            <div className="space-y-4">
              <div className="glass-card p-4 text-center">
                <span className="text-[var(--accent-walk)] font-semibold flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartRun}
                className="w-full py-4 rounded-2xl font-semibold text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-all hover:border-[var(--border-light)]"
              >
                Repeat Workout
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartRun}
              className="relative w-full overflow-hidden"
            >
              <div
                className="w-full py-5 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 4px 24px rgba(249, 115, 22, 0.35), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }}
              >
                <span>Begin Today's Climb</span>
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
              {/* Shimmer */}
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
      </motion.div>
    </div>
  )
}
