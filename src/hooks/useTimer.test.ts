import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'
import type { Interval } from '../types'

const createTestIntervals = (): Interval[] => [
  { type: 'warmup', duration: 5 },
  { type: 'run', duration: 10 },
  { type: 'walk', duration: 5 },
  { type: 'cooldown', duration: 5 }
]

const createLongIntervals = (): Interval[] => [
  { type: 'warmup', duration: 300 },
  { type: 'run', duration: 180 }, // 3 min, will trigger halfway
  { type: 'cooldown', duration: 300 }
]

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.isRunning).toBe(false)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.currentIntervalIndex).toBe(0)
      expect(result.current.intervalTimeRemaining).toBe(intervals[0].duration)
      expect(result.current.totalElapsed).toBe(0)
    })

    it('should calculate total duration correctly', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      const expectedTotal = intervals.reduce((sum, i) => sum + i.duration, 0)
      expect(result.current.totalDuration).toBe(expectedTotal)
    })

    it('should have current interval set to first interval', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.currentInterval).toEqual(intervals[0])
    })

    it('should calculate intervals remaining correctly', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.intervalsRemaining).toBe(intervals.length - 1)
    })

    it('should have progress at 0', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.progress).toBe(0)
    })

    it('should have interval progress at 0', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.intervalProgress).toBe(0)
    })
  })

  describe('timer controls', () => {
    it('should start timer and set isRunning to true', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(true)
      expect(result.current.isPaused).toBe(false)
    })

    it('should pause timer and set isPaused to true', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        result.current.pause()
      })

      expect(result.current.isRunning).toBe(true)
      expect(result.current.isPaused).toBe(true)
    })

    it('should resume timer and set isPaused to false', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
        result.current.pause()
      })

      act(() => {
        result.current.resume()
      })

      expect(result.current.isRunning).toBe(true)
      expect(result.current.isPaused).toBe(false)
    })

    it('should stop timer and reset all state', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
        vi.advanceTimersByTime(3000)
      })

      act(() => {
        result.current.stop()
      })

      expect(result.current.isRunning).toBe(false)
      expect(result.current.isPaused).toBe(false)
      expect(result.current.currentIntervalIndex).toBe(0)
      expect(result.current.intervalTimeRemaining).toBe(intervals[0].duration)
      expect(result.current.totalElapsed).toBe(0)
    })

    it('should call onIntervalChange when starting', () => {
      const intervals = createTestIntervals()
      const onIntervalChange = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onIntervalChange })
      )

      act(() => {
        result.current.start()
      })

      expect(onIntervalChange).toHaveBeenCalledWith(intervals[0], 0)
    })
  })

  describe('timer ticking', () => {
    it('should decrement intervalTimeRemaining each tick', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.intervalTimeRemaining).toBe(intervals[0].duration - 1)
    })

    it('should increment totalElapsed each tick', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.totalElapsed).toBe(3)
    })

    it('should not tick when paused', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
        vi.advanceTimersByTime(2000)
      })

      const elapsedBeforePause = result.current.totalElapsed

      act(() => {
        result.current.pause()
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.totalElapsed).toBe(elapsedBeforePause)
    })

    it('should update progress correctly', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 10 },
        { type: 'run', duration: 10 }
      ]
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      // Advance timer in separate act to allow state updates
      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(result.current.progress).toBe(0.5)
    })
  })

  describe('interval transitions', () => {
    it('should move to next interval when current ends', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      // Advance past first interval
      act(() => {
        vi.advanceTimersByTime(intervals[0].duration * 1000)
      })

      expect(result.current.currentIntervalIndex).toBe(1)
      expect(result.current.currentInterval).toEqual(intervals[1])
    })

    it('should call onIntervalChange on transition', () => {
      const intervals = createTestIntervals()
      const onIntervalChange = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onIntervalChange })
      )

      act(() => {
        result.current.start()
      })

      // Clear the initial call
      onIntervalChange.mockClear()

      // Advance past first interval
      act(() => {
        vi.advanceTimersByTime(intervals[0].duration * 1000)
      })

      // Allow setTimeout to run
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(onIntervalChange).toHaveBeenCalledWith(intervals[1], 1)
    })

    it('should reset intervalTimeRemaining for new interval', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(intervals[0].duration * 1000)
      })

      expect(result.current.intervalTimeRemaining).toBe(intervals[1].duration)
    })

    it('should update intervalsRemaining on transition', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(intervals[0].duration * 1000)
      })

      expect(result.current.intervalsRemaining).toBe(intervals.length - 2)
    })
  })

  describe('workout completion', () => {
    it('should complete workout after last interval', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 2 },
        { type: 'run', duration: 2 }
      ]
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      // Complete all intervals
      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(result.current.isRunning).toBe(false)
    })

    it('should call onComplete callback when workout ends', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 2 },
        { type: 'run', duration: 2 }
      ]
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      // Allow setTimeout to run
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(onComplete).toHaveBeenCalled()
    })

    it('should set intervalTimeRemaining to 0 when complete', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 2 }
      ]
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.intervalTimeRemaining).toBe(0)
    })
  })

  describe('countdown announcements', () => {
    it('should call onCountdown at 30 seconds remaining', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 35 }
      ]
      const onCountdown = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onCountdown })
      )

      act(() => {
        result.current.start()
      })

      // Advance to 30 seconds remaining (35 - 5 = 30)
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onCountdown).toHaveBeenCalledWith(30)
    })

    it('should call onCountdown at 10 seconds remaining', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 15 }
      ]
      const onCountdown = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onCountdown })
      )

      act(() => {
        result.current.start()
      })

      // Advance to 10 seconds remaining (15 - 5 = 10)
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onCountdown).toHaveBeenCalledWith(10)
    })

    it('should not call onCountdown at other times', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 20 }
      ]
      const onCountdown = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onCountdown })
      )

      act(() => {
        result.current.start()
      })

      // Advance 3 seconds
      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(onCountdown).not.toHaveBeenCalled()
    })
  })

  describe('halfway announcements', () => {
    it('should call onHalfway at midpoint for intervals >= 2 min', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 120 } // 2 min
      ]
      const onHalfway = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onHalfway })
      )

      act(() => {
        result.current.start()
      })

      // Advance to halfway (60 seconds remaining out of 120)
      act(() => {
        vi.advanceTimersByTime(60000)
      })

      expect(onHalfway).toHaveBeenCalled()
    })

    it('should not call onHalfway for intervals < 2 min', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 60 } // 1 min
      ]
      const onHalfway = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onHalfway })
      )

      act(() => {
        result.current.start()
      })

      // Advance to halfway
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(onHalfway).not.toHaveBeenCalled()
    })

    it('should only announce halfway once per interval', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 120 }
      ]
      const onHalfway = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onHalfway })
      )

      act(() => {
        result.current.start()
      })

      // Advance past halfway
      act(() => {
        vi.advanceTimersByTime(70000)
      })

      // Only called once even though we passed the halfway point
      expect(onHalfway).toHaveBeenCalledTimes(1)
    })
  })

  describe('skipToNext', () => {
    it('should skip to next interval', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.skipToNext()
      })

      expect(result.current.currentIntervalIndex).toBe(1)
      expect(result.current.currentInterval).toEqual(intervals[1])
    })

    it('should add skipped time to totalElapsed', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
        vi.advanceTimersByTime(2000)
      })

      const elapsedBefore = result.current.totalElapsed
      const remainingBefore = result.current.intervalTimeRemaining

      act(() => {
        result.current.skipToNext()
      })

      expect(result.current.totalElapsed).toBe(elapsedBefore + remainingBefore)
    })

    it('should complete workout if on last interval', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 5 }
      ]
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        result.current.skipToNext()
      })

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current.isRunning).toBe(false)
      expect(onComplete).toHaveBeenCalled()
    })

    it('should do nothing if timer not running', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      const initialIndex = result.current.currentIntervalIndex

      act(() => {
        result.current.skipToNext()
      })

      expect(result.current.currentIntervalIndex).toBe(initialIndex)
    })

    it('should call onIntervalChange when skipping', () => {
      const intervals = createTestIntervals()
      const onIntervalChange = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onIntervalChange })
      )

      act(() => {
        result.current.start()
      })

      onIntervalChange.mockClear()

      act(() => {
        result.current.skipToNext()
      })

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(onIntervalChange).toHaveBeenCalledWith(intervals[1], 1)
    })
  })

  describe('progress calculations', () => {
    it('should calculate overall progress as elapsed/total', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 10 },
        { type: 'run', duration: 10 }
      ]
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.progress).toBe(5 / 20)
    })

    it('should calculate interval progress correctly', () => {
      const intervals: Interval[] = [
        { type: 'warmup', duration: 10 }
      ]
      const { result } = renderHook(() => useTimer({ intervals }))

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.intervalProgress).toBe(0.5)
    })

    it('should return 0 progress at start', () => {
      const intervals = createTestIntervals()
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.progress).toBe(0)
      expect(result.current.intervalProgress).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty intervals array gracefully', () => {
      const intervals: Interval[] = []
      const { result } = renderHook(() => useTimer({ intervals }))

      expect(result.current.intervalTimeRemaining).toBe(0)
      expect(result.current.totalDuration).toBe(0)
    })

    it('should handle single interval', () => {
      const intervals: Interval[] = [
        { type: 'run', duration: 5 }
      ]
      const onComplete = vi.fn()
      const { result } = renderHook(() =>
        useTimer({ intervals, onComplete })
      )

      act(() => {
        result.current.start()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current.isRunning).toBe(false)
      expect(onComplete).toHaveBeenCalled()
    })
  })
})
