import { motion } from 'framer-motion'
import type { CompletedWorkout } from '../types'
import { getWorkout, formatDurationLong, getIntervalLabel } from '../data/program'
import { getCamp } from '../data/story'

interface RunDetailProps {
  workout: CompletedWorkout
  onBack: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const getIntervalColor = (type: string) => {
  switch (type) {
    case 'run': return { bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316', icon: '🏃' }
    case 'walk': return { bg: 'rgba(45, 212, 191, 0.12)', border: 'rgba(45, 212, 191, 0.3)', text: '#2dd4bf', icon: '🚶' }
    default: return { bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)', text: '#a78bfa', icon: '✨' }
  }
}

export function RunDetail({ workout, onBack }: RunDetailProps) {
  const programWorkout = getWorkout(workout.week, workout.day)
  const camp = getCamp(workout.week)

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!programWorkout) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Workout data not found</p>
      </div>
    )
  }

  // Calculate total duration for proportional bars
  const totalDuration = programWorkout.intervals.reduce((sum, i) => sum + i.duration, 0)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-6"
      >
        {/* Header with back button */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)]"
          >
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-display text-[24px]">Week {workout.week} · Day {workout.day}</h1>
            <p className="text-sm text-[var(--text-muted)]">{camp.name}</p>
          </div>
        </motion.div>

        {/* Completion info card */}
        <motion.div variants={itemVariants} className="glass-card-elevated p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-[var(--text-muted)] mb-1">Completed</p>
              <p className="font-semibold text-[var(--text-secondary)]">{formatDate(workout.completedAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-caption text-[var(--text-muted)] mb-1">Duration</p>
              <p className="font-bold text-2xl text-[#f97316]">{formatDurationLong(workout.actualDuration)}</p>
            </div>
          </div>
        </motion.div>

        {/* Location info */}
        <motion.div variants={itemVariants} className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(249,115,22,0.15)] flex items-center justify-center">
              <span className="text-lg">⛰️</span>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-secondary)]">{camp.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{camp.elevation.toLocaleString()}m · {camp.theme}</p>
            </div>
          </div>
        </motion.div>

        {/* Interval breakdown */}
        <motion.div variants={itemVariants}>
          <p className="text-caption text-[var(--text-muted)] mb-4">WORKOUT BREAKDOWN</p>
          <div className="space-y-2">
            {programWorkout.intervals.map((interval, index) => {
              const colors = getIntervalColor(interval.type)
              const widthPercent = (interval.duration / totalDuration) * 100

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colors.border }}>
                    <span className="text-sm">{colors.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm" style={{ color: colors.text }}>
                        {getIntervalLabel(interval.type)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDurationLong(interval.duration)}
                      </span>
                    </div>
                    {/* Progress bar showing proportion of total workout */}
                    <div className="h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: colors.text }}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ delay: 0.5 + index * 0.04, duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Summary stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mt-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#f97316]">
              {programWorkout.intervals.filter(i => i.type === 'run').length}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Run segments</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#2dd4bf]">
              {programWorkout.intervals.filter(i => i.type === 'walk').length}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Walk segments</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text-secondary)]">
              {programWorkout.intervals.length}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Total intervals</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
