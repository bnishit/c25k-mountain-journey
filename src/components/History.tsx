import { motion } from 'framer-motion'
import type { AppState } from '../types'
import { formatDurationLong } from '../data/program'

interface HistoryProps {
  state: AppState
  onReset: () => void
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

export function History({ state, onReset }: HistoryProps) {
  const { completedWorkouts } = state

  const sortedWorkouts = [...completedWorkouts].sort((a, b) =>
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  const totalTime = completedWorkouts.reduce((sum, w) => sum + w.actualDuration, 0)

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
              <motion.div
                key={`${workout.week}-${workout.day}-${workout.completedAt}-${index}`}
                variants={itemVariants}
                className="glass-card p-4 flex items-center justify-between"
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
                <div className="text-right">
                  <p className="font-semibold text-[#f97316]">
                    {formatDurationLong(workout.actualDuration)}
                  </p>
                </div>
              </motion.div>
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
