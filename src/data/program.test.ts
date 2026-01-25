import { describe, it, expect } from 'vitest'
import {
  C25K_PROGRAM,
  getWorkout,
  getWorkoutIndex,
  formatDuration,
  formatDurationLong,
  getIntervalLabel
} from './program'

describe('C25K_PROGRAM', () => {
  it('should contain exactly 27 workouts (9 weeks × 3 days)', () => {
    expect(C25K_PROGRAM).toHaveLength(27)
  })

  it('should have all weeks from 1-9', () => {
    const weeks = new Set(C25K_PROGRAM.map(w => w.week))
    expect(weeks.size).toBe(9)
    for (let week = 1; week <= 9; week++) {
      expect(weeks.has(week)).toBe(true)
    }
  })

  it('should have days 1-3 for each week', () => {
    for (let week = 1; week <= 9; week++) {
      const weekWorkouts = C25K_PROGRAM.filter(w => w.week === week)
      expect(weekWorkouts).toHaveLength(3)
      const days = weekWorkouts.map(w => w.day).sort()
      expect(days).toEqual([1, 2, 3])
    }
  })

  it('should have warmup as first interval for all workouts', () => {
    C25K_PROGRAM.forEach(workout => {
      expect(workout.intervals[0].type).toBe('warmup')
    })
  })

  it('should have cooldown as last interval for all workouts', () => {
    C25K_PROGRAM.forEach(workout => {
      expect(workout.intervals[workout.intervals.length - 1].type).toBe('cooldown')
    })
  })

  it('should have warmup duration of 300 seconds (5 min)', () => {
    C25K_PROGRAM.forEach(workout => {
      expect(workout.intervals[0].duration).toBe(300)
    })
  })

  it('should have cooldown duration of 300 seconds (5 min)', () => {
    C25K_PROGRAM.forEach(workout => {
      expect(workout.intervals[workout.intervals.length - 1].duration).toBe(300)
    })
  })

  it('should have totalDuration matching sum of intervals', () => {
    C25K_PROGRAM.forEach(workout => {
      const calculatedTotal = workout.intervals.reduce((sum, i) => sum + i.duration, 0)
      expect(workout.totalDuration).toBe(calculatedTotal)
    })
  })

  it('should have valid interval types only', () => {
    const validTypes = ['warmup', 'run', 'walk', 'cooldown']
    C25K_PROGRAM.forEach(workout => {
      workout.intervals.forEach(interval => {
        expect(validTypes).toContain(interval.type)
      })
    })
  })

  it('should have positive durations for all intervals', () => {
    C25K_PROGRAM.forEach(workout => {
      workout.intervals.forEach(interval => {
        expect(interval.duration).toBeGreaterThan(0)
      })
    })
  })

  describe('program progression', () => {
    it('should have week 1 with 60s run intervals', () => {
      const week1 = C25K_PROGRAM.filter(w => w.week === 1)
      week1.forEach(workout => {
        const runIntervals = workout.intervals.filter(i => i.type === 'run')
        runIntervals.forEach(interval => {
          expect(interval.duration).toBe(60)
        })
      })
    })

    it('should have week 9 workouts with 30-minute (1800s) runs', () => {
      const week9 = C25K_PROGRAM.filter(w => w.week === 9)
      week9.forEach(workout => {
        const runIntervals = workout.intervals.filter(i => i.type === 'run')
        expect(runIntervals).toHaveLength(1)
        expect(runIntervals[0].duration).toBe(1800)
      })
    })

    it('should have week 5 day 3 as first 20-minute continuous run', () => {
      const workout = getWorkout(5, 3)!
      const runIntervals = workout.intervals.filter(i => i.type === 'run')
      expect(runIntervals).toHaveLength(1)
      expect(runIntervals[0].duration).toBe(1200) // 20 min
    })
  })
})

describe('getWorkout', () => {
  it('should return correct workout for given week and day', () => {
    const workout = getWorkout(1, 1)

    expect(workout).toBeDefined()
    expect(workout!.week).toBe(1)
    expect(workout!.day).toBe(1)
  })

  it('should return undefined for invalid week', () => {
    expect(getWorkout(0, 1)).toBeUndefined()
    expect(getWorkout(10, 1)).toBeUndefined()
  })

  it('should return undefined for invalid day', () => {
    expect(getWorkout(1, 0)).toBeUndefined()
    expect(getWorkout(1, 4)).toBeUndefined()
  })

  it('should return correct workout for last day of program', () => {
    const workout = getWorkout(9, 3)

    expect(workout).toBeDefined()
    expect(workout!.week).toBe(9)
    expect(workout!.day).toBe(3)
  })
})

describe('getWorkoutIndex', () => {
  it('should return 0 for first workout (week 1, day 1)', () => {
    expect(getWorkoutIndex(1, 1)).toBe(0)
  })

  it('should return correct index for week 1, day 3', () => {
    expect(getWorkoutIndex(1, 3)).toBe(2)
  })

  it('should return correct index for week 2, day 1', () => {
    expect(getWorkoutIndex(2, 1)).toBe(3)
  })

  it('should return 26 for last workout (week 9, day 3)', () => {
    expect(getWorkoutIndex(9, 3)).toBe(26)
  })

  it('should return -1 for invalid workout', () => {
    expect(getWorkoutIndex(0, 1)).toBe(-1)
    expect(getWorkoutIndex(10, 1)).toBe(-1)
    expect(getWorkoutIndex(1, 4)).toBe(-1)
  })
})

describe('formatDuration', () => {
  it('should format 60 seconds as "1:00"', () => {
    expect(formatDuration(60)).toBe('1:00')
  })

  it('should format 90 seconds as "1:30"', () => {
    expect(formatDuration(90)).toBe('1:30')
  })

  it('should format 300 seconds as "5:00"', () => {
    expect(formatDuration(300)).toBe('5:00')
  })

  it('should format 65 seconds as "1:05"', () => {
    expect(formatDuration(65)).toBe('1:05')
  })

  it('should format 0 seconds as "0:00"', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('should pad single digit seconds with leading zero', () => {
    expect(formatDuration(61)).toBe('1:01')
    expect(formatDuration(69)).toBe('1:09')
  })

  it('should handle large durations', () => {
    expect(formatDuration(1800)).toBe('30:00')
    expect(formatDuration(3600)).toBe('60:00')
  })
})

describe('formatDurationLong', () => {
  it('should format 30 seconds as "30s"', () => {
    expect(formatDurationLong(30)).toBe('30s')
  })

  it('should format 60 seconds as "1 min"', () => {
    expect(formatDurationLong(60)).toBe('1 min')
  })

  it('should format 90 seconds as "1m 30s"', () => {
    expect(formatDurationLong(90)).toBe('1m 30s')
  })

  it('should format 300 seconds as "5 min"', () => {
    expect(formatDurationLong(300)).toBe('5 min')
  })

  it('should format seconds only for values less than 60', () => {
    expect(formatDurationLong(45)).toBe('45s')
    expect(formatDurationLong(1)).toBe('1s')
  })

  it('should handle large durations', () => {
    expect(formatDurationLong(1800)).toBe('30 min')
    expect(formatDurationLong(1830)).toBe('30m 30s')
  })
})

describe('getIntervalLabel', () => {
  it('should return "Warm Up" for warmup type', () => {
    expect(getIntervalLabel('warmup')).toBe('Warm Up')
  })

  it('should return "Run" for run type', () => {
    expect(getIntervalLabel('run')).toBe('Run')
  })

  it('should return "Walk" for walk type', () => {
    expect(getIntervalLabel('walk')).toBe('Walk')
  })

  it('should return "Cool Down" for cooldown type', () => {
    expect(getIntervalLabel('cooldown')).toBe('Cool Down')
  })

  it('should return the type itself for unknown types', () => {
    expect(getIntervalLabel('jog')).toBe('jog')
    expect(getIntervalLabel('sprint')).toBe('sprint')
  })
})
