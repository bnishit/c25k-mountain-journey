import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getStoredApiKey,
  storeApiKey,
  clearApiKey,
  isAudioCached,
  generateAllAudio,
  clearAudioCache,
  AUDIO_PHRASES,
} from '../services/openaiTTS'

interface SettingsProps {
  onClose: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function Settings({ onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, key: '' })
  const [audioCached, setAudioCached] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedKey = getStoredApiKey()
    if (storedKey) {
      setApiKey(storedKey)
      setHasKey(true)
    }
    checkAudioCache()
  }, [])

  const checkAudioCache = async () => {
    const cached = await isAudioCached()
    setAudioCached(cached)
  }

  const handleSaveKey = () => {
    if (apiKey.trim().startsWith('sk-')) {
      storeApiKey(apiKey.trim())
      setHasKey(true)
      setError('')
    } else {
      setError('Invalid API key. It should start with sk-')
    }
  }

  const handleClearKey = () => {
    clearApiKey()
    setApiKey('')
    setHasKey(false)
  }

  const handleGenerateAudio = async () => {
    const key = getStoredApiKey()
    if (!key) {
      setError('Please save your API key first')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      await generateAllAudio(key, (current, total, phraseKey) => {
        setProgress({ current, total, key: phraseKey })
      })
      setAudioCached(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearCache = async () => {
    await clearAudioCache()
    setAudioCached(false)
    setProgress({ current: 0, total: 0, key: '' })
  }

  const totalPhrases = Object.keys(AUDIO_PHRASES).length

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-5 pb-28 pt-safe">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto pt-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display text-[28px]">Settings</h1>
            <p className="text-body text-[var(--text-tertiary)] mt-1">Voice configuration</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>

        {/* OpenAI API Key Section */}
        <motion.div variants={itemVariants} className="glass-card p-5 mb-5">
          <h2 className="font-semibold mb-1">OpenAI API Key</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Required for high-quality voice prompts
          </p>

          <div className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--accent-run)]"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[var(--accent-run)] text-white disabled:opacity-50"
              >
                {hasKey ? 'Update Key' : 'Save Key'}
              </button>
              {hasKey && (
                <button
                  onClick={handleClearKey}
                  className="px-4 py-3 rounded-xl font-semibold text-sm border border-red-400/30 text-red-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {hasKey && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#2dd4bf]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              API key saved
            </div>
          )}
        </motion.div>

        {/* Voice Generation Section */}
        <motion.div variants={itemVariants} className="glass-card p-5 mb-5">
          <h2 className="font-semibold mb-1">Voice Prompts</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Generate and cache {totalPhrases} voice prompts using OpenAI TTS
          </p>

          {audioCached ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#2dd4bf]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">All {totalPhrases} voice prompts ready!</span>
              </div>
              <button
                onClick={handleClearCache}
                className="w-full py-3 rounded-xl font-semibold text-sm border border-[var(--border-subtle)] text-[var(--text-muted)]"
              >
                Regenerate All
              </button>
            </div>
          ) : isGenerating ? (
            <div className="space-y-3">
              <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--accent-run)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] text-center">
                Generating {progress.current} of {progress.total}...
              </p>
              <p className="text-xs text-[var(--text-muted)] text-center truncate">
                {progress.key}
              </p>
            </div>
          ) : (
            <button
              onClick={handleGenerateAudio}
              disabled={!hasKey}
              className="w-full py-4 rounded-xl font-bold text-white disabled:opacity-50"
              style={{
                background: hasKey
                  ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              Generate Voice Prompts
            </button>
          )}

          {!hasKey && !audioCached && (
            <p className="text-xs text-[var(--text-muted)] text-center mt-3">
              Save your API key first to generate voice prompts
            </p>
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 border border-red-400/30 mb-5"
          >
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h2 className="font-semibold mb-2">How it works</h2>
          <ul className="text-xs text-[var(--text-muted)] space-y-2">
            <li className="flex gap-2">
              <span className="text-[var(--accent-run)]">1.</span>
              Enter your OpenAI API key (get one at platform.openai.com)
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-run)]">2.</span>
              Click "Generate Voice Prompts" to create all audio files
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-run)]">3.</span>
              Audio is cached locally - works offline after generation
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-run)]">4.</span>
              Cost: ~$0.01 total (one-time)
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
