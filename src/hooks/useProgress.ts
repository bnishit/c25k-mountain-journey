import { useState, useEffect, useCallback } from 'react'
import type { AppState } from '../types'
import { loadState, saveState, completeWorkout as completeWorkoutUtil, resetProgress as resetProgressUtil } from '../utils/storage'

export function useProgress() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const completeWorkout = useCallback((week: number, day: number, duration: number) => {
    setState(prev => completeWorkoutUtil(prev, week, day, duration))
  }, [])

  const resetProgress = useCallback(() => {
    setState(resetProgressUtil())
  }, [])

  return {
    state,
    completeWorkout,
    resetProgress
  }
}
