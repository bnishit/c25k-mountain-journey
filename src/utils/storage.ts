import type { AppState, CompletedWorkout } from '../types'

const STORAGE_KEY = 'c25k-progress'

const DEFAULT_STATE: AppState = {
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: [],
  startDate: null
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_STATE
    return JSON.parse(saved)
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function completeWorkout(
  state: AppState,
  week: number,
  day: number,
  duration: number
): AppState {
  const completed: CompletedWorkout = {
    week,
    day,
    completedAt: new Date().toISOString(),
    actualDuration: duration
  }

  // Calculate next workout
  let nextWeek = week
  let nextDay = day + 1
  if (nextDay > 3) {
    nextDay = 1
    nextWeek = week + 1
  }
  // Cap at week 9 day 3
  if (nextWeek > 9) {
    nextWeek = 9
    nextDay = 3
  }

  const newState: AppState = {
    ...state,
    currentWeek: nextWeek,
    currentDay: nextDay,
    completedWorkouts: [...state.completedWorkouts, completed],
    startDate: state.startDate || new Date().toISOString()
  }

  saveState(newState)
  return newState
}

export function isWorkoutCompleted(
  state: AppState,
  week: number,
  day: number
): boolean {
  return state.completedWorkouts.some(w => w.week === week && w.day === day)
}

export function resetProgress(): AppState {
  localStorage.removeItem(STORAGE_KEY)
  return DEFAULT_STATE
}
