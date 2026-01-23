import { motion } from 'framer-motion'

interface MistLayerProps {
  opacity: number // 0-1
  className?: string
}

export function MistLayer({ opacity, className = '' }: MistLayerProps) {
  if (opacity <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Lower mist bank */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${opacity * 0.4}) 100%)`,
        }}
        animate={{
          opacity: [opacity * 0.6, opacity, opacity * 0.6],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mid-level mist wisps */}
      <motion.div
        className="absolute bottom-1/4 left-0 right-0 h-1/4"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 30% 100%, rgba(255,255,255,${opacity * 0.3}) 0%, transparent 70%)`,
        }}
        animate={{
          x: [-20, 20, -20],
          opacity: [opacity * 0.3, opacity * 0.5, opacity * 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Upper mist (for high altitude) */}
      {opacity > 0.3 && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/4"
          style={{
            background: `linear-gradient(0deg, transparent 0%, rgba(255,255,255,${opacity * 0.2}) 100%)`,
          }}
          animate={{
            opacity: [opacity * 0.2, opacity * 0.4, opacity * 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Floating mist patches */}
      <motion.div
        className="absolute"
        style={{
          width: '60%',
          height: '20%',
          bottom: '15%',
          left: '20%',
          background: `radial-gradient(ellipse at center, rgba(255,255,255,${opacity * 0.25}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          x: [-30, 30, -30],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
