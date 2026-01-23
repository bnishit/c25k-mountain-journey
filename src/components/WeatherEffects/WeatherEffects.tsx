import type { EnvironmentTheme } from '../../contexts/EnvironmentContext'
import { SnowParticles } from './SnowParticles'
import { FloatingClouds } from './FloatingClouds'
import { MistLayer } from './MistLayer'
import { Starfield } from './Starfield'
import { SunRays } from './SunRays'

interface WeatherEffectsProps {
  theme: EnvironmentTheme
  className?: string
}

export function WeatherEffects({ theme, className = '' }: WeatherEffectsProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Background effects (behind everything) */}
      <Starfield visibility={theme.starVisibility} />
      <SunRays intensity={theme.sunRayIntensity} />

      {/* Mid-level effects */}
      <FloatingClouds density={theme.cloudDensity} />

      {/* Foreground effects */}
      <MistLayer opacity={theme.mistOpacity} />
      <SnowParticles intensity={theme.snowIntensity} />
    </div>
  )
}

export { SnowParticles } from './SnowParticles'
export { FloatingClouds } from './FloatingClouds'
export { MistLayer } from './MistLayer'
export { Starfield } from './Starfield'
export { SunRays } from './SunRays'
