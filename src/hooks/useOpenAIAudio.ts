import { useCallback, useEffect, useState, useRef } from 'react'
import { useSoundEffects } from './useSoundEffects'
import {
  isAudioCached,
  playAudio,
  getRandomAudioKey,
  getStoredApiKey,
  type AudioKey,
} from '../services/openaiTTS'

export function useOpenAIAudio() {
  const [isReady, setIsReady] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const soundEffects = useSoundEffects()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check if audio is cached and API key exists
  useEffect(() => {
    const checkStatus = async () => {
      const apiKey = getStoredApiKey()
      setHasApiKey(!!apiKey)

      if (apiKey) {
        const cached = await isAudioCached()
        setIsReady(cached)
      }
    }
    checkStatus()
  }, [])

  // Play a specific audio key
  const play = useCallback(async (key: AudioKey) => {
    if (!isReady) {
      console.warn('Audio not ready')
      return
    }

    try {
      await playAudio(key)
    } catch (error) {
      console.error('Failed to play audio:', error)
    }
  }, [isReady])

  // Play random audio from a category
  const playRandom = useCallback(async (category: 'run' | 'walk' | 'warmup' | 'cooldown' | 'halfway' | 'complete') => {
    if (!isReady) return
    const key = getRandomAudioKey(category)
    await play(key)
  }, [isReady, play])

  // Announce interval start
  const announceStart = useCallback(async (type: string) => {
    switch (type) {
      case 'warmup':
        soundEffects.playWarmupStart()
        setTimeout(() => playRandom('warmup'), 250)
        break
      case 'run':
        soundEffects.playRunStart()
        setTimeout(() => playRandom('run'), 350)
        break
      case 'walk':
        soundEffects.playWalkStart()
        setTimeout(() => playRandom('walk'), 350)
        break
      case 'cooldown':
        soundEffects.playWarmupStart()
        setTimeout(() => playRandom('cooldown'), 250)
        break
    }
  }, [playRandom, soundEffects])

  // Announce countdown
  const announceCountdown = useCallback(async (seconds: number) => {
    if (seconds === 10) {
      soundEffects.playCountdownBeep(false)
      if (isReady) play('countdown_10')
    } else if (seconds === 5) {
      soundEffects.playCountdownBeep(true)
    } else if (seconds === 30) {
      if (isReady) play('countdown_30')
    }
  }, [isReady, play, soundEffects])

  // Announce halfway
  const announceHalfway = useCallback(async () => {
    soundEffects.playHalfway()
    setTimeout(() => playRandom('halfway'), 250)
  }, [playRandom, soundEffects])

  // Announce complete
  const announceComplete = useCallback(async () => {
    soundEffects.playComplete()
    setTimeout(() => playRandom('complete'), 900)
  }, [playRandom, soundEffects])

  // Stop any playing audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  return {
    isReady,
    hasApiKey,
    announceStart,
    announceCountdown,
    announceHalfway,
    announceComplete,
    stop,
    play,
    playRandom,
  }
}
