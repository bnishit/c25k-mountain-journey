import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMotivationalMessage, getTimeOfDayMessage } from '../data/story'

interface MessageCardProps {
  week: number
  day: number
  completedWorkouts: number
}

export function MessageCard({ week, day, completedWorkouts }: MessageCardProps) {
  const [messageType, setMessageType] = useState<'future' | 'present'>('future')
  const [messages, setMessages] = useState(() => getMotivationalMessage(week, day, completedWorkouts))

  // Rotate between message types every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageType(prev => prev === 'future' ? 'present' : 'future')
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Update messages when week/day changes
  useEffect(() => {
    setMessages(getMotivationalMessage(week, day, completedWorkouts))
  }, [week, day, completedWorkouts])

  const currentMessage = messageType === 'future'
    ? messages.futureVision
    : messages.presentAcknowledgment

  return (
    <div className="glass-card p-4 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{
          background: messageType === 'future'
            ? 'linear-gradient(90deg, #f97316, #fb923c)'
            : 'linear-gradient(90deg, #2dd4bf, #5eead4)'
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={messageType + currentMessage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="pr-6"
        >
          {/* Main message */}
          <p className="text-body text-sm leading-relaxed text-[var(--text-secondary)]">
            {currentMessage}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Message type indicator dots */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-1">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            messageType === 'future' ? 'bg-[#f97316]' : 'bg-[var(--text-muted)]/30'
          }`}
        />
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            messageType === 'present' ? 'bg-[#2dd4bf]' : 'bg-[var(--text-muted)]/30'
          }`}
        />
      </div>
    </div>
  )
}

// Time-based greeting
export function TimeGreeting() {
  const message = getTimeOfDayMessage()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="text-center mb-6">
      <p className="text-[var(--text-muted)] text-sm">{greeting}</p>
      <p className="text-[var(--text-secondary)] mt-1">{message}</p>
    </div>
  )
}
