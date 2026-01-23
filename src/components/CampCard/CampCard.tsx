import { motion, AnimatePresence } from 'framer-motion'
import { useEnvironmentTheme } from '../../contexts/EnvironmentContext'
import { getCamp } from '../../data/story'

interface CampCardProps {
  week: number
  isOpen: boolean
  onClose: () => void
  completedDays?: number
}

// Camp illustrations as inline SVG components
function KathmanduIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="kathmandu-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9f43" />
          <stop offset="100%" stopColor="#74b9ff" />
        </linearGradient>
      </defs>
      <rect fill="url(#kathmandu-sky)" width="200" height="120" />
      {/* Temple spires */}
      <path d="M60 120 L60 70 L70 50 L80 70 L80 120 Z" fill="#8b4513" />
      <path d="M65 50 L70 35 L75 50 Z" fill="#ffd700" />
      <path d="M100 120 L100 60 L115 40 L130 60 L130 120 Z" fill="#8b4513" />
      <path d="M108 40 L115 20 L122 40 Z" fill="#ffd700" />
      <path d="M150 120 L150 75 L160 55 L170 75 L170 120 Z" fill="#8b4513" />
      <path d="M155 55 L160 40 L165 55 Z" fill="#ffd700" />
      {/* Ground with greenery */}
      <rect fill="#228b22" x="0" y="100" width="200" height="20" />
      <ellipse fill="#2d8b2d" cx="30" cy="105" rx="20" ry="8" />
      <ellipse fill="#1e7b1e" cx="180" cy="108" rx="25" ry="10" />
    </svg>
  )
}

function LuklaIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="lukla-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdcb6e" />
          <stop offset="100%" stopColor="#74b9ff" />
        </linearGradient>
      </defs>
      <rect fill="url(#lukla-sky)" width="200" height="120" />
      {/* Mountains in background */}
      <path d="M0 120 L30 60 L70 90 L120 50 L160 80 L200 40 L200 120 Z" fill="#636e72" />
      {/* Runway */}
      <rect fill="#4a4a4a" x="10" y="95" width="180" height="15" rx="2" />
      <line x1="20" y1="102" x2="190" y2="102" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
      {/* Small plane */}
      <g transform="translate(140, 85)">
        <ellipse fill="#e0e0e0" cx="15" cy="8" rx="18" ry="5" />
        <path d="M8 8 L15 0 L22 8 Z" fill="#e0e0e0" />
        <rect fill="#3498db" x="10" y="5" width="4" height="3" />
      </g>
    </svg>
  )
}

function NamcheIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="namche-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a29bfe" />
          <stop offset="100%" stopColor="#74b9ff" />
        </linearGradient>
      </defs>
      <rect fill="url(#namche-sky)" width="200" height="120" />
      {/* Curved mountain bowl */}
      <path d="M0 120 Q100 60 200 120 Z" fill="#636e72" />
      {/* Buildings on slope */}
      <rect fill="#dfe6e9" x="40" y="85" width="15" height="12" />
      <rect fill="#dfe6e9" x="60" y="80" width="18" height="15" />
      <rect fill="#dfe6e9" x="85" y="75" width="20" height="18" />
      <rect fill="#dfe6e9" x="115" y="80" width="16" height="14" />
      <rect fill="#dfe6e9" x="140" y="85" width="14" height="12" />
      {/* Colorful roofs */}
      <path d="M38 85 L47 78 L57 85 Z" fill="#e74c3c" />
      <path d="M58 80 L69 72 L80 80 Z" fill="#3498db" />
      <path d="M83 75 L95 65 L107 75 Z" fill="#f39c12" />
      <path d="M113 80 L123 73 L133 80 Z" fill="#27ae60" />
      <path d="M138 85 L147 78 L156 85 Z" fill="#9b59b6" />
      {/* Prayer flags */}
      <line x1="90" y1="65" x2="120" y2="60" stroke="#666" strokeWidth="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} fill={['#e74c3c', '#3498db', '#f1c40f', '#27ae60', '#9b59b6'][i]} x={92 + i * 6} y={63 - i * 1} width="4" height="6" />
      ))}
    </svg>
  )
}

function TengbocheIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="teng-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a29bfe" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </linearGradient>
      </defs>
      <rect fill="url(#teng-sky)" width="200" height="120" />
      {/* Snow-capped peak in background */}
      <path d="M130 120 L170 30 L200 80 L200 120 Z" fill="#b2bec3" />
      <path d="M155 60 L170 30 L185 55 Z" fill="white" />
      {/* Monastery */}
      <rect fill="#8b0000" x="60" y="70" width="80" height="40" />
      <rect fill="#ffd700" x="65" y="75" width="70" height="5" />
      {/* Tiered roof */}
      <path d="M55 70 L100 45 L145 70 Z" fill="#8b0000" />
      <path d="M65 55 L100 35 L135 55 Z" fill="#8b0000" />
      <path d="M75 42 L100 25 L125 42 Z" fill="#ffd700" />
      {/* Prayer wheels */}
      {[70, 85, 100, 115, 130].map((x) => (
        <circle key={x} cx={x} cy="100" r="5" fill="#ffd700" stroke="#8b4513" strokeWidth="1" />
      ))}
      {/* Ground */}
      <rect fill="#b2bec3" x="0" y="110" width="200" height="10" />
    </svg>
  )
}

function DingbocheIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="ding-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#74b9ff" />
          <stop offset="100%" stopColor="#0984e3" />
        </linearGradient>
      </defs>
      <rect fill="url(#ding-sky)" width="200" height="120" />
      {/* Rocky terrain */}
      <path d="M0 120 L0 90 L40 85 L80 95 L120 80 L160 90 L200 85 L200 120 Z" fill="#b2bec3" />
      {/* Stone walls */}
      <path d="M20 95 L60 90 L60 100 L20 105 Z" fill="#636e72" />
      <path d="M100 85 L150 80 L150 90 L100 95 Z" fill="#636e72" />
      {/* Yaks */}
      <g transform="translate(70, 90)">
        <ellipse fill="#2d3436" cx="10" cy="8" rx="12" ry="6" />
        <circle fill="#2d3436" cx="0" cy="5" r="4" />
        <path d="M-3 2 L-6 -2 M1 2 L4 -2" stroke="#2d3436" strokeWidth="1" />
      </g>
      <g transform="translate(130, 85)">
        <ellipse fill="#2d3436" cx="10" cy="8" rx="10" ry="5" />
        <circle fill="#2d3436" cx="2" cy="5" r="3" />
      </g>
      {/* Prayer flags */}
      <line x1="80" y1="70" x2="120" y2="65" stroke="#666" strokeWidth="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} fill={['#e74c3c', '#f1c40f', '#27ae60', '#3498db', '#fff'][i]} x={82 + i * 8} y={68 - i * 1} width="5" height="8" />
      ))}
    </svg>
  )
}

function LoducheIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="lob-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#74b9ff" />
          <stop offset="100%" stopColor="#2d3436" />
        </linearGradient>
      </defs>
      <rect fill="url(#lob-sky)" width="200" height="120" />
      {/* Glacier/ice */}
      <path d="M0 120 L20 80 L60 90 L100 70 L140 85 L180 75 L200 90 L200 120 Z" fill="#dfe6e9" />
      {/* Memorial cairns */}
      {[30, 80, 130, 170].map((x) => (
        <g key={x}>
          <rect fill="#636e72" x={x - 8} y={95} width="16" height="20" />
          <rect fill="#636e72" x={x - 6} y={88} width="12" height="10" />
          <rect fill="#636e72" x={x - 4} y={82} width="8" height="8" />
          <rect fill="#636e72" x={x - 2} y={78} width="4" height="5" />
        </g>
      ))}
      {/* Prayer flags between cairns */}
      <line x1="30" y1="78" x2="80" y2="78" stroke="#666" strokeWidth="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} fill={['#e74c3c', '#3498db', '#f1c40f', '#27ae60', '#fff'][i]} x={35 + i * 9} y={75} width="5" height="6" />
      ))}
      {/* Snowflakes */}
      {[20, 60, 100, 150, 180].map((x, i) => (
        <circle key={i} cx={x} cy={20 + i * 10} r="1" fill="white" opacity="0.7" />
      ))}
    </svg>
  )
}

function GorakShepIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="gorak-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dfe6e9" />
          <stop offset="100%" stopColor="#2d3436" />
        </linearGradient>
      </defs>
      <rect fill="url(#gorak-sky)" width="200" height="120" />
      {/* Stark white landscape */}
      <path d="M0 120 L0 80 L200 75 L200 120 Z" fill="white" />
      {/* Lone teahouse */}
      <rect fill="#8b4513" x="80" y="70" width="40" height="25" />
      <path d="M75 70 L100 55 L125 70 Z" fill="#4a4a4a" />
      {/* Windows with warm light */}
      <rect fill="#ffd700" x="85" y="78" width="8" height="8" />
      <rect fill="#ffd700" x="105" y="78" width="8" height="8" />
      {/* Smoke from chimney */}
      <path d="M110 55 Q115 45 108 35 Q112 25 105 15" stroke="#636e72" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Stars appearing */}
      {[20, 50, 150, 180, 100].map((x, i) => (
        <circle key={i} cx={x} cy={15 + i * 8} r="1" fill="white" />
      ))}
    </svg>
  )
}

function EBCIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="ebc-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dfe6e9" />
          <stop offset="100%" stopColor="#1e272e" />
        </linearGradient>
      </defs>
      <rect fill="url(#ebc-sky)" width="200" height="120" />
      {/* Khumbu icefall in background */}
      <path d="M0 120 L30 60 L70 80 L110 50 L150 70 L200 40 L200 120 Z" fill="white" />
      {/* Colorful tents */}
      {[
        { x: 30, color: '#e74c3c' },
        { x: 60, color: '#f39c12' },
        { x: 90, color: '#3498db' },
        { x: 120, color: '#27ae60' },
        { x: 150, color: '#9b59b6' },
      ].map((tent) => (
        <g key={tent.x}>
          <path d={`M${tent.x} 100 L${tent.x + 10} 85 L${tent.x + 20} 100 Z`} fill={tent.color} />
        </g>
      ))}
      {/* Prayer flags across camp */}
      <line x1="30" y1="82" x2="170" y2="75" stroke="#666" strokeWidth="0.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} fill={['#e74c3c', '#3498db', '#f1c40f', '#27ae60', '#fff', '#e74c3c', '#3498db', '#f1c40f'][i]} x={35 + i * 18} y={80 - i * 0.8} width="6" height="8" />
      ))}
      {/* Ground */}
      <rect fill="#dfe6e9" x="0" y="100" width="200" height="20" />
    </svg>
  )
}

function KalaPattharIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="kala-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffeaa7" />
          <stop offset="100%" stopColor="#2d3436" />
        </linearGradient>
      </defs>
      <rect fill="url(#kala-sky)" width="200" height="120" />
      {/* Everest peak - dramatic view */}
      <path d="M100 120 L140 20 L180 60 L200 40 L200 120 Z" fill="white" />
      <path d="M130 50 L140 20 L155 45 Z" fill="#dfe6e9" />
      {/* Prayer flags at summit viewpoint */}
      <g transform="translate(40, 90)">
        <rect fill="#636e72" x="0" y="0" width="4" height="20" />
        <line x1="2" y1="0" x2="60" y2="-10" stroke="#333" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} fill={['#e74c3c', '#f1c40f', '#27ae60', '#3498db', '#fff'][i]} x={5 + i * 12} y={-3 - i * 2} width="8" height="10" />
        ))}
      </g>
      {/* Golden sunrise glow */}
      <circle cx="170" cy="30" r="15" fill="#ffd700" opacity="0.6" />
      {/* Stars fading */}
      {[30, 60, 80].map((x, i) => (
        <circle key={i} cx={x} cy={15 + i * 5} r="0.8" fill="white" opacity="0.4" />
      ))}
    </svg>
  )
}

const CAMP_ILLUSTRATIONS: Record<number, () => React.ReactElement> = {
  1: KathmanduIllustration,
  2: LuklaIllustration,
  3: NamcheIllustration,
  4: TengbocheIllustration,
  5: DingbocheIllustration,
  6: LoducheIllustration,
  7: GorakShepIllustration,
  8: EBCIllustration,
  9: KalaPattharIllustration,
}

const CAMP_FACTS: Record<number, string[]> = {
  1: ['Starting point of most Everest expeditions', 'Home to over 1 million people', 'Rich in Buddhist temples and stupas'],
  2: ['One of the world\'s most dangerous airports', 'Gateway to the Khumbu region', 'Runway slopes at 12% gradient'],
  3: ['Largest Sherpa settlement in Nepal', 'Famous Saturday market', 'Offers first clear views of Everest'],
  4: ['Home to the famous Tengboche Monastery', 'Spectacular views of Everest and Ama Dablam', 'Annual Mani Rimdu festival held here'],
  5: ['Important acclimatization stop', 'Cold winds sweep through the valley', 'Ancient potato farming village'],
  6: ['Named after memorial stone piles', 'Stark, otherworldly landscape', 'Last major settlement before EBC'],
  7: ['Highest settlement in the Khumbu', 'Frozen lake nearby', 'Stepping stone to Kala Patthar'],
  8: ['5,364m - the famous base camp', 'Tent city during climbing season', 'Edge of the Khumbu Icefall'],
  9: ['5,545m - the "black rock"', 'Best sunrise view of Everest', 'Your summit moment!'],
}

export function CampCard({ week, isOpen, onClose, completedDays = 0 }: CampCardProps) {
  const theme = useEnvironmentTheme(week)
  const camp = getCamp(week)
  const Illustration = CAMP_ILLUSTRATIONS[week]
  const facts = CAMP_FACTS[week]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="glass-card-elevated overflow-hidden">
              {/* Illustration header */}
              <div className="h-40 relative">
                <Illustration />
                {/* Gradient overlay for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Camp name overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    Week {week} • {theme.elevation.toLocaleString()}m
                  </p>
                  <h2 className="text-2xl font-bold text-white">{camp.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Progress dots */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-[var(--text-muted)]">Progress:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((day) => (
                      <div
                        key={day}
                        className={`w-3 h-3 rounded-full ${
                          day <= completedDays
                            ? 'bg-gradient-to-br from-teal-400 to-teal-600'
                            : 'bg-[rgba(255,255,255,0.1)]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{completedDays}/3 runs</span>
                </div>

                {/* Camp message */}
                <p className="text-sm text-[var(--text-secondary)] italic mb-4">"{camp.message}"</p>

                {/* Trek facts */}
                <div className="space-y-2">
                  <p className="text-caption text-[var(--text-muted)]">TREK FACTS</p>
                  {facts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <p className="text-xs text-[var(--text-secondary)]">{fact}</p>
                    </div>
                  ))}
                </div>

                {/* Temperature badge */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      theme.temperature === 'warm'
                        ? 'bg-orange-500/20 text-orange-400'
                        : theme.temperature === 'cool'
                          ? 'bg-purple-500/20 text-purple-400'
                          : theme.temperature === 'cold'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {theme.temperature.charAt(0).toUpperCase() + theme.temperature.slice(1)} Zone
                  </div>
                  {theme.snowIntensity > 0 && (
                    <div className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white/70">
                      Snow: {Math.round(theme.snowIntensity * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
