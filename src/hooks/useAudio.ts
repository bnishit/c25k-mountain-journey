import { useCallback, useRef, useEffect, useState } from 'react'
import { useSoundEffects } from './useSoundEffects'
import { VOICE_PHRASES } from '../data/story'

// Journey-themed phrase pools
const RUN_PHRASES = VOICE_PHRASES.run
const WALK_PHRASES = VOICE_PHRASES.walk
const WARMUP_PHRASES = VOICE_PHRASES.warmup
const COOLDOWN_PHRASES = VOICE_PHRASES.cooldown
const HALFWAY_PHRASES = VOICE_PHRASES.halfway
const COMPLETE_PHRASES = VOICE_PHRASES.complete

function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

export function useAudio() {
  const synth = useRef<SpeechSynthesis | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const soundEffects = useSoundEffects()

  // Initialize speech synthesis and wait for voices to load
  useEffect(() => {
    if (typeof window === 'undefined') return

    synth.current = window.speechSynthesis

    const loadVoices = () => {
      const voices = synth.current?.getVoices() || []
      if (voices.length === 0) return

      // Priority list for natural-sounding voices (iOS/macOS premium voices first)
      const priorityVoices = [
        // iOS/macOS premium voices (most natural)
        'Samantha (Premium)',
        'Ava (Premium)',
        'Zoe (Premium)',
        'Allison (Premium)',
        'Susan (Premium)',
        // iOS/macOS enhanced voices
        'Samantha (Enhanced)',
        'Ava (Enhanced)',
        'Karen (Enhanced)',
        'Moira (Enhanced)',
        // Standard good voices
        'Samantha',
        'Ava',
        'Karen',
        'Moira',
        'Tessa',
        'Fiona',
        // US English voices
        'Google US English',
        'Microsoft Zira',
        'Microsoft David',
      ]

      // Try to find best voice
      for (const voiceName of priorityVoices) {
        const found = voices.find(v =>
          v.name.includes(voiceName) || v.name === voiceName
        )
        if (found) {
          voiceRef.current = found
          console.log('Selected voice:', found.name)
          setVoicesLoaded(true)
          return
        }
      }

      // Fallback: find any high-quality English voice
      const englishVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Premium') || v.name.includes('Enhanced') || v.localService)
      ) || voices.find(v => v.lang.startsWith('en'))

      if (englishVoice) {
        voiceRef.current = englishVoice
        console.log('Fallback voice:', englishVoice.name)
      }
      setVoicesLoaded(true)
    }

    // Load voices immediately if available
    loadVoices()

    // Also listen for voiceschanged event (async loading)
    synth.current.addEventListener('voiceschanged', loadVoices)

    return () => {
      synth.current?.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const speak = useCallback((text: string, rate: number = 0.92) => {
    if (!synth.current) return

    // Cancel any ongoing speech
    synth.current.cancel()

    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)

      // More natural speech settings
      utterance.rate = rate
      utterance.pitch = 1.05 // Slightly higher pitch sounds more energetic
      utterance.volume = 1

      if (voiceRef.current) {
        utterance.voice = voiceRef.current
      }

      // Handle iOS Safari quirk - needs user interaction first
      synth.current?.speak(utterance)
    }, 50)
  }, [])

  const announceStart = useCallback((type: string) => {
    switch (type) {
      case 'warmup':
        soundEffects.playWarmupStart()
        setTimeout(() => speak(getRandomPhrase(WARMUP_PHRASES), 0.9), 250)
        break
      case 'run':
        soundEffects.playRunStart()
        setTimeout(() => speak(getRandomPhrase(RUN_PHRASES), 0.95), 350)
        break
      case 'walk':
        soundEffects.playWalkStart()
        setTimeout(() => speak(getRandomPhrase(WALK_PHRASES), 0.9), 350)
        break
      case 'cooldown':
        soundEffects.playWarmupStart()
        setTimeout(() => speak(getRandomPhrase(COOLDOWN_PHRASES), 0.88), 250)
        break
    }
  }, [speak, soundEffects])

  const announceCountdown = useCallback((seconds: number) => {
    if (seconds === 10) {
      soundEffects.playCountdownBeep(false)
      speak("Ten seconds!", 1.0)
    } else if (seconds === 5) {
      soundEffects.playCountdownBeep(true)
    } else if (seconds === 30) {
      speak("Thirty seconds.", 0.95)
    }
  }, [speak, soundEffects])

  const announceHalfway = useCallback(() => {
    soundEffects.playHalfway()
    setTimeout(() => speak(getRandomPhrase(HALFWAY_PHRASES), 0.92), 250)
  }, [speak, soundEffects])

  const announceComplete = useCallback(() => {
    soundEffects.playComplete()
    setTimeout(() => speak(getRandomPhrase(COMPLETE_PHRASES), 0.85), 900)
  }, [speak, soundEffects])

  const stop = useCallback(() => {
    synth.current?.cancel()
  }, [])

  return {
    speak,
    announceStart,
    announceCountdown,
    announceHalfway,
    announceComplete,
    stop,
    voicesLoaded
  }
}
