import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Workout, Interval, SpeedSettings } from '../types'
import { useTimer } from '../hooks/useTimer'
import { useAudio } from '../hooks/useAudio'
import { formatDuration, getIntervalLabel } from '../data/program'
import { Confetti, SuccessRings } from './Confetti'
import { SkyLayer } from './EverestScene/SkyLayer'
import { WeatherEffects } from './WeatherEffects/WeatherEffects'
import { useEnvironmentTheme, EnvironmentProvider } from '../contexts/EnvironmentContext'
import { getCamp } from '../data/story'

interface ActiveRunProps {
  workout: Workout
  speedSettings: SpeedSettings
  onComplete: (duration: number) => void
  onCancel: () => void
}

function ActiveRunContent({ workout, speedSettings, onComplete, onCancel }: ActiveRunProps) {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const audio = useAudio()
  const theme = useEnvironmentTheme(workout.week)
  const camp = getCamp(workout.week)

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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Environmental background */}
        <div className="absolute inset-0">
          <SkyLayer theme={theme} />
          <WeatherEffects theme={theme} />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative text-display text-[160px]"
            style={{ color: countdown === 0 ? '#f97316' : 'white' }}
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
      <div className="min-h-screen relative overflow-hidden px-6 flex flex-col">
        {/* Environmental background */}
        <div className="absolute inset-0">
          <SkyLayer theme={theme} />
          <WeatherEffects theme={theme} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative flex-1 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Camp badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4"
            >
              <span className="text-xs font-semibold text-white/70">
                {camp.name}
              </span>
              <span className="text-xs font-bold text-orange-400">
                {camp.elevation.toLocaleString()}m
              </span>
            </motion.div>

            <p className="text-caption text-white/60 mb-2">
              Week {workout.week} · Day {workout.day}
            </p>
            <p className="text-heading text-2xl text-white mb-2">{formatDuration(workout.totalDuration)}</p>
            <p className="text-body text-white/60 mb-12 max-w-xs mx-auto">
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
          className="relative py-6 text-white/60 font-medium transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>
    )
  }

  // Active run screen
  return (
    <motion.div
      className="min-h-screen relative overflow-hidden px-6 flex flex-col transition-colors duration-700"
    >
      {/* Environmental background */}
      <div className="absolute inset-0">
        <SkyLayer theme={theme} />
        <WeatherEffects theme={theme} />
      </div>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 50% 30%, ${getGlowColor()} 0%, rgba(0,0,0,0.6) 70%)` }}
      />

      <Confetti show={showCelebration} />
      <SuccessRings show={showCelebration} />

      {/* Altitude badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <span className="text-xs font-bold text-orange-400">
          {camp.elevation.toLocaleString()}m
        </span>
      </motion.div>

      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Interval label and remaining count */}
        <motion.div
          key={timer.currentIntervalIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <span
            className="text-2xl font-bold"
            style={{ color: accentColor }}
          >
            {timer.currentInterval ? getIntervalLabel(timer.currentInterval.type).toUpperCase() : ''}
          </span>
          {/* Speed display for run/walk */}
          {timer.currentInterval && (timer.currentInterval.type === 'run' || timer.currentInterval.type === 'walk') && (
            <div className="mt-1">
              <span className="text-sm font-medium" style={{ color: accentColor }}>
                {timer.currentInterval.type === 'run' ? speedSettings.runSpeed.toFixed(1) : speedSettings.walkSpeed.toFixed(1)} km/h
              </span>
            </div>
          )}
        </motion.div>

        {/* Intervals remaining */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-caption text-[var(--text-muted)]">
            {timer.currentIntervalIndex + 1} of {timer.totalIntervals}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="text-caption text-[var(--text-muted)]">
            {timer.intervalsRemaining} left
          </span>
        </div>

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
            {/* Progress ring - removed expensive drop-shadow filter */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={accentColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - timer.intervalProgress)}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>

          {/* Timer display - removed scale animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-display text-[72px] font-mono-timer">
              {formatDuration(timer.intervalTimeRemaining)}
            </p>
            {!timer.isPaused && (
              <div
                className="w-2 h-2 rounded-full mt-3 animate-pulse"
                style={{ background: accentColor }}
              />
            )}
          </div>
        </div>

        {/* Control buttons: Pause/Resume and Skip */}
        <div className="flex items-center gap-4 mt-10">
          {/* Pause/Resume button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={timer.isPaused ? timer.resume : timer.pause}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
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

          {/* Skip button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={timer.skipToNext}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </motion.button>
        </div>

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
        className="relative py-6 text-white/60 font-medium transition-colors hover:text-white"
      >
        End Workout
      </button>
    </motion.div>
  )
}

export function ActiveRun(props: ActiveRunProps) {
  return (
    <EnvironmentProvider week={props.workout.week}>
      <ActiveRunContent {...props} />
    </EnvironmentProvider>
  )
}
