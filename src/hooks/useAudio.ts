import { useCallback, useEffect, useState } from 'react'
import { useSoundEffects } from './useSoundEffects'
import {
  isAudioCached,
  getRandomAudioKey,
  getStoredApiKey,
  getCachedAudio,
} from '../services/openaiTTS'

export function useAudio() {
  const [useOpenAI, setUseOpenAI] = useState(false)
  const soundEffects = useSoundEffects()

  // Check if OpenAI audio is available
  useEffect(() => {
    const checkOpenAI = async () => {
      const apiKey = getStoredApiKey()
      if (apiKey) {
        const cached = await isAudioCached()
        setUseOpenAI(cached)
      }
    }
    checkOpenAI()
  }, [])

  // Helper to play audio blob with proper cleanup
  const playAudioBlob = useCallback(async (blob: Blob): Promise<boolean> => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)

    // Cleanup function to ensure URL is always revoked
    const cleanup = () => {
      URL.revokeObjectURL(url)
    }

    // Set up cleanup for both success and error cases
    audio.onended = cleanup
    audio.onerror = cleanup

    try {
      await audio.play()
      return true
    } catch (error) {
      cleanup() // Clean up immediately on play error
      console.error('Failed to play audio:', error)
      return false
    }
  }, [])

  // Play OpenAI cached audio
  const playOpenAI = useCallback(async (category: 'run' | 'walk' | 'warmup' | 'cooldown' | 'halfway' | 'complete') => {
    const key = getRandomAudioKey(category)
    const blob = await getCachedAudio(key)
    if (!blob) return false
    return playAudioBlob(blob)
  }, [playAudioBlob])

  // Play countdown audio
  const playCountdownAudio = useCallback(async (key: 'countdown_10' | 'countdown_30') => {
    const blob = await getCachedAudio(key)
    if (!blob) return false
    return playAudioBlob(blob)
  }, [playAudioBlob])

  // Fallback Web Speech API (won't be used if OpenAI is available)
  const speakFallback = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      synth.speak(utterance)
    } catch (e) {
      console.error('Speech synthesis failed:', e)
    }
  }, [])

  const announceStart = useCallback(async (type: string) => {
    switch (type) {
      case 'warmup':
        soundEffects.playWarmupStart()
        setTimeout(async () => {
          if (useOpenAI) {
            await playOpenAI('warmup')
          } else {
            speakFallback("Let's warm up. Start walking.")
          }
        }, 250)
        break
      case 'run':
        soundEffects.playRunStart()
        setTimeout(async () => {
          if (useOpenAI) {
            await playOpenAI('run')
          } else {
            speakFallback("Time to run!")
          }
        }, 350)
        break
      case 'walk':
        soundEffects.playWalkStart()
        setTimeout(async () => {
          if (useOpenAI) {
            await playOpenAI('walk')
          } else {
            speakFallback("Good job. Walking now.")
          }
        }, 350)
        break
      case 'cooldown':
        soundEffects.playWarmupStart()
        setTimeout(async () => {
          if (useOpenAI) {
            await playOpenAI('cooldown')
          } else {
            speakFallback("Cool down. Great workout!")
          }
        }, 250)
        break
    }
  }, [useOpenAI, playOpenAI, speakFallback, soundEffects])

  const announceCountdown = useCallback(async (seconds: number) => {
    if (seconds === 10) {
      soundEffects.playCountdownBeep(false)
      if (useOpenAI) {
        await playCountdownAudio('countdown_10')
      } else {
        speakFallback("Ten seconds!")
      }
    } else if (seconds === 5) {
      soundEffects.playCountdownBeep(true)
    } else if (seconds === 30) {
      if (useOpenAI) {
        await playCountdownAudio('countdown_30')
      } else {
        speakFallback("Thirty seconds.")
      }
    }
  }, [useOpenAI, playCountdownAudio, speakFallback, soundEffects])

  const announceHalfway = useCallback(async () => {
    soundEffects.playHalfway()
    setTimeout(async () => {
      if (useOpenAI) {
        await playOpenAI('halfway')
      } else {
        speakFallback("Halfway there!")
      }
    }, 250)
  }, [useOpenAI, playOpenAI, speakFallback, soundEffects])

  const announceComplete = useCallback(async () => {
    soundEffects.playComplete()
    setTimeout(async () => {
      if (useOpenAI) {
        await playOpenAI('complete')
      } else {
        speakFallback("Workout complete! Amazing job!")
      }
    }, 900)
  }, [useOpenAI, playOpenAI, speakFallback, soundEffects])

  const stop = useCallback(() => {
    try {
      window.speechSynthesis?.cancel()
    } catch (e) {
      // Ignore
    }
  }, [])

  // Expose method to refresh OpenAI status (call after generating audio)
  const refreshOpenAIStatus = useCallback(async () => {
    const apiKey = getStoredApiKey()
    if (apiKey) {
      const cached = await isAudioCached()
      setUseOpenAI(cached)
    }
  }, [])

  return {
    announceStart,
    announceCountdown,
    announceHalfway,
    announceComplete,
    stop,
    useOpenAI,
    refreshOpenAIStatus,
  }
}
