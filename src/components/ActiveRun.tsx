import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Workout, Interval } from '../types'
import { useTimer } from '../hooks/useTimer'
import { useAudio } from '../hooks/useAudio'
import { formatDuration, getIntervalLabel } from '../data/program'
import { Confetti, SuccessRings } from './Confetti'

interface ActiveRunProps {
  workout: Workout
  onComplete: (duration: number) => void
  onCancel: () => void
}

export function ActiveRun({ workout, onComplete, onCancel }: ActiveRunProps) {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const audio = useAudio()

  const handleIntervalChange = useCallback((interval: Interval) => {
    audio.announceStart(interval.type)
  }, [audio])

  const handleCountdown = useCallback((seconds: number) => {
    audio.announceCountdown(seconds)
  }, [audio])

  const handleHalfway = useCallback(() => {
    audio.announceHalfway()
  }, [audio])

  const handleComplete = useCallback(() => {
    setShowCelebration(true)
    audio.announceComplete()
    setTimeout(() => setShowCelebration(false), 3000)
  }, [audio])

  const timer = useTimer({
    intervals: workout.intervals,
    onIntervalChange: handleIntervalChange,
    onCountdown: handleCountdown,
    onHalfway: handleHalfway,
    onComplete: handleComplete
  })

  useEffect(() => {
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen')
          setWakeLock(lock)
        }
      } catch { /* ignore */ }
    }
    if (timer.isRunning) requestWakeLock()
    return () => { wakeLock?.release() }
  }, [timer.isRunning])

  useEffect(() => {
    if (!timer.isRunning && timer.totalElapsed > 0 && timer.intervalTimeRemaining === 0) {
      setTimeout(() => onComplete(timer.totalElapsed), 2500)
    }
  }, [timer.isRunning, timer.totalElapsed, timer.intervalTimeRemaining, onComplete])

  const handleCancel = () => {
    timer.stop()
    audio.stop()
    wakeLock?.release()
    onCancel()
  }

  const handleStartWithCountdown = () => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          if (prev === 1) {
            setTimeout(() => { setCountdown(null); timer.start() }, 800)
          }
          return prev === 1 ? 0 : null
        }
        return prev - 1
      })
    }, 1000)
  }

  const getAccentColor = () => {
    if (!timer.currentInterval) return '#f97316'
    switch (timer.currentInterval.type) {
      case 'run': return '#f97316'
      case 'walk': return '#2dd4bf'
      default: return '#a78bfa'
    }
  }

  const getGlowColor = () => {
    if (!timer.currentInterval) return 'rgba(249, 115, 22, 0.15)'
    switch (timer.currentInterval.type) {
      case 'run': return 'rgba(249, 115, 22, 0.15)'
      case 'walk': return 'rgba(45, 212, 191, 0.15)'
      default: return 'rgba(167, 139, 250, 0.15)'
    }
  }

  const accentColor = getAccentColor()
  const size = 280
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Countdown screen
  if (countdown !== null) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-display text-[160px]"
            style={{ color: countdown === 0 ? '#f97316' : 'var(--text-primary)' }}
          >
            {countdown === 0 ? 'GO' : countdown}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Pre-start screen
  if (!timer.isRunning && timer.totalElapsed === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-[var(--text-muted)] mb-2">
              Week {workout.week} · Day {workout.day}
            </p>
            <p className="text-heading text-2xl mb-2">{formatDuration(workout.totalDuration)}</p>
            <p className="text-body text-[var(--text-tertiary)] mb-12 max-w-xs mx-auto">
              Put in your earphones. You'll hear voice cues for each interval.
            </p>
          </motion.div>

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartWithCountdown}
            className="relative w-44 h-44 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 8px 40px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255,255,255,0.15) inset'
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: 'rgba(249, 115, 22, 0.5)' }}
            />
            <span className="relative text-display text-2xl text-white">Start</span>
          </motion.button>
        </div>

        <button
          onClick={handleCancel}
          className="py-6 text-[var(--text-muted)] font-medium transition-colors hover:text-[var(--text-secondary)]"
        >
          Cancel
        </button>
      </div>
    )
  }

  // Active run screen
  return (
    <motion.div
      className="min-h-screen px-6 flex flex-col transition-colors duration-700"
      style={{ background: `radial-gradient(circle at 50% 30%, ${getGlowColor()} 0%, var(--bg-primary) 70%)` }}
    >
      <Confetti show={showCelebration} />
      <SuccessRings show={showCelebration} />

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Interval label */}
        <motion.div
          key={timer.currentIntervalIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="text-caption text-[var(--text-muted)]">
            {timer.currentIntervalIndex + 1} / {workout.intervals.length}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span
            className="text-caption"
            style={{ color: accentColor }}
          >
            {timer.currentInterval ? getIntervalLabel(timer.currentInterval.type).toUpperCase() : ''}
          </span>
        </motion.div>

        {/* Circular Progress Timer */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={accentColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - timer.intervalProgress) }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 12px ${accentColor}50)` }}
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={timer.intervalTimeRemaining}
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
              className="text-display text-[72px] font-mono-timer"
            >
              {formatDuration(timer.intervalTimeRemaining)}
            </motion.p>
            {!timer.isPaused && (
              <motion.div
                className="w-2 h-2 rounded-full mt-3"
                style={{ background: accentColor }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Pause/Resume button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={timer.isPaused ? timer.resume : timer.pause}
          className="mt-10 w-16 h-16 rounded-full flex items-center justify-center transition-all"
          style={{
            background: timer.isPaused
              ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
              : 'rgba(255,255,255,0.08)',
            boxShadow: timer.isPaused
              ? '0 4px 20px rgba(249, 115, 22, 0.3)'
              : 'none',
            border: timer.isPaused ? 'none' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {timer.isPaused ? (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          )}
        </motion.button>

        {/* Overall progress */}
        <div className="w-full max-w-xs mt-12">
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
            <span>Overall</span>
            <span>{formatDuration(timer.totalElapsed)} / {formatDuration(timer.totalDuration)}</span>
          </div>
          <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              animate={{ width: `${timer.progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCancel}
        className="py-6 text-[var(--text-muted)] font-medium transition-colors hover:text-[var(--text-secondary)]"
      >
        End Workout
      </button>
    </motion.div>
  )
}
