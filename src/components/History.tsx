import { motion } from 'framer-motion'
import type { AppState, CompletedWorkout } from '../types'
import { formatDurationLong } from '../data/program'

interface HistoryProps {
  state: AppState
  onReset: () => void
  onSelectWorkout: (workout: CompletedWorkout) => void
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

export function History({ state, onReset, onSelectWorkout }: HistoryProps) {
  const { completedWorkouts } = state

  const sortedWorkouts = [...completedWorkouts].sort((a, b) =>
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  const totalTime = completedWorkouts.reduce((sum, w) => sum + w.actualDuration, 0)
  const averageDuration = completedWorkouts.length > 0 ? totalTime / completedWorkouts.length : 0

  const completedWeeks = Array.from(
    new Set(completedWorkouts.map((workout) => workout.week))
  )
  const totalPossibleInStartedWeeks = completedWeeks.length * 3
  const weeklyCompletionRate = totalPossibleInStartedWeeks > 0
    ? Math.round((completedWorkouts.length / totalPossibleInStartedWeeks) * 100)
    : 0

  const workoutDates = Array.from(
    new Set(
      completedWorkouts.map((workout) => new Date(workout.completedAt).toDateString())
    )
  )
  const sortedDates = workoutDates
    .map((dateString) => new Date(dateString))
    .sort((a, b) => a.getTime() - b.getTime())

  const currentStreak = (() => {
    if (sortedDates.length === 0) return 0
    let streak = 1
    for (let i = sortedDates.length - 1; i > 0; i -= 1) {
      const diffMs = sortedDates[i].getTime() - sortedDates[i - 1].getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      if (diffDays <= 1.1) {
        streak += 1
      } else {
        break
      }
    }
    return streak
  })()

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-6"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-display text-[28px]">History</h1>
          <p className="text-body text-[var(--text-tertiary)] mt-1">Your running journey</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card-elevated p-5 text-center">
            <p className="text-4xl font-bold text-[#f97316] mb-1">
              {completedWorkouts.length}
            </p>
            <p className="text-caption text-[var(--text-muted)]">Workouts</p>
          </div>
          <div className="glass-card-elevated p-5 text-center">
            <p className="text-4xl font-bold text-[#2dd4bf] mb-1">
              {formatDurationLong(totalTime)}
            </p>
            <p className="text-caption text-[var(--text-muted)]">Total Time</p>
          </div>
        </motion.div>

        {/* Progress insights */}
        <motion.div variants={itemVariants} className="glass-card p-5 mb-8">
          <p className="text-caption text-[var(--text-muted)] mb-4">PROGRESS INSIGHTS</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-[#f97316]">{currentStreak}</p>
              <p className="text-xs text-[var(--text-muted)]">Day streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2dd4bf]">{weeklyCompletionRate}%</p>
              <p className="text-xs text-[var(--text-muted)]">Weekly rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-secondary)]">
                {averageDuration ? formatDurationLong(averageDuration) : '—'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Avg duration</p>
            </div>
          </div>
        </motion.div>

        {/* Workout list */}
        {sortedWorkouts.length === 0 ? (
          <motion.div variants={itemVariants} className="glass-card p-10 text-center">
            <div className="text-5xl mb-4">🏃</div>
            <p className="text-[var(--text-tertiary)]">
              No workouts completed yet.
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Complete your first run to start tracking.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sortedWorkouts.map((workout, index) => (
              <motion.button
                key={`${workout.week}-${workout.day}-${workout.completedAt}-${index}`}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectWorkout(workout)}
                className="glass-card p-4 flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(45, 212, 191, 0.15)' }}
                  >
                    <svg className="w-5 h-5 text-[#2dd4bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      Week {workout.week} · Day {workout.day}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {formatDate(workout.completedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-[#f97316]">
                    {formatDurationLong(workout.actualDuration)}
                  </p>
                  <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Reset button */}
        {completedWorkouts.length > 0 && (
          <motion.div variants={itemVariants}>
            <button
              onClick={() => {
                if (confirm('Reset all progress? This cannot be undone.')) {
                  onReset()
                }
              }}
              className="w-full mt-10 py-4 rounded-xl font-medium text-red-400 border border-red-400/20 transition-all hover:bg-red-400/10 hover:border-red-400/30"
            >
              Reset Progress
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
