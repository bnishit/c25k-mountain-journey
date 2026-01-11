import type { Interval, Workout } from '../types'

const WARMUP: Interval = { type: 'warmup', duration: 300 } // 5 min
const COOLDOWN: Interval = { type: 'cooldown', duration: 300 } // 5 min

function run(seconds: number): Interval {
  return { type: 'run', duration: seconds }
}

function walk(seconds: number): Interval {
  return { type: 'walk', duration: seconds }
}

function repeat<T>(items: T[], times: number): T[] {
  return Array(times).fill(items).flat()
}

function createWorkout(week: number, day: number, intervals: Interval[]): Workout {
  const allIntervals = [WARMUP, ...intervals, COOLDOWN]
  return {
    week,
    day,
    intervals: allIntervals,
    totalDuration: allIntervals.reduce((sum, i) => sum + i.duration, 0)
  }
}

// Week 1: 60s run / 90s walk × 8
const week1Intervals = repeat([run(60), walk(90)], 8)

// Week 2: 90s run / 2min walk × 6
const week2Intervals = repeat([run(90), walk(120)], 6)

// Week 3: 90s run, 90s walk, 3min run, 3min walk × 2
const week3Intervals = repeat([run(90), walk(90), run(180), walk(180)], 2)

// Week 4: 3min run, 90s walk, 5min run, 2.5min walk, 3min run, 90s walk, 5min run
const week4Intervals = [
  run(180), walk(90), run(300), walk(150), run(180), walk(90), run(300)
]

// Week 5
const week5Day1 = [run(300), walk(180), run(300), walk(180), run(300)]
const week5Day2 = [run(480), walk(300), run(480)]
const week5Day3 = [run(1200)] // 20 min

// Week 6
const week6Day1 = [run(300), walk(180), run(480), walk(180), run(300)]
const week6Day2 = [run(600), walk(180), run(600)]
const week6Day3 = [run(1500)] // 25 min

// Week 7: 25min run × 3
const week7Intervals = [run(1500)]

// Week 8: 28min run × 3
const week8Intervals = [run(1680)]

// Week 9: 30min run × 3
const week9Intervals = [run(1800)]

export const C25K_PROGRAM: Workout[] = [
  // Week 1
  createWorkout(1, 1, week1Intervals),
  createWorkout(1, 2, week1Intervals),
  createWorkout(1, 3, week1Intervals),
  // Week 2
  createWorkout(2, 1, week2Intervals),
  createWorkout(2, 2, week2Intervals),
  createWorkout(2, 3, week2Intervals),
  // Week 3
  createWorkout(3, 1, week3Intervals),
  createWorkout(3, 2, week3Intervals),
  createWorkout(3, 3, week3Intervals),
  // Week 4
  createWorkout(4, 1, week4Intervals),
  createWorkout(4, 2, week4Intervals),
  createWorkout(4, 3, week4Intervals),
  // Week 5
  createWorkout(5, 1, week5Day1),
  createWorkout(5, 2, week5Day2),
  createWorkout(5, 3, week5Day3),
  // Week 6
  createWorkout(6, 1, week6Day1),
  createWorkout(6, 2, week6Day2),
  createWorkout(6, 3, week6Day3),
  // Week 7
  createWorkout(7, 1, week7Intervals),
  createWorkout(7, 2, week7Intervals),
  createWorkout(7, 3, week7Intervals),
  // Week 8
  createWorkout(8, 1, week8Intervals),
  createWorkout(8, 2, week8Intervals),
  createWorkout(8, 3, week8Intervals),
  // Week 9
  createWorkout(9, 1, week9Intervals),
  createWorkout(9, 2, week9Intervals),
  createWorkout(9, 3, week9Intervals),
]

export function getWorkout(week: number, day: number): Workout | undefined {
  return C25K_PROGRAM.find(w => w.week === week && w.day === day)
}

export function getWorkoutIndex(week: number, day: number): number {
  return C25K_PROGRAM.findIndex(w => w.week === week && w.day === day)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (secs === 0) return `${mins}:00`
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDurationLong(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins} min`
  return `${mins}m ${secs}s`
}

export function getIntervalLabel(type: string): string {
  switch (type) {
    case 'warmup': return 'Warm Up'
    case 'run': return 'Run'
    case 'walk': return 'Walk'
    case 'cooldown': return 'Cool Down'
    default: return type
  }
}
