export type IntervalType = 'warmup' | 'run' | 'walk' | 'cooldown'

export interface Interval {
  type: IntervalType
  duration: number // in seconds
}

export interface Workout {
  week: number
  day: number
  intervals: Interval[]
  totalDuration: number // in seconds
}

export interface CompletedWorkout {
  week: number
  day: number
  completedAt: string // ISO date string
  actualDuration: number // in seconds
}

export interface SpeedSettings {
  runSpeed: number  // km/h, default 8.0
  walkSpeed: number // km/h, default 5.0
}

export interface AppState {
  currentWeek: number
  currentDay: number
  completedWorkouts: CompletedWorkout[]
  startDate: string | null // ISO date string when program started
  speedSettings: SpeedSettings
}

export type View = 'today' | 'schedule' | 'history' | 'run' | 'journey' | 'settings' | 'detail'
