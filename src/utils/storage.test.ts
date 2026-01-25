import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadState,
  saveState,
  completeWorkout,
  isWorkoutCompleted,
  resetProgress,
  updateSpeedSettings
} from './storage'
import type { AppState, SpeedSettings } from '../types'

const DEFAULT_SPEED_SETTINGS: SpeedSettings = {
  runSpeed: 8.0,
  walkSpeed: 5.0
}

const DEFAULT_STATE: AppState = {
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: [],
  startDate: null,
  speedSettings: DEFAULT_SPEED_SETTINGS
}

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadState', () => {
    it('should return default state when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)

      const state = loadState()

      expect(state).toEqual(DEFAULT_STATE)
    })

    it('should parse and return saved state from localStorage', () => {
      const savedState: AppState = {
        currentWeek: 3,
        currentDay: 2,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 }
        ],
        startDate: '2024-01-01T00:00:00.000Z',
        speedSettings: { runSpeed: 9.0, walkSpeed: 6.0 }
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedState))

      const state = loadState()

      expect(state).toEqual(savedState)
    })

    it('should handle malformed JSON gracefully and return default state', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('{ invalid json }')

      const state = loadState()

      expect(state).toEqual(DEFAULT_STATE)
    })

    it('should migrate old data without speedSettings', () => {
      const oldState = {
        currentWeek: 2,
        currentDay: 3,
        completedWorkouts: [],
        startDate: '2024-01-01T00:00:00.000Z'
        // No speedSettings
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(oldState))

      const state = loadState()

      expect(state.speedSettings).toEqual(DEFAULT_SPEED_SETTINGS)
      expect(state.currentWeek).toBe(2)
      expect(state.currentDay).toBe(3)
    })

    it('should preserve existing speedSettings during migration', () => {
      const stateWithSpeed = {
        currentWeek: 1,
        currentDay: 1,
        completedWorkouts: [],
        startDate: null,
        speedSettings: { runSpeed: 10.0, walkSpeed: 4.0 }
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(stateWithSpeed))

      const state = loadState()

      expect(state.speedSettings).toEqual({ runSpeed: 10.0, walkSpeed: 4.0 })
    })
  })

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const state: AppState = {
        currentWeek: 2,
        currentDay: 1,
        completedWorkouts: [],
        startDate: null,
        speedSettings: DEFAULT_SPEED_SETTINGS
      }

      saveState(state)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'c25k-progress',
        JSON.stringify(state)
      )
    })

    it('should serialize completedWorkouts correctly', () => {
      const state: AppState = {
        currentWeek: 2,
        currentDay: 1,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 },
          { week: 1, day: 2, completedAt: '2024-01-03T00:00:00.000Z', actualDuration: 1850 }
        ],
        startDate: '2024-01-01T00:00:00.000Z',
        speedSettings: DEFAULT_SPEED_SETTINGS
      }

      saveState(state)

      const savedValue = vi.mocked(localStorage.setItem).mock.calls[0][1]
      const parsed = JSON.parse(savedValue)
      expect(parsed.completedWorkouts).toHaveLength(2)
    })
  })

  describe('completeWorkout', () => {
    it('should advance from day 1 to day 2 within the same week', () => {
      const state: AppState = { ...DEFAULT_STATE }

      const newState = completeWorkout(state, 1, 1, 1800)

      expect(newState.currentWeek).toBe(1)
      expect(newState.currentDay).toBe(2)
    })

    it('should advance from day 2 to day 3 within the same week', () => {
      const state: AppState = { ...DEFAULT_STATE, currentDay: 2 }

      const newState = completeWorkout(state, 1, 2, 1800)

      expect(newState.currentWeek).toBe(1)
      expect(newState.currentDay).toBe(3)
    })

    it('should advance from day 3 to day 1 of next week', () => {
      const state: AppState = { ...DEFAULT_STATE, currentWeek: 1, currentDay: 3 }

      const newState = completeWorkout(state, 1, 3, 1800)

      expect(newState.currentWeek).toBe(2)
      expect(newState.currentDay).toBe(1)
    })

    it('should cap progress at week 9 day 3 (program end)', () => {
      const state: AppState = { ...DEFAULT_STATE, currentWeek: 9, currentDay: 3 }

      const newState = completeWorkout(state, 9, 3, 1800)

      expect(newState.currentWeek).toBe(9)
      expect(newState.currentDay).toBe(3)
    })

    it('should add completed workout to history', () => {
      const state: AppState = { ...DEFAULT_STATE }

      const newState = completeWorkout(state, 1, 1, 1800)

      expect(newState.completedWorkouts).toHaveLength(1)
      expect(newState.completedWorkouts[0]).toMatchObject({
        week: 1,
        day: 1,
        actualDuration: 1800
      })
      expect(newState.completedWorkouts[0].completedAt).toBeDefined()
    })

    it('should set startDate on first workout completion', () => {
      const state: AppState = { ...DEFAULT_STATE, startDate: null }

      const newState = completeWorkout(state, 1, 1, 1800)

      expect(newState.startDate).not.toBeNull()
      expect(new Date(newState.startDate!).getTime()).toBeLessThanOrEqual(Date.now())
    })

    it('should not overwrite existing startDate', () => {
      const existingDate = '2024-01-01T00:00:00.000Z'
      const state: AppState = { ...DEFAULT_STATE, startDate: existingDate }

      const newState = completeWorkout(state, 1, 1, 1800)

      expect(newState.startDate).toBe(existingDate)
    })

    it('should persist state to localStorage', () => {
      const state: AppState = { ...DEFAULT_STATE }

      completeWorkout(state, 1, 1, 1800)

      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should record accurate actualDuration', () => {
      const state: AppState = { ...DEFAULT_STATE }
      const duration = 1923

      const newState = completeWorkout(state, 1, 1, duration)

      expect(newState.completedWorkouts[0].actualDuration).toBe(duration)
    })

    it('should preserve existing completedWorkouts when adding new one', () => {
      const state: AppState = {
        ...DEFAULT_STATE,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 }
        ]
      }

      const newState = completeWorkout(state, 1, 2, 1850)

      expect(newState.completedWorkouts).toHaveLength(2)
      expect(newState.completedWorkouts[0].week).toBe(1)
      expect(newState.completedWorkouts[0].day).toBe(1)
      expect(newState.completedWorkouts[1].week).toBe(1)
      expect(newState.completedWorkouts[1].day).toBe(2)
    })
  })

  describe('isWorkoutCompleted', () => {
    it('should return true for completed workouts', () => {
      const state: AppState = {
        ...DEFAULT_STATE,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 },
          { week: 1, day: 2, completedAt: '2024-01-03T00:00:00.000Z', actualDuration: 1850 }
        ]
      }

      expect(isWorkoutCompleted(state, 1, 1)).toBe(true)
      expect(isWorkoutCompleted(state, 1, 2)).toBe(true)
    })

    it('should return false for uncompleted workouts', () => {
      const state: AppState = {
        ...DEFAULT_STATE,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 }
        ]
      }

      expect(isWorkoutCompleted(state, 1, 2)).toBe(false)
      expect(isWorkoutCompleted(state, 2, 1)).toBe(false)
    })

    it('should handle empty completion history', () => {
      const state: AppState = { ...DEFAULT_STATE, completedWorkouts: [] }

      expect(isWorkoutCompleted(state, 1, 1)).toBe(false)
    })
  })

  describe('resetProgress', () => {
    it('should remove state from localStorage', () => {
      resetProgress()

      expect(localStorage.removeItem).toHaveBeenCalledWith('c25k-progress')
    })

    it('should return default state', () => {
      const state = resetProgress()

      expect(state).toEqual(DEFAULT_STATE)
    })
  })

  describe('updateSpeedSettings', () => {
    it('should update speed settings', () => {
      const state: AppState = { ...DEFAULT_STATE }
      const newSettings: SpeedSettings = { runSpeed: 10.0, walkSpeed: 6.0 }

      const newState = updateSpeedSettings(state, newSettings)

      expect(newState.speedSettings).toEqual(newSettings)
    })

    it('should persist updated state to localStorage', () => {
      const state: AppState = { ...DEFAULT_STATE }
      const newSettings: SpeedSettings = { runSpeed: 10.0, walkSpeed: 6.0 }

      updateSpeedSettings(state, newSettings)

      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should preserve other state properties', () => {
      const state: AppState = {
        currentWeek: 5,
        currentDay: 2,
        completedWorkouts: [
          { week: 1, day: 1, completedAt: '2024-01-01T00:00:00.000Z', actualDuration: 1800 }
        ],
        startDate: '2024-01-01T00:00:00.000Z',
        speedSettings: DEFAULT_SPEED_SETTINGS
      }
      const newSettings: SpeedSettings = { runSpeed: 12.0, walkSpeed: 5.5 }

      const newState = updateSpeedSettings(state, newSettings)

      expect(newState.currentWeek).toBe(5)
      expect(newState.currentDay).toBe(2)
      expect(newState.completedWorkouts).toHaveLength(1)
      expect(newState.startDate).toBe('2024-01-01T00:00:00.000Z')
    })
  })
})
