import { motion } from 'framer-motion'
import type { EnvironmentTheme } from '../../contexts/EnvironmentContext'

interface SkyLayerProps {
  theme: EnvironmentTheme
}

export function SkyLayer({ theme }: SkyLayerProps) {
  const [topColor, bottomColor] = theme.skyGradient

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Main sky gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Subtle animated gradient overlay for "living sky" effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sun rays for warm/cool temperatures */}
      {theme.sunRayIntensity > 0 && (
        <motion.div
          className="absolute top-0 right-0 w-64 h-64"
          style={{
            background: `radial-gradient(circle at 100% 0%, rgba(255, 200, 100, ${theme.sunRayIntensity * 0.4}) 0%, transparent 60%)`,
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Horizon glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${theme.temperature === 'warm' ? 'rgba(255,150,100,0.2)' : 'rgba(200,220,255,0.15)'} 100%)`,
        }}
      />
    </motion.div>
  )
}
