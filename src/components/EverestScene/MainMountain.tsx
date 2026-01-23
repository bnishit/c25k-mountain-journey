import { motion } from 'framer-motion'
import type { EnvironmentTheme } from '../../contexts/EnvironmentContext'

interface MainMountainProps {
  theme: EnvironmentTheme
  width?: number
  height?: number
}

export function MainMountain({ theme, width = 400, height = 300 }: MainMountainProps) {
  // Everest-inspired mountain silhouette path
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

  // Snow cap path (upper portion of mountain)
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

  // Background mountain (distant peak)
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

        {/* Shadow for depth */}
        <filter id="mountainShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="black" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Distant background mountain */}
      <motion.path
        d={distantMountainPath}
        fill="url(#distantGradient)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Main mountain */}
      <motion.path
        d={mainMountainPath}
        fill="url(#mountainGradient)"
        filter="url(#mountainShadow)"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      {/* Snow cap (only visible at higher elevations) */}
      {theme.snowIntensity > 0 && (
        <motion.path
          d={snowCapPath}
          fill="url(#snowGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(1, theme.snowIntensity * 2) }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      )}

      {/* Ridge highlights */}
      <motion.path
        d={`M ${width * 0.42} ${height * 0.25} L ${width * 0.52} ${height * 0.08} L ${width * 0.62} ${height * 0.22}`}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      />
    </svg>
  )
}
