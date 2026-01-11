import { motion } from 'framer-motion'
import type { AppState } from '../types'
import { C25K_PROGRAM, formatDurationLong } from '../data/program'
import { isWorkoutCompleted } from '../utils/storage'

interface ScheduleProps {
  state: AppState
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function Schedule({ state }: ScheduleProps) {
  const weeks = Array.from({ length: 9 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-6"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-display text-[28px]">9-Week Plan</h1>
          <p className="text-body text-[var(--text-tertiary)] mt-1">Your journey to 5K</p>
        </motion.div>

        <div className="space-y-4">
          {weeks.map(week => {
            const weekWorkouts = C25K_PROGRAM.filter(w => w.week === week)
            const completedCount = weekWorkouts.filter(w =>
              isWorkoutCompleted(state, w.week, w.day)
            ).length

            const isCurrent = state.currentWeek === week
            const isPast = week < state.currentWeek || completedCount === 3
            const isFuture = week > state.currentWeek && completedCount === 0

            return (
              <motion.div
                key={week}
                variants={itemVariants}
                className="glass-card overflow-hidden"
                style={{
                  border: isCurrent ? '1px solid rgba(249, 115, 22, 0.3)' : undefined,
                  background: isCurrent ? 'rgba(249, 115, 22, 0.05)' : undefined
                }}
              >
                {/* Week header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        background: isPast
                          ? '#2dd4bf'
                          : isCurrent
                          ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                          : 'rgba(255,255,255,0.06)',
                        color: isPast || isCurrent ? 'white' : 'var(--text-muted)',
                        boxShadow: isPast
                          ? '0 2px 8px rgba(45, 212, 191, 0.3)'
                          : isCurrent
                          ? '0 2px 8px rgba(249, 115, 22, 0.3)'
                          : 'none'
                      }}
                    >
                      {isPast ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : week}
                    </span>
                    <div>
                      <span className={`font-semibold ${isFuture ? 'text-[var(--text-muted)]' : ''}`}>
                        Week {week}
                      </span>
                      {isCurrent && (
                        <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-[rgba(249,115,22,0.2)] text-[#f97316]">
                          CURRENT
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map(day => (
                      <div
                        key={day}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: day <= completedCount
                            ? '#2dd4bf'
                            : 'rgba(255,255,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Days */}
                <div className="p-3 space-y-2">
                  {weekWorkouts.map(workout => {
                    const isCompleted = isWorkoutCompleted(state, workout.week, workout.day)
                    const isCurrentDay = state.currentWeek === workout.week && state.currentDay === workout.day

                    return (
                      <div
                        key={workout.day}
                        className="flex items-center justify-between p-3 rounded-xl transition-colors"
                        style={{
                          background: isCompleted
                            ? 'rgba(45, 212, 191, 0.08)'
                            : isCurrentDay
                            ? 'rgba(249, 115, 22, 0.1)'
                            : 'rgba(255,255,255,0.03)',
                          border: isCurrentDay
                            ? '1px solid rgba(249, 115, 22, 0.2)'
                            : '1px solid transparent'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              background: isCompleted
                                ? '#2dd4bf'
                                : isCurrentDay
                                ? '#f97316'
                                : 'rgba(255,255,255,0.06)',
                              color: isCompleted || isCurrentDay ? 'white' : 'var(--text-muted)'
                            }}
                          >
                            {isCompleted ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : workout.day}
                          </span>
                          <div>
                            <span className={`text-sm font-medium ${isFuture && !isCompleted ? 'text-[var(--text-muted)]' : ''}`}>
                              Day {workout.day}
                            </span>
                            {isCurrentDay && !isCompleted && (
                              <span className="ml-2 text-xs font-semibold text-[#f97316]">Today</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">
                          {formatDurationLong(workout.totalDuration)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
