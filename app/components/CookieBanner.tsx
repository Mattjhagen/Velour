'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone, Lock } from 'lucide-react'
import clsx from 'clsx'

export type ConsentPrefs = {
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const CONSENT_KEY = 'velour_consent_v1'

export function getConsent(): ConsentPrefs | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveConsent(prefs: Omit<ConsentPrefs, 'timestamp'>) {
  const full: ConsentPrefs = { ...prefs, timestamp: new Date().toISOString() }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(full))
  applyConsentToGtag(full)
  return full
}

export function applyConsentToGtag(prefs: ConsentPrefs) {
  if (typeof window === 'undefined' || !(window as any).gtag) return
  ;(window as any).gtag('consent', 'update', {
    analytics_storage:   prefs.analytics  ? 'granted' : 'denied',
    ad_storage:          prefs.marketing  ? 'granted' : 'denied',
    ad_user_data:        prefs.marketing  ? 'granted' : 'denied',
    ad_personalization:  prefs.marketing  ? 'granted' : 'denied',
  })
}

const CATEGORIES = [
  {
    key: 'necessary' as const,
    label: 'Strictly necessary',
    icon: Lock,
    description: 'Required for the site to function. Cannot be disabled.',
    always: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analytics',
    icon: BarChart2,
    description: 'Helps us understand how visitors use Velour (Google Analytics). No personal data is sold.',
    always: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing & personalisation',
    icon: Megaphone,
    description: 'Enables targeted ads, remarketing, and personalised content based on your activity.',
    always: false,
  },
]

export function CookieSettingsButton() {
  const [, setRender] = useState(0)
  const open = () => {
    localStorage.removeItem(CONSENT_KEY)
    setRender(n => n + 1)
    window.dispatchEvent(new Event('velour:reopen-consent'))
  }
  return (
    <button
      onClick={open}
      className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 bg-white border border-cream-200 text-stone-500 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:border-stone-300 hover:text-stone-700 transition-all"
    >
      <Shield size={11} /> Cookie settings
    </button>
  )
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false })

  useEffect(() => {
    const stored = getConsent()
    if (!stored) {
      setVisible(true)
    } else {
      applyConsentToGtag(stored)
    }
    const handler = () => setVisible(true)
    window.addEventListener('velour:reopen-consent', handler)
    return () => window.removeEventListener('velour:reopen-consent', handler)
  }, [])

  if (!visible) return null

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true })
    setVisible(false)
  }

  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false })
    setVisible(false)
  }

  const saveCustom = () => {
    saveConsent(prefs)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-700 overflow-hidden">
        {/* Main banner */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-velour-500 flex items-center justify-center shrink-0 mt-0.5">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-base leading-snug">We value your privacy</h2>
              <p className="text-stone-400 text-sm mt-1 leading-relaxed">
                We use cookies to improve your experience, measure traffic, and personalise content and ads.
                You control what we collect. See our{' '}
                <a href="/privacy" className="text-velour-400 hover:text-velour-300 underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Expandable details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-sm text-stone-400 hover:text-stone-200 transition-colors py-2 border-t border-stone-800 mb-4"
          >
            <span>Manage preferences</span>
            {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showDetails && (
            <div className="space-y-3 mb-5">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                const enabled = cat.always || prefs[cat.key as keyof typeof prefs]
                return (
                  <div key={cat.key} className="flex items-start gap-3 bg-stone-800 rounded-2xl p-4">
                    <Icon size={15} className="text-stone-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-stone-200">{cat.label}</span>
                        {cat.always ? (
                          <span className="text-xs text-stone-500 shrink-0">Always on</span>
                        ) : (
                          <button
                            onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key as keyof typeof p] }))}
                            className={clsx(
                              'relative w-10 h-5.5 rounded-full transition-colors shrink-0 focus:outline-none',
                              enabled ? 'bg-velour-500' : 'bg-stone-600'
                            )}
                            style={{ height: '22px', width: '40px' }}
                            role="switch"
                            aria-checked={enabled}
                          >
                            <span
                              className={clsx(
                                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                                enabled ? 'translate-x-5' : 'translate-x-0.5'
                              )}
                            />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>
                )
              })}
              <button
                onClick={saveCustom}
                className="w-full py-2.5 rounded-2xl border border-stone-600 text-stone-200 text-sm font-medium hover:border-stone-400 transition-colors"
              >
                Save my choices
              </button>
            </div>
          )}

          {/* Main actions */}
          <div className="flex gap-3">
            <button
              onClick={rejectAll}
              className="flex-1 py-2.5 rounded-2xl border border-stone-600 text-stone-300 text-sm font-medium hover:border-stone-400 hover:text-white transition-colors"
            >
              Reject all
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 py-2.5 rounded-2xl bg-velour-500 hover:bg-velour-600 text-white text-sm font-semibold transition-colors"
            >
              Accept all
            </button>
          </div>

          <p className="text-[11px] text-stone-600 text-center mt-3">
            By continuing to browse you accept necessary cookies only. You can change preferences any time in the footer.
          </p>
        </div>
      </div>
    </div>
  )
}
