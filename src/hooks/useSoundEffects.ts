import { useCallback, useRef } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [getAudioContext])

  // Rising tone for "start running" - energizing
  const playRunStart = useCallback(() => {
    // Quick ascending arpeggio
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * 80)
    })
  }, [playTone])

  // Falling tone for "start walking" - relaxing
  const playWalkStart = useCallback(() => {
    // Gentle descending notes
    const notes = [523.25, 440, 392] // C5, A4, G4
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 100)
    })
  }, [playTone])

  // Warning beeps
  const playCountdownBeep = useCallback((urgent: boolean = false) => {
    if (urgent) {
      // Fast triple beep for 5 seconds
      [0, 100, 200].forEach(delay => {
        setTimeout(() => playTone(880, 0.08, 'square', 0.2), delay)
      })
    } else {
      // Single beep for 10 seconds
      playTone(660, 0.1, 'sine', 0.25)
    }
  }, [playTone])

  // Triumphant completion sound
  const playComplete = useCallback(() => {
    // Major chord arpeggio
    const notes = [
      { freq: 523.25, delay: 0 },      // C5
      { freq: 659.25, delay: 100 },    // E5
      { freq: 783.99, delay: 200 },    // G5
      { freq: 1046.50, delay: 300 },   // C6
    ]

    notes.forEach(({ freq, delay }) => {
      setTimeout(() => playTone(freq, 0.4, 'sine', 0.2), delay)
    })

    // Sustained chord
    setTimeout(() => {
      playTone(523.25, 0.8, 'sine', 0.15)
      playTone(659.25, 0.8, 'sine', 0.15)
      playTone(783.99, 0.8, 'sine', 0.15)
    }, 500)
  }, [playTone])

  // Warmup/cooldown gentle chime
  const playWarmupStart = useCallback(() => {
    playTone(440, 0.3, 'sine', 0.2) // A4
    setTimeout(() => playTone(523.25, 0.3, 'sine', 0.2), 150) // C5
  }, [playTone])

  // Halfway encouragement
  const playHalfway = useCallback(() => {
    playTone(587.33, 0.15, 'sine', 0.2) // D5
    setTimeout(() => playTone(659.25, 0.2, 'sine', 0.25), 120) // E5
  }, [playTone])

  return {
    playRunStart,
    playWalkStart,
    playCountdownBeep,
    playComplete,
    playWarmupStart,
    playHalfway
  }
}
