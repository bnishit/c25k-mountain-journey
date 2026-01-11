import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }))
}

export function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (show) {
      setParticles(createParticles(50))
      const timer = setTimeout(() => setParticles([]), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

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
              y: window.innerHeight + 50,
              rotate: particle.rotation + 720,
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + Math.random(),
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

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
