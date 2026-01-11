import { motion } from 'framer-motion'
import type { View } from '../types'

interface NavigationProps {
  currentView: View
  onNavigate: (view: View) => void
}

const tabs: { view: View; label: string; icon: React.ReactNode }[] = [
  {
    view: 'today',
    label: 'Today',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
      </svg>
    ),
  },
  {
    view: 'journey',
    label: 'Journey',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    view: 'schedule',
    label: 'Plan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    view: 'history',
    label: 'History',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
]

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  if (currentView === 'run') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 px-5 pb-safe z-50">
      <div
        className="mx-auto max-w-md flex items-center justify-around h-[72px] px-2 rounded-2xl mb-2"
        style={{
          background: 'rgba(24, 24, 27, 0.85)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
        }}
      >
        {tabs.map(({ view, label, icon }) => {
          const isActive = currentView === view
          return (
            <motion.button
              key={view}
              onClick={() => onNavigate(view)}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 inset-y-1 rounded-xl"
                  style={{ background: 'rgba(249, 115, 22, 0.15)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className="relative z-10 transition-colors duration-200"
                style={{ color: isActive ? '#f97316' : 'rgba(250,250,250,0.4)' }}
              >
                {icon}
              </span>
              <span
                className="relative z-10 text-[11px] font-semibold transition-colors duration-200"
                style={{ color: isActive ? '#f97316' : 'rgba(250,250,250,0.4)' }}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
