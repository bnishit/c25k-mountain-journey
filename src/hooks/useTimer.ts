import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { Interval } from '../types'

interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentIntervalIndex: number
  intervalTimeRemaining: number
  totalElapsed: number
}

interface UseTimerProps {
  intervals: Interval[]
  onIntervalChange?: (interval: Interval, index: number) => void
  onCountdown?: (seconds: number) => void
  onHalfway?: () => void
  onComplete?: () => void
}

export function useTimer({
  intervals,
  onIntervalChange,
  onCountdown,
  onHalfway,
  onComplete
}: UseTimerProps) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    currentIntervalIndex: 0,
    intervalTimeRemaining: intervals[0]?.duration ?? 0,
    totalElapsed: 0
  })

  const timerRef = useRef<number | null>(null)
  const halfwayAnnouncedRef = useRef<Set<number>>(new Set())

  // Use refs for callbacks to avoid recreating tick function
  const callbacksRef = useRef({ onIntervalChange, onCountdown, onHalfway, onComplete })
  callbacksRef.current = { onIntervalChange, onCountdown, onHalfway, onComplete }

  // Memoize intervals reference for stable tick function
  const intervalsRef = useRef(intervals)
  intervalsRef.current = intervals

  // Memoize total duration
  const totalDuration = useMemo(
    () => intervals.reduce((sum, i) => sum + i.duration, 0),
    [intervals]
  )
  const currentInterval = intervals[state.currentIntervalIndex]

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Stable tick function that reads from refs
  const tick = useCallback(() => {
    setState(prev => {
      if (!prev.isRunning || prev.isPaused) return prev

      const intervals = intervalsRef.current
      const { onCountdown, onHalfway, onComplete, onIntervalChange } = callbacksRef.current

      const newIntervalRemaining = prev.intervalTimeRemaining - 1
      const newTotalElapsed = prev.totalElapsed + 1

      // Check for countdown announcements
      if (onCountdown && (newIntervalRemaining === 10 || newIntervalRemaining === 30)) {
        onCountdown(newIntervalRemaining)
      }

      // Check for halfway point in current interval
      const interval = intervals[prev.currentIntervalIndex]
      const halfwayPoint = Math.floor(interval.duration / 2)
      if (
        onHalfway &&
        interval.duration >= 120 && // Only for intervals 2+ minutes
        newIntervalRemaining === halfwayPoint &&
        !halfwayAnnouncedRef.current.has(prev.currentIntervalIndex)
      ) {
        halfwayAnnouncedRef.current.add(prev.currentIntervalIndex)
        onHalfway()
      }

      // Move to next interval
      if (newIntervalRemaining <= 0) {
        const nextIndex = prev.currentIntervalIndex + 1

        // Workout complete
        if (nextIndex >= intervals.length) {
          if (onComplete) {
            setTimeout(onComplete, 100)
          }
          return {
            ...prev,
            isRunning: false,
            intervalTimeRemaining: 0,
            totalElapsed: newTotalElapsed
          }
        }

        // Next interval
        const nextInterval = intervals[nextIndex]
        if (onIntervalChange) {
          setTimeout(() => onIntervalChange(nextInterval, nextIndex), 100)
        }

        return {
          ...prev,
          currentIntervalIndex: nextIndex,
          intervalTimeRemaining: nextInterval.duration,
          totalElapsed: newTotalElapsed
        }
      }

      return {
        ...prev,
        intervalTimeRemaining: newIntervalRemaining,
        totalElapsed: newTotalElapsed
      }
    })
  }, []) // Empty deps - reads from refs

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }))
    const { onIntervalChange } = callbacksRef.current
    const intervals = intervalsRef.current
    if (onIntervalChange && intervals[0]) {
      onIntervalChange(intervals[0], 0)
    }
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }))
  }, [])

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }))
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    halfwayAnnouncedRef.current.clear()
    const intervals = intervalsRef.current
    setState({
      isRunning: false,
      isPaused: false,
      currentIntervalIndex: 0,
      intervalTimeRemaining: intervals[0]?.duration ?? 0,
      totalElapsed: 0
    })
  }, [clearTimer])

  const skipToNext = useCallback(() => {
    setState(prev => {
      if (!prev.isRunning) return prev

      const intervals = intervalsRef.current
      const { onComplete, onIntervalChange } = callbacksRef.current

      const timeSkipped = prev.intervalTimeRemaining
      const nextIndex = prev.currentIntervalIndex + 1

      // If this is the last interval, complete the workout
      if (nextIndex >= intervals.length) {
        if (onComplete) {
          setTimeout(onComplete, 100)
        }
        return {
          ...prev,
          isRunning: false,
          intervalTimeRemaining: 0,
          totalElapsed: prev.totalElapsed + timeSkipped
        }
      }

      // Move to next interval
      const nextInterval = intervals[nextIndex]
      if (onIntervalChange) {
        setTimeout(() => onIntervalChange(nextInterval, nextIndex), 100)
      }

      return {
        ...prev,
        currentIntervalIndex: nextIndex,
        intervalTimeRemaining: nextInterval.duration,
        totalElapsed: prev.totalElapsed + timeSkipped
      }
    })
  }, [])

  // Timer loop - now tick is stable so this effect rarely re-runs
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      timerRef.current = window.setInterval(tick, 1000)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [state.isRunning, state.isPaused, tick, clearTimer])

  const intervalsRemaining = intervals.length - state.currentIntervalIndex - 1

  return {
    ...state,
    currentInterval,
    totalDuration,
    intervalsRemaining,
    totalIntervals: intervals.length,
    progress: state.totalElapsed / totalDuration,
    intervalProgress: currentInterval
      ? 1 - state.intervalTimeRemaining / currentInterval.duration
      : 0,
    start,
    pause,
    resume,
    stop,
    skipToNext
  }
}
