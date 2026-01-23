import { memo, useMemo } from 'react'
import type { EnvironmentTheme } from '../../contexts/EnvironmentContext'

interface MainMountainProps {
  theme: EnvironmentTheme
  width?: number
  height?: number
}

// Memoized path generator to avoid recalculations
function generatePaths(width: number, height: number) {
  const mainMountainPath = `
    M 0 ${height}
    L 0 ${height * 0.7}
    L ${width * 0.08} ${height * 0.55}
    L ${width * 0.15} ${height * 0.6}
    L ${width * 0.22} ${height * 0.45}
    L ${width * 0.28} ${height * 0.5}
    L ${width * 0.35} ${height * 0.35}
    L ${width * 0.42} ${height * 0.25}
    L ${width * 0.48} ${height * 0.15}
    L ${width * 0.52} ${height * 0.08}
    L ${width * 0.56} ${height * 0.15}
    L ${width * 0.62} ${height * 0.22}
    L ${width * 0.68} ${height * 0.18}
    L ${width * 0.72} ${height * 0.25}
    L ${width * 0.78} ${height * 0.35}
    L ${width * 0.85} ${height * 0.45}
    L ${width * 0.92} ${height * 0.55}
    L ${width} ${height * 0.65}
    L ${width} ${height}
    Z
  `

  const snowCapPath = `
    M ${width * 0.35} ${height * 0.35}
    L ${width * 0.42} ${height * 0.25}
    L ${width * 0.48} ${height * 0.15}
    L ${width * 0.52} ${height * 0.08}
    L ${width * 0.56} ${height * 0.15}
    L ${width * 0.62} ${height * 0.22}
    L ${width * 0.68} ${height * 0.18}
    L ${width * 0.72} ${height * 0.25}
    L ${width * 0.78} ${height * 0.35}
    L ${width * 0.70} ${height * 0.38}
    L ${width * 0.60} ${height * 0.32}
    L ${width * 0.50} ${height * 0.35}
    L ${width * 0.40} ${height * 0.38}
    Z
  `

  const distantMountainPath = `
    M 0 ${height}
    L ${width * 0.1} ${height * 0.75}
    L ${width * 0.25} ${height * 0.55}
    L ${width * 0.35} ${height * 0.65}
    L ${width * 0.5} ${height * 0.7}
    L ${width * 0.6} ${height * 0.6}
    L ${width * 0.7} ${height * 0.5}
    L ${width * 0.8} ${height * 0.55}
    L ${width * 0.9} ${height * 0.65}
    L ${width} ${height * 0.7}
    L ${width} ${height}
    Z
  `

  const ridgePath = `M ${width * 0.42} ${height * 0.25} L ${width * 0.52} ${height * 0.08} L ${width * 0.62} ${height * 0.22}`

  return { mainMountainPath, snowCapPath, distantMountainPath, ridgePath }
}

export const MainMountain = memo(function MainMountain({ theme, width = 400, height = 300 }: MainMountainProps) {
  // Memoize path calculations - only recalculate when dimensions change
  const paths = useMemo(() => generatePaths(width, height), [width, height])

  const snowOpacity = theme.snowIntensity > 0 ? Math.min(1, theme.snowIntensity * 2) : 0

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute bottom-0 left-0 right-0"
      style={{ width: '100%', height: 'auto' }}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        {/* Mountain gradient */}
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.mountainColor} stopOpacity="1" />
          <stop offset="100%" stopColor={theme.mountainColor} stopOpacity="0.8" />
        </linearGradient>

        {/* Snow gradient */}
        <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#e8e8e8" stopOpacity="0.9" />
        </linearGradient>

        {/* Distant mountain gradient (more faded) */}
        <linearGradient id="distantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.mountainColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.mountainColor} stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Distant background mountain - static, no animation */}
      <path
        d={paths.distantMountainPath}
        fill="url(#distantGradient)"
      />

      {/* Main mountain - static, no animation */}
      <path
        d={paths.mainMountainPath}
        fill="url(#mountainGradient)"
      />

      {/* Snow cap (only visible at higher elevations) */}
      {snowOpacity > 0 && (
        <path
          d={paths.snowCapPath}
          fill="url(#snowGradient)"
          opacity={snowOpacity}
        />
      )}

      {/* Ridge highlights - static */}
      <path
        d={paths.ridgePath}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
      />
    </svg>
  )
})
