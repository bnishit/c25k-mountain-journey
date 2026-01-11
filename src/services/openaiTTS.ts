// OpenAI TTS Service with IndexedDB caching

const DB_NAME = 'c25k-audio-cache'
const STORE_NAME = 'audio-files'
const DB_VERSION = 1

// All phrases that need to be generated
export const AUDIO_PHRASES = {
  // Run prompts
  run_1: "Let's go! Start running.",
  run_2: "Run time! You got this.",
  run_3: "Time to run!",
  run_4: "Here we go, run!",
  run_5: "Push it! Start running.",

  // Walk prompts
  walk_1: "Nice work! Walk it out.",
  walk_2: "Good job. Walking now.",
  walk_3: "Great effort! Rest up.",
  walk_4: "Well done. Catch your breath.",
  walk_5: "Awesome! Time to walk.",

  // Warmup prompts
  warmup_1: "Let's warm up. Start walking.",
  warmup_2: "Warm up time. Easy pace.",

  // Cooldown prompts
  cooldown_1: "Cool down. Great workout!",
  cooldown_2: "Walk it off. You did amazing.",

  // Halfway prompts
  halfway_1: "Halfway there! Keep going.",
  halfway_2: "You're halfway. Stay strong!",
  halfway_3: "Half done. You got this!",

  // Complete prompts
  complete_1: "Workout complete! Amazing job!",
  complete_2: "You did it! Great work today.",
  complete_3: "Finished! You crushed it!",
  complete_4: "Done! Be proud of yourself.",

  // Countdown prompts
  countdown_10: "Ten seconds!",
  countdown_30: "Thirty seconds.",
}

export type AudioKey = keyof typeof AUDIO_PHRASES

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

// Get audio from cache
export async function getCachedAudio(key: string): Promise<Blob | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  } catch (error) {
    console.error('Error getting cached audio:', error)
    return null
  }
}

// Save audio to cache
export async function cacheAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(blob, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('Error caching audio:', error)
  }
}

// Check if all audio is cached
export async function isAudioCached(): Promise<boolean> {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.count()

      request.onsuccess = () => {
        const totalPhrases = Object.keys(AUDIO_PHRASES).length
        resolve(request.result >= totalPhrases)
      }
      request.onerror = () => resolve(false)
    })
  } catch {
    return false
  }
}

// Generate audio using OpenAI TTS
export async function generateAudio(
  text: string,
  apiKey: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'
): Promise<Blob> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI TTS error: ${error}`)
  }

  return response.blob()
}

// Generate and cache all audio phrases
export async function generateAllAudio(
  apiKey: string,
  onProgress?: (current: number, total: number, key: string) => void
): Promise<void> {
  const phrases = Object.entries(AUDIO_PHRASES)
  const total = phrases.length

  for (let i = 0; i < phrases.length; i++) {
    const [key, text] = phrases[i]

    // Check if already cached
    const cached = await getCachedAudio(key)
    if (cached) {
      onProgress?.(i + 1, total, key)
      continue
    }

    try {
      // Generate audio
      const blob = await generateAudio(text, apiKey)

      // Cache it
      await cacheAudio(key, blob)

      onProgress?.(i + 1, total, key)

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to generate audio for ${key}:`, error)
      throw error
    }
  }
}

// Play audio from cache
export async function playAudio(key: AudioKey): Promise<void> {
  const blob = await getCachedAudio(key)
  if (!blob) {
    console.warn(`Audio not cached: ${key}`)
    return
  }

  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    audio.play().catch(reject)
  })
}

// Get a random audio key for a category
export function getRandomAudioKey(category: 'run' | 'walk' | 'warmup' | 'cooldown' | 'halfway' | 'complete'): AudioKey {
  const keys = Object.keys(AUDIO_PHRASES).filter(k => k.startsWith(category + '_')) as AudioKey[]
  return keys[Math.floor(Math.random() * keys.length)]
}

// Clear all cached audio
export async function clearAudioCache(): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('Error clearing audio cache:', error)
  }
}

// API Key management
const API_KEY_STORAGE = 'c25k-openai-api-key'

export function getStoredApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE)
}

export function storeApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key)
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE)
}
