import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type Temperature = 'warm' | 'cool' | 'cold' | 'freezing'

export interface EnvironmentTheme {
  // Camp identity
  week: number
  campName: string
  elevation: number

  // Color palette
  skyGradient: [string, string]  // [top, bottom]
  mountainColor: string
  accentColor: string

  // Temperature category
  temperature: Temperature

  // Effect intensities (0-1)
  snowIntensity: number
  cloudDensity: number
  starVisibility: number
  mistOpacity: number
  sunRayIntensity: number

  // Special elements
  hasVegetation: boolean
  hasPrayerFlags: boolean
  hasMonastery: boolean
}

const ENVIRONMENT_THEMES: Record<number, EnvironmentTheme> = {
  1: {
    week: 1,
    campName: 'Kathmandu',
    elevation: 1400,
    skyGradient: ['#ff9f43', '#74b9ff'],
    mountainColor: '#2d3436',
    accentColor: '#ff9f43',
    temperature: 'warm',
    snowIntensity: 0,
    cloudDensity: 0.3,
    starVisibility: 0,
    mistOpacity: 0.1,
    sunRayIntensity: 0.6,
    hasVegetation: true,
    hasPrayerFlags: false,
    hasMonastery: false,
  },
  2: {
    week: 2,
    campName: 'Lukla',
    elevation: 2860,
    skyGradient: ['#fdcb6e', '#74b9ff'],
    mountainColor: '#636e72',
    accentColor: '#fdcb6e',
    temperature: 'warm',
    snowIntensity: 0,
    cloudDensity: 0.4,
    starVisibility: 0,
    mistOpacity: 0.15,
    sunRayIntensity: 0.5,
    hasVegetation: true,
    hasPrayerFlags: false,
    hasMonastery: false,
  },
  3: {
    week: 3,
    campName: 'Namche Bazaar',
    elevation: 3440,
    skyGradient: ['#a29bfe', '#74b9ff'],
    mountainColor: '#636e72',
    accentColor: '#a29bfe',
    temperature: 'cool',
    snowIntensity: 0,
    cloudDensity: 0.5,
    starVisibility: 0.1,
    mistOpacity: 0.2,
    sunRayIntensity: 0.3,
    hasVegetation: true,
    hasPrayerFlags: true,
    hasMonastery: false,
  },
  4: {
    week: 4,
    campName: 'Tengboche',
    elevation: 3867,
    skyGradient: ['#a29bfe', '#6c5ce7'],
    mountainColor: '#b2bec3',
    accentColor: '#6c5ce7',
    temperature: 'cool',
    snowIntensity: 0.1,
    cloudDensity: 0.4,
    starVisibility: 0.2,
    mistOpacity: 0.25,
    sunRayIntensity: 0.2,
    hasVegetation: false,
    hasPrayerFlags: true,
    hasMonastery: true,
  },
  5: {
    week: 5,
    campName: 'Dingboche',
    elevation: 4410,
    skyGradient: ['#74b9ff', '#0984e3'],
    mountainColor: '#b2bec3',
    accentColor: '#0984e3',
    temperature: 'cold',
    snowIntensity: 0.2,
    cloudDensity: 0.3,
    starVisibility: 0.4,
    mistOpacity: 0.3,
    sunRayIntensity: 0.1,
    hasVegetation: false,
    hasPrayerFlags: true,
    hasMonastery: false,
  },
  6: {
    week: 6,
    campName: 'Lobuche',
    elevation: 4940,
    skyGradient: ['#74b9ff', '#2d3436'],
    mountainColor: '#dfe6e9',
    accentColor: '#74b9ff',
    temperature: 'cold',
    snowIntensity: 0.4,
    cloudDensity: 0.2,
    starVisibility: 0.6,
    mistOpacity: 0.35,
    sunRayIntensity: 0,
    hasVegetation: false,
    hasPrayerFlags: false,
    hasMonastery: false,
  },
  7: {
    week: 7,
    campName: 'Gorak Shep',
    elevation: 5164,
    skyGradient: ['#dfe6e9', '#2d3436'],
    mountainColor: '#ffffff',
    accentColor: '#dfe6e9',
    temperature: 'freezing',
    snowIntensity: 0.6,
    cloudDensity: 0.1,
    starVisibility: 0.8,
    mistOpacity: 0.4,
    sunRayIntensity: 0,
    hasVegetation: false,
    hasPrayerFlags: false,
    hasMonastery: false,
  },
  8: {
    week: 8,
    campName: 'Everest Base Camp',
    elevation: 5364,
    skyGradient: ['#dfe6e9', '#1e272e'],
    mountainColor: '#ffffff',
    accentColor: '#f97316',
    temperature: 'freezing',
    snowIntensity: 0.7,
    cloudDensity: 0.1,
    starVisibility: 0.9,
    mistOpacity: 0.45,
    sunRayIntensity: 0,
    hasVegetation: false,
    hasPrayerFlags: true,
    hasMonastery: false,
  },
  9: {
    week: 9,
    campName: 'Kala Patthar',
    elevation: 5545,
    skyGradient: ['#ffeaa7', '#2d3436'],
    mountainColor: '#ffffff',
    accentColor: '#ffeaa7',
    temperature: 'freezing',
    snowIntensity: 0.5,
    cloudDensity: 0,
    starVisibility: 1,
    mistOpacity: 0.3,
    sunRayIntensity: 0.4,
    hasVegetation: false,
    hasPrayerFlags: false,
    hasMonastery: false,
  },
}

interface EnvironmentContextValue {
  theme: EnvironmentTheme
  getThemeForWeek: (week: number) => EnvironmentTheme
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null)

interface EnvironmentProviderProps {
  week: number
  children: ReactNode
}

export function EnvironmentProvider({ week, children }: EnvironmentProviderProps) {
  const value = useMemo(() => {
    const clampedWeek = Math.max(1, Math.min(9, week))
    return {
      theme: ENVIRONMENT_THEMES[clampedWeek],
      getThemeForWeek: (w: number) => ENVIRONMENT_THEMES[Math.max(1, Math.min(9, w))],
    }
  }, [week])

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider')
  }
  return context
}

export function useEnvironmentTheme(week?: number) {
  const context = useContext(EnvironmentContext)
  if (!context) {
    // Return default theme if not in provider (for standalone use)
    const clampedWeek = Math.max(1, Math.min(9, week ?? 1))
    return ENVIRONMENT_THEMES[clampedWeek]
  }
  if (week !== undefined) {
    return context.getThemeForWeek(week)
  }
  return context.theme
}
