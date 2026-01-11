import { useCallback, useRef } from 'react'
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
  const soundEffects = useSoundEffects()

  const initVoice = useCallback(() => {
    if (!synth.current) {
      synth.current = window.speechSynthesis
    }

    if (!voiceRef.current) {
      const voices = synth.current.getVoices()

      // Prioritized voice list for best quality
      const preferredVoiceNames = [
        'Samantha (Enhanced)',
        'Samantha',
        'Karen (Enhanced)',
        'Karen',
        'Moira',
        'Daniel',
        'Rishi',
        'Tessa',
      ]

      for (const name of preferredVoiceNames) {
        const voice = voices.find(v => v.name.includes(name))
        if (voice) {
          voiceRef.current = voice
          break
        }
      }

      // Fallback to any English voice
      if (!voiceRef.current) {
        voiceRef.current = voices.find(v => v.lang.startsWith('en')) || null
      }
    }
  }, [])

  const speak = useCallback((text: string, rate: number = 0.85) => {
    initVoice()
    if (!synth.current) return

    // Cancel any ongoing speech
    synth.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = 1.0
    utterance.volume = 1

    if (voiceRef.current) {
      utterance.voice = voiceRef.current
    }

    synth.current.speak(utterance)
  }, [initVoice])

  const announceStart = useCallback((type: string) => {
    switch (type) {
      case 'warmup':
        soundEffects.playWarmupStart()
        setTimeout(() => speak(getRandomPhrase(WARMUP_PHRASES)), 200)
        break
      case 'run':
        soundEffects.playRunStart()
        setTimeout(() => speak(getRandomPhrase(RUN_PHRASES)), 300)
        break
      case 'walk':
        soundEffects.playWalkStart()
        setTimeout(() => speak(getRandomPhrase(WALK_PHRASES)), 300)
        break
      case 'cooldown':
        soundEffects.playWarmupStart()
        setTimeout(() => speak(getRandomPhrase(COOLDOWN_PHRASES)), 200)
        break
    }
  }, [speak, soundEffects])

  const announceCountdown = useCallback((seconds: number) => {
    if (seconds === 10) {
      soundEffects.playCountdownBeep(false)
      speak("Ten seconds left!")
    } else if (seconds === 5) {
      soundEffects.playCountdownBeep(true)
    } else if (seconds === 30) {
      speak("Thirty seconds remaining.")
    }
  }, [speak, soundEffects])

  const announceHalfway = useCallback(() => {
    soundEffects.playHalfway()
    setTimeout(() => speak(getRandomPhrase(HALFWAY_PHRASES)), 200)
  }, [speak, soundEffects])

  const announceComplete = useCallback(() => {
    soundEffects.playComplete()
    setTimeout(() => speak(getRandomPhrase(COMPLETE_PHRASES), 0.8), 800)
  }, [speak, soundEffects])

  const stop = useCallback(() => {
    if (synth.current) {
      synth.current.cancel()
    }
  }, [])

  return {
    speak,
    announceStart,
    announceCountdown,
    announceHalfway,
    announceComplete,
    stop
  }
}
