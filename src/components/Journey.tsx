import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppState } from '../types'
import { EverestScene } from './EverestScene/EverestScene'
import { CampCard } from './CampCard/CampCard'
import { EnvironmentProvider, useEnvironmentTheme } from '../contexts/EnvironmentContext'
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

function JourneyContent({ state }: JourneyProps) {
  const [selectedCamp, setSelectedCamp] = useState<number | null>(null)
  const [expandedCamp, setExpandedCamp] = useState<number | null>(null)
  const theme = useEnvironmentTheme(state.currentWeek)

  const totalCompleted = state.completedWorkouts.length
  const totalWorkouts = 27
  const workoutsRemaining = getWorkoutsRemaining(state.currentWeek, state.currentDay)
  const projectedSummit = getProjectedSummitDate(state.currentWeek, state.currentDay)
  const currentCamp = getCamp(state.currentWeek)

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

  // Get completed days for selected camp
  const getCompletedDaysForWeek = (week: number) => {
    return state.completedWorkouts.filter((w) => w.week === week).length
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Immersive Hero Scene */}
        <motion.div variants={itemVariants} className="relative">
          <EverestScene
            currentWeek={state.currentWeek}
            currentDay={state.currentDay}
            completedWeeks={completedWeeks}
            onCampClick={(week) => setSelectedCamp(week)}
            className="h-[50vh] min-h-[320px] rounded-none"
          />

          {/* Overlay info */}
          <div className="absolute top-0 left-0 right-0 p-5 pt-safe">
            <motion.h1
              className="text-display text-[32px] text-white drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The Trek
            </motion.h1>
            <motion.p
              className="text-body text-white/70 drop-shadow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Kathmandu to Kala Patthar
            </motion.p>
          </div>

          {/* Bottom gradient for transition */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        </motion.div>

        <div className="px-5 -mt-6 relative z-10">
          {/* Current Position Card */}
          <motion.div variants={itemVariants} className="glass-card-elevated p-5 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-[var(--accent-run)] mb-1">CURRENT LOCATION</p>
                <p className="text-heading text-xl">{currentCamp.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {currentCamp.elevation.toLocaleString()}m elevation
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--accent-run)]">{workoutsRemaining}</p>
                <p className="text-xs text-[var(--text-muted)]">to Kala Patthar</p>
              </div>
            </div>

            {/* Temperature indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  theme.temperature === 'warm'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400'
                    : theme.temperature === 'cool'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-400'
                      : theme.temperature === 'cold'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                        : 'bg-gradient-to-r from-slate-400 to-white'
                }`}
                style={{ width: `${(state.currentWeek / 9) * 100}%` }}
              />
              <span className="text-xs text-[var(--text-muted)]">{theme.temperature}</span>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-5">
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

          {/* Elevation Profile Mini */}
          <motion.div variants={itemVariants} className="glass-card p-4 mb-5">
            <p className="text-caption text-[var(--text-muted)] mb-3">ELEVATION PROFILE</p>
            <div className="relative h-16">
              <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                {/* Elevation line */}
                <path
                  d="M 0 55 L 22 50 L 44 42 L 66 36 L 88 28 L 110 20 L 132 14 L 154 10 L 176 8 L 200 5"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                {/* Completed portion */}
                <path
                  d={`M 0 55 ${state.currentWeek >= 2 ? 'L 22 50' : ''} ${state.currentWeek >= 3 ? 'L 44 42' : ''} ${state.currentWeek >= 4 ? 'L 66 36' : ''} ${state.currentWeek >= 5 ? 'L 88 28' : ''} ${state.currentWeek >= 6 ? 'L 110 20' : ''} ${state.currentWeek >= 7 ? 'L 132 14' : ''} ${state.currentWeek >= 8 ? 'L 154 10' : ''} ${state.currentWeek >= 9 ? 'L 176 8' : ''}`}
                  fill="none"
                  stroke="url(#elevGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="elevGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                {/* Camp dots */}
                {CAMPS.map((camp, i) => {
                  const x = i * 22 + (i === 0 ? 0 : 2)
                  const y = 55 - i * 5.5
                  const isCompleted = completedWeeks.includes(camp.week)
                  const isCurrent = camp.week === state.currentWeek
                  return (
                    <circle
                      key={camp.week}
                      cx={x}
                      cy={y}
                      r={isCurrent ? 4 : 3}
                      fill={isCompleted ? '#2dd4bf' : isCurrent ? '#f97316' : 'rgba(255,255,255,0.3)'}
                    />
                  )
                })}
              </svg>
              {/* Labels */}
              <div className="absolute bottom-0 left-0 text-[9px] text-[var(--text-muted)]">1,400m</div>
              <div className="absolute top-0 right-0 text-[9px] text-[var(--text-muted)]">5,545m</div>
            </div>
          </motion.div>

          {/* Camp List */}
          <motion.div variants={itemVariants}>
            <p className="text-caption text-[var(--text-muted)] mb-4">ALL CAMPS</p>
            <div className="space-y-2">
              {CAMPS.map((camp) => {
                const weekWorkouts = state.completedWorkouts.filter((w) => w.week === camp.week)
                const completedDays = weekWorkouts.length
                const isCurrent = camp.week === state.currentWeek
                const isPast = camp.week < state.currentWeek || completedDays === 3
                const isFuture = camp.week > state.currentWeek && completedDays === 0

                return (
                  <motion.button
                    key={camp.week}
                    onClick={() => setExpandedCamp(expandedCamp === camp.week ? null : camp.week)}
                    className="w-full text-left"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`glass-card p-4 transition-all ${
                        isCurrent ? 'border border-[rgba(249,115,22,0.3)]' : ''
                      } ${expandedCamp === camp.week ? 'bg-[rgba(255,255,255,0.05)]' : ''}`}
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
                                  : 'none',
                            }}
                          >
                            {isPast ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : camp.week === 9 ? (
                              '⛰️'
                            ) : (
                              camp.week
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${isFuture ? 'text-[var(--text-muted)]' : ''}`}>
                              {camp.name}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              Week {camp.week} • {camp.elevation.toLocaleString()}m
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((day) => (
                              <div
                                key={day}
                                className="w-2 h-2 rounded-full"
                                style={{
                                  background: isWorkoutCompleted(state, camp.week, day)
                                    ? '#2dd4bf'
                                    : isCurrent && state.currentDay === day
                                      ? '#f97316'
                                      : 'rgba(255,255,255,0.1)',
                                }}
                              />
                            ))}
                          </div>
                          <motion.svg
                            animate={{ rotate: expandedCamp === camp.week ? 180 : 0 }}
                            className="w-4 h-4 text-[var(--text-muted)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </motion.svg>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedCamp === camp.week && (
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
                              <p className="text-xs text-[var(--text-muted)]">Theme: {camp.theme}</p>
                              {camp.milestone && (
                                <p className="text-xs text-[#fbbf24] mt-2">Milestone: {camp.milestone}</p>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedCamp(camp.week)
                                }}
                                className="mt-3 text-xs text-[var(--accent-run)] font-semibold"
                              >
                                View Details →
                              </button>
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
        </div>
      </motion.div>

      {/* Camp Detail Card Modal */}
      <CampCard
        week={selectedCamp || 1}
        isOpen={selectedCamp !== null}
        onClose={() => setSelectedCamp(null)}
        completedDays={selectedCamp ? getCompletedDaysForWeek(selectedCamp) : 0}
      />
    </div>
  )
}

export function Journey({ state }: JourneyProps) {
  return (
    <EnvironmentProvider week={state.currentWeek}>
      <JourneyContent state={state} />
    </EnvironmentProvider>
  )
}
