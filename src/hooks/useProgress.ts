import { useState, useEffect, useCallback } from 'react'
import type { AppState, SpeedSettings } from '../types'
import { loadState, saveState, completeWorkout as completeWorkoutUtil, resetProgress as resetProgressUtil, updateSpeedSettings as updateSpeedSettingsUtil } from '../utils/storage'

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

  const updateSpeeds = useCallback((speedSettings: SpeedSettings) => {
    setState(prev => updateSpeedSettingsUtil(prev, speedSettings))
  }, [])

  return {
    state,
    completeWorkout,
    resetProgress,
    updateSpeeds
  }
}
