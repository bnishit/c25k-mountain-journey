import { motion } from 'framer-motion'

interface SunRaysProps {
  intensity: number // 0-1
  className?: string
}

export function SunRays({ intensity, className = '' }: SunRaysProps) {
  if (intensity <= 0) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Main sun glow */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64"
        style={{
          background: `radial-gradient(circle at center, rgba(255,200,100,${intensity * 0.6}) 0%, rgba(255,150,50,${intensity * 0.3}) 30%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [intensity * 0.8, intensity, intensity * 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sun rays */}
      <svg
        className="absolute -top-10 -right-10 w-80 h-80"
        viewBox="0 0 200 200"
        style={{ opacity: intensity * 0.4 }}
      >
        <defs>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,200,100,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <motion.line
            key={angle}
            x1="100"
            y1="100"
            x2="200"
            y2="100"
            stroke="url(#rayGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 100)`}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              delay: angle / 60,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Warm atmosphere overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(255,200,100,${intensity * 0.1}) 0%, transparent 50%)`,
        }}
      />

      {/* Lens flare dots */}
      {intensity > 0.4 && (
        <>
          <motion.div
            className="absolute top-16 right-24 w-3 h-3 rounded-full"
            style={{
              background: `rgba(255,220,150,${intensity * 0.5})`,
              filter: 'blur(1px)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-28 right-32 w-2 h-2 rounded-full"
            style={{
              background: `rgba(255,180,100,${intensity * 0.4})`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2.5,
              delay: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </div>
  )
}
