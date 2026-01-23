import { useEffect, useState, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  color: string
  rotation: number
  scale: number
  duration: number
  drift: number
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']

// Reduced from 50 to 20 particles for better performance
const PARTICLE_COUNT = 20

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + (i * 80 / count) + (i % 2 ? 5 : -5), // Spread across screen
    color: COLORS[i % COLORS.length],
    rotation: (i * 30) % 360,
    scale: 0.6 + (i % 3) * 0.2,
    duration: 2.5 + (i % 4) * 0.3,
    drift: (i % 2 ? 1 : -1) * (20 + (i % 3) * 15),
  }))
}

export const Confetti = memo(function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  // Pre-compute particles once
  const staticParticles = useMemo(() => createParticles(PARTICLE_COUNT), [])

  useEffect(() => {
    if (show) {
      setParticles(staticParticles)
      const timer = setTimeout(() => setParticles([]), 3000)
      return () => clearTimeout(timer)
    } else {
      setParticles([])
    }
  }, [show, staticParticles])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${particle.x}%`,
              backgroundColor: particle.color,
            }}
            initial={{
              y: -20,
              rotate: 0,
              scale: particle.scale,
              opacity: 1,
            }}
            animate={{
              y: '100vh',
              rotate: particle.rotation + 720,
              x: particle.drift,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
})

// Success rings animation
export function SuccessRings({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-4 border-emerald-400"
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 300 + ring * 100,
            height: 300 + ring * 100,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            delay: ring * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
