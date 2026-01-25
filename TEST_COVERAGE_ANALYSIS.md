# Test Coverage Analysis

## Executive Summary

**Current Test Coverage: 0%**

This codebase has **no testing infrastructure whatsoever**. There are no testing frameworks installed, no test configuration files, and no test files. This is a significant risk for a fitness application where incorrect timer logic or data persistence bugs could impact user experience.

---

## Current State

| Metric | Value |
|--------|-------|
| Test Framework | None |
| Test Files | 0 |
| Code Coverage | 0% |
| Total Source Files | 38 |
| Total Lines of Code | ~4,261 |

---

## Recommended Testing Stack

Since the project uses Vite + React + TypeScript, I recommend:

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0",
    "msw": "^2.0.0"
  }
}
```

---

## Priority Areas for Test Coverage

### 1. HIGH PRIORITY: Storage Utilities (`src/utils/storage.ts`)

**Risk Level: Critical**

This module handles all user progress persistence. Bugs here could cause data loss.

**Functions requiring tests:**

| Function | Lines | Test Cases Needed |
|----------|-------|-------------------|
| `loadState()` | 18-32 | 5+ |
| `saveState()` | 34-36 | 2 |
| `completeWorkout()` | 38-74 | 8+ |
| `isWorkoutCompleted()` | 76-82 | 3 |
| `resetProgress()` | 84-87 | 2 |
| `updateSpeedSettings()` | 89-99 | 3 |

**Specific test cases for `storage.ts`:**

```typescript
// loadState() tests
describe('loadState', () => {
  it('should return default state when localStorage is empty')
  it('should parse and return saved state from localStorage')
  it('should handle malformed JSON gracefully and return default state')
  it('should migrate old data without speedSettings')
  it('should preserve existing speedSettings during migration')
})

// completeWorkout() tests
describe('completeWorkout', () => {
  it('should advance from day 1 to day 2 within the same week')
  it('should advance from day 3 to day 1 of next week')
  it('should cap progress at week 9 day 3 (program end)')
  it('should add completed workout to history')
  it('should set startDate on first workout completion')
  it('should not overwrite existing startDate')
  it('should persist state to localStorage')
  it('should record accurate actualDuration')
})

// isWorkoutCompleted() tests
describe('isWorkoutCompleted', () => {
  it('should return true for completed workouts')
  it('should return false for uncompleted workouts')
  it('should handle empty completion history')
})
```

---

### 2. HIGH PRIORITY: Program Data (`src/data/program.ts`)

**Risk Level: High**

This defines the entire 9-week C25K workout program. Incorrect interval durations would break the core functionality.

**Functions requiring tests:**

| Function | Lines | Test Cases Needed |
|----------|-------|-------------------|
| `getWorkout()` | 100-102 | 4 |
| `getWorkoutIndex()` | 104-106 | 4 |
| `formatDuration()` | 108-113 | 5 |
| `formatDurationLong()` | 115-121 | 6 |
| `getIntervalLabel()` | 123-131 | 5 |
| Program data validation | - | 10+ |

**Specific test cases for `program.ts`:**

```typescript
// Program data validation
describe('C25K_PROGRAM', () => {
  it('should contain exactly 27 workouts (9 weeks × 3 days)')
  it('should have all weeks from 1-9')
  it('should have days 1-3 for each week')
  it('should have warmup as first interval for all workouts')
  it('should have cooldown as last interval for all workouts')
  it('should have warmup duration of 300 seconds (5 min)')
  it('should have cooldown duration of 300 seconds (5 min)')
  it('should have totalDuration matching sum of intervals')
  it('should have progressively longer run intervals through weeks')
  it('should have week 9 workouts with 30-minute runs')
})

// formatDuration() tests
describe('formatDuration', () => {
  it('should format 60 seconds as "1:00"')
  it('should format 90 seconds as "1:30"')
  it('should format 300 seconds as "5:00"')
  it('should format 65 seconds as "1:05"')
  it('should format 0 seconds as "0:00"')
})

// formatDurationLong() tests
describe('formatDurationLong', () => {
  it('should format 30 seconds as "30s"')
  it('should format 60 seconds as "1 min"')
  it('should format 90 seconds as "1m 30s"')
  it('should format 300 seconds as "5 min"')
})
```

---

### 3. HIGH PRIORITY: Timer Hook (`src/hooks/useTimer.ts`)

**Risk Level: Critical**

The most complex hook in the application. Controls workout timing, interval transitions, and callbacks.

**Logic requiring tests:**

| Feature | Lines | Test Cases Needed |
|---------|-------|-------------------|
| Timer start/pause/resume | 128-143 | 6 |
| Timer stop and reset | 145-156 | 3 |
| Interval transitions | 89-118 | 5 |
| Countdown announcements (10s, 30s) | 72-74 | 4 |
| Halfway point detection | 77-87 | 4 |
| Skip to next interval | 158-194 | 5 |
| Workout completion | 94-104 | 3 |
| Progress calculations | 214-217 | 4 |

**Specific test cases for `useTimer.ts`:**

```typescript
describe('useTimer', () => {
  // Basic timer operations
  describe('timer controls', () => {
    it('should start timer and set isRunning to true')
    it('should pause timer and set isPaused to true')
    it('should resume timer and set isPaused to false')
    it('should stop timer and reset all state')
    it('should call onIntervalChange when starting')
  })

  // Interval transitions
  describe('interval transitions', () => {
    it('should decrement intervalTimeRemaining each tick')
    it('should move to next interval when current ends')
    it('should call onIntervalChange on transition')
    it('should complete workout after last interval')
    it('should call onComplete callback when workout ends')
  })

  // Countdown announcements
  describe('countdown announcements', () => {
    it('should call onCountdown at 30 seconds remaining')
    it('should call onCountdown at 10 seconds remaining')
    it('should not call onCountdown at other times')
  })

  // Halfway detection
  describe('halfway announcements', () => {
    it('should call onHalfway at midpoint for intervals >= 2 min')
    it('should not call onHalfway for intervals < 2 min')
    it('should only announce halfway once per interval')
  })

  // Skip functionality
  describe('skipToNext', () => {
    it('should skip to next interval')
    it('should add skipped time to totalElapsed')
    it('should complete workout if on last interval')
    it('should do nothing if timer not running')
  })

  // Progress calculations
  describe('progress calculations', () => {
    it('should calculate overall progress as elapsed/total')
    it('should calculate interval progress correctly')
    it('should return 0 progress at start')
  })
})
```

---

### 4. MEDIUM PRIORITY: OpenAI TTS Service (`src/services/openaiTTS.ts`)

**Risk Level: Medium**

Handles audio caching and external API integration. Failures here degrade experience but don't break core functionality.

**Functions requiring tests:**

| Function | Test Cases Needed |
|----------|-------------------|
| `cacheAudio()` / `getCachedAudio()` | 4 |
| `isAudioCached()` | 3 |
| `generateAllAudio()` | 4 |
| `getRandomAudioKey()` | 3 |
| API key storage | 3 |
| Error handling | 4 |

**Test considerations:**
- Mock IndexedDB for cache tests
- Mock fetch for API tests
- Test error scenarios (network failures, invalid API keys)

---

### 5. MEDIUM PRIORITY: Progress Hook (`src/hooks/useProgress.ts`)

**Functions requiring tests:**

```typescript
describe('useProgress', () => {
  it('should load initial state from storage')
  it('should update state when completing workout')
  it('should persist changes to localStorage')
  it('should handle speed settings updates')
})
```

---

### 6. LOWER PRIORITY: React Components

Components are primarily presentational with Framer Motion animations. Recommended approach:

**Snapshot/Smoke Tests:**
- `Navigation.tsx` - Verify routing links render
- `Schedule.tsx` - Verify workout list renders correctly
- `History.tsx` - Verify completed workouts display

**Integration Tests:**
- `ActiveRun.tsx` - Test timer integration and UI state changes
- `Settings.tsx` - Test form interactions

**Skip for now:**
- Animation-heavy components (`EverestScene/`, `WeatherEffects/`)
- Pure display components with no logic

---

## Implementation Roadmap

### Phase 1: Setup & Critical Logic (Recommended First)
1. Install testing dependencies
2. Configure Vitest with jsdom
3. Add test scripts to package.json
4. Write tests for `storage.ts` (highest impact)
5. Write tests for `program.ts` (data validation)

### Phase 2: Timer Logic
1. Write tests for `useTimer.ts` (complex logic)
2. Write tests for `useProgress.ts`

### Phase 3: Services & Integration
1. Write tests for `openaiTTS.ts` with mocks
2. Write integration tests for key user flows

### Phase 4: Component Testing
1. Add React Testing Library
2. Write smoke tests for critical components
3. Add snapshot tests for UI stability

---

## Estimated Test Coverage Goals

| Phase | Target Coverage | Files Covered |
|-------|-----------------|---------------|
| Phase 1 | 25% | storage.ts, program.ts |
| Phase 2 | 45% | + useTimer.ts, useProgress.ts |
| Phase 3 | 60% | + openaiTTS.ts |
| Phase 4 | 75% | + key components |

---

## Configuration Files Needed

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
```

### `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock as unknown as Storage
```

### Package.json scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Conclusion

The lack of any testing infrastructure is a significant technical debt. The highest priority should be testing the core business logic:

1. **`storage.ts`** - User data persistence (risk of data loss)
2. **`program.ts`** - Workout definitions (risk of incorrect intervals)
3. **`useTimer.ts`** - Timer logic (risk of broken workouts)

These three files contain the most critical logic and should be tested before any major feature development continues.
