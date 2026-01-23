import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { View, CompletedWorkout, SpeedSettings } from './types'
import { useProgress } from './hooks/useProgress'
import { getWorkout } from './data/program'
import { Navigation } from './components/Navigation'
import { TodayWorkout } from './components/TodayWorkout'
import { ActiveRun } from './components/ActiveRun'
import { Schedule } from './components/Schedule'
import { History } from './components/History'
import { Journey } from './components/Journey'
import { Settings } from './components/Settings'
import { RunDetail } from './components/RunDetail'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const runVariants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
}

function App() {
  const [view, setView] = useState<View>('today')
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null)
  const [runSpeedSettings, setRunSpeedSettings] = useState<SpeedSettings | null>(null)
  const { state, completeWorkout, resetProgress, updateSpeeds } = useProgress()

  const currentWorkout = getWorkout(state.currentWeek, state.currentDay)

  const handleStartRun = useCallback((speedSettings: SpeedSettings) => {
    setRunSpeedSettings(speedSettings)
    setView('run')
  }, [])

  const handleCompleteRun = useCallback((duration: number) => {
    completeWorkout(state.currentWeek, state.currentDay, duration)
    setView('today')
  }, [state.currentWeek, state.currentDay, completeWorkout])

  const handleCancelRun = useCallback(() => {
    setView('today')
  }, [])

  const handleNavigate = useCallback((newView: View) => {
    setView(newView)
  }, [])

  const handleSelectWorkout = useCallback((workout: CompletedWorkout) => {
    setSelectedWorkout(workout)
    setView('detail')
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedWorkout(null)
    setView('history')
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'today' && (
          <motion.div
            key="today"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <TodayWorkout
              state={state}
              onStartRun={handleStartRun}
              onSettings={() => setView('settings')}
              onUpdateSpeeds={updateSpeeds}
            />
          </motion.div>
        )}

        {view === 'run' && currentWorkout && (
          <motion.div
            key="run"
            variants={runVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50"
          >
            <ActiveRun
              workout={currentWorkout}
              speedSettings={runSpeedSettings || state.speedSettings}
              onComplete={handleCompleteRun}
              onCancel={handleCancelRun}
            />
          </motion.div>
        )}

        {view === 'schedule' && (
          <motion.div
            key="schedule"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Schedule state={state} />
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div
            key="history"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <History state={state} onReset={resetProgress} onSelectWorkout={handleSelectWorkout} />
          </motion.div>
        )}

        {view === 'detail' && selectedWorkout && (
          <motion.div
            key="detail"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <RunDetail workout={selectedWorkout} onBack={handleBackFromDetail} />
          </motion.div>
        )}

        {view === 'journey' && (
          <motion.div
            key="journey"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Journey state={state} />
          </motion.div>
        )}

        {view === 'settings' && (
          <motion.div
            key="settings"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Settings
              onClose={() => setView('today')}
              speedSettings={state.speedSettings}
              onUpdateSpeeds={updateSpeeds}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation currentView={view} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
