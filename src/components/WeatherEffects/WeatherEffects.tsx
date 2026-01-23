import { memo } from 'react'
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

// Only render weather effects when they have meaningful values (> 0.05 threshold)
export const WeatherEffects = memo(function WeatherEffects({ theme, className = '' }: WeatherEffectsProps) {
  const hasStars = theme.starVisibility > 0.05
  const hasSun = theme.sunRayIntensity > 0.05
  const hasClouds = theme.cloudDensity > 0.05
  const hasMist = theme.mistOpacity > 0.05
  const hasSnow = theme.snowIntensity > 0.05

  // Early return if no effects needed
  if (!hasStars && !hasSun && !hasClouds && !hasMist && !hasSnow) {
    return null
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Only render effects that are actually visible */}
      {hasStars && <Starfield visibility={theme.starVisibility} />}
      {hasSun && <SunRays intensity={theme.sunRayIntensity} />}
      {hasClouds && <FloatingClouds density={theme.cloudDensity} />}
      {hasMist && <MistLayer opacity={theme.mistOpacity} />}
      {hasSnow && <SnowParticles intensity={theme.snowIntensity} />}
    </div>
  )
})

export { SnowParticles } from './SnowParticles'
export { FloatingClouds } from './FloatingClouds'
export { MistLayer } from './MistLayer'
export { Starfield } from './Starfield'
export { SunRays } from './SunRays'
