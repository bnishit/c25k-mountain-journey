import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppState } from '../types'
import { MountainMap } from './MountainMap'
import { CAMPS, getWorkoutsRemaining, getProjectedSummitDate, getCamp } from '../data/story'
import { isWorkoutCompleted } from '../utils/storage'

interface JourneyProps {
  state: AppState
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

export function Journey({ state }: JourneyProps) {
  const [selectedCamp, setSelectedCamp] = useState<number | null>(null)
  const totalCompleted = state.completedWorkouts.length
  const totalWorkouts = 27
  const workoutsRemaining = getWorkoutsRemaining(state.currentWeek, state.currentDay)
  const projectedSummit = getProjectedSummitDate(state.currentWeek, state.currentDay)
  const currentCamp = getCamp(state.currentWeek)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-display text-[28px]">The Journey</h1>
          <p className="text-body text-[var(--text-tertiary)] mt-1">Your path to the summit</p>
        </motion.div>

        {/* Current Position Card */}
        <motion.div variants={itemVariants} className="glass-card-elevated p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-[var(--accent-run)] mb-1">CURRENT CAMP</p>
              <p className="text-heading text-xl">{currentCamp.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{currentCamp.elevation}% elevation</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--accent-run)]">{workoutsRemaining}</p>
              <p className="text-xs text-[var(--text-muted)]">to summit</p>
            </div>
          </div>
        </motion.div>

        {/* Mountain Map */}
        <motion.div variants={itemVariants} className="glass-card p-6 mb-6">
          <div className="flex justify-center">
            <MountainMap
              currentWeek={state.currentWeek}
              currentDay={state.currentDay}
              completedWorkouts={state.completedWorkouts}
            />
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#2dd4bf]">{totalCompleted}</p>
            <p className="text-xs text-[var(--text-muted)]">completed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text-secondary)]">
              {Math.round((totalCompleted / totalWorkouts) * 100)}%
            </p>
            <p className="text-xs text-[var(--text-muted)]">progress</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-sm font-bold text-[#fbbf24]">{projectedSummit}</p>
            <p className="text-xs text-[var(--text-muted)]">summit date</p>
          </div>
        </motion.div>

        {/* Camp List */}
        <motion.div variants={itemVariants}>
          <p className="text-caption text-[var(--text-muted)] mb-4">ALL CAMPS</p>
          <div className="space-y-2">
            {CAMPS.map((camp) => {
              const weekWorkouts = state.completedWorkouts.filter(w => w.week === camp.week)
              const completedDays = weekWorkouts.length
              const isCurrent = camp.week === state.currentWeek
              const isPast = camp.week < state.currentWeek || completedDays === 3
              const isFuture = camp.week > state.currentWeek && completedDays === 0

              return (
                <motion.button
                  key={camp.week}
                  onClick={() => setSelectedCamp(selectedCamp === camp.week ? null : camp.week)}
                  className="w-full text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`glass-card p-4 transition-all ${
                      isCurrent ? 'border border-[rgba(249,115,22,0.3)]' : ''
                    } ${selectedCamp === camp.week ? 'bg-[rgba(255,255,255,0.05)]' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
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
                          ) : camp.week === 9 ? '⛰️' : camp.week}
                        </div>
                        <div>
                          <p className={`font-semibold ${isFuture ? 'text-[var(--text-muted)]' : ''}`}>
                            {camp.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Week {camp.week} • {camp.elevation}% elevation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(day => (
                            <div
                              key={day}
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: isWorkoutCompleted(state, camp.week, day)
                                  ? '#2dd4bf'
                                  : isCurrent && state.currentDay === day
                                  ? '#f97316'
                                  : 'rgba(255,255,255,0.1)'
                              }}
                            />
                          ))}
                        </div>
                        <motion.svg
                          animate={{ rotate: selectedCamp === camp.week ? 180 : 0 }}
                          className="w-4 h-4 text-[var(--text-muted)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {selectedCamp === camp.week && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-secondary)] italic mb-2">
                              "{camp.message}"
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              Theme: {camp.theme}
                            </p>
                            {camp.milestone && (
                              <p className="text-xs text-[#fbbf24] mt-2">
                                🏆 Milestone: {camp.milestone}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
