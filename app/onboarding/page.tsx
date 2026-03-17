'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle2, MapPin, Sparkles } from 'lucide-react'
import Nav from '../components/Nav'
import { INTERESTS } from '../data/activities'
import clsx from 'clsx'

type OnboardStep = 'welcome' | 'location' | 'interests' | 'size' | 'frequency' | 'done'

const CITY_SUGGESTIONS = [
  'Omaha, NE', 'Seattle, WA', 'Austin, TX', 'Denver, CO',
  'Chicago, IL', 'Brooklyn, NY', 'Oakland, CA', 'Nashville, TN',
  'Minneapolis, MN', 'Atlanta, GA', 'Boston, MA', 'Phoenix, AZ',
]

const SIZE_PREFS = [
  { value: 'small', label: 'Small & intimate', desc: '4–6 people — deep conversations', emoji: '🫂' },
  { value: 'medium', label: 'Medium groups', desc: '7–12 people — meet more people', emoji: '👥' },
  { value: 'any', label: 'Either works', desc: 'Show me everything', emoji: '🌐' },
]

const FREQUENCY_PREFS = [
  { value: 'weekly', label: 'Once a week', desc: 'Build a real routine', emoji: '📅' },
  { value: 'biweekly', label: 'A few times a month', desc: 'Regular but flexible', emoji: '🗓️' },
  { value: 'monthly', label: 'Once a month or so', desc: 'Low pressure', emoji: '🌙' },
  { value: 'whenever', label: 'When something great comes up', desc: 'No commitment', emoji: '✨' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardStep>('welcome')
  const [city, setCity] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [sizePref, setSizePref] = useState<string>('')
  const [frequency, setFrequency] = useState<string>('')

  const steps: OnboardStep[] = ['welcome', 'location', 'interests', 'size', 'frequency', 'done']
  const currentIndex = steps.indexOf(step)
  const progress = currentIndex / (steps.length - 1)

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const canContinue = () => {
    if (step === 'welcome') return true
    if (step === 'location') return city.length >= 2
    if (step === 'interests') return selectedInterests.length >= 2
    if (step === 'size') return sizePref !== ''
    if (step === 'frequency') return frequency !== ''
    return true
  }

  const advance = () => {
    const next = steps[currentIndex + 1]
    if (next === 'done') {
      setStep('done')
    } else {
      setStep(next)
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-cream-50">
        <Nav minimal />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-velour-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h1 className="font-display text-4xl text-stone-900 font-bold mb-4">
            You're all set!
          </h1>
          <p className="text-stone-500 text-lg mb-2">
            We found <span className="font-semibold text-stone-800">12 gatherings</span> that match your interests in {city}.
          </p>
          <p className="text-stone-400 mb-10">
            No account needed — just show up. We'll remember your preferences locally.
          </p>

          <div className="bg-white rounded-3xl border border-cream-200 p-6 mb-8 text-left space-y-3">
            <div className="section-label mb-3">Your profile</div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-velour-500" />
              <span className="text-stone-700">{city}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map(id => {
                const interest = INTERESTS.find(i => i.id === id)
                return interest ? (
                  <span key={id} className="text-xs bg-cream-100 text-stone-700 px-3 py-1.5 rounded-full">
                    {interest.emoji} {interest.label}
                  </span>
                ) : null
              })}
            </div>
            <div className="text-sm text-stone-500">
              {SIZE_PREFS.find(s => s.value === sizePref)?.label} ·{' '}
              {FREQUENCY_PREFS.find(f => f.value === frequency)?.label}
            </div>
          </div>

          <button
            onClick={() => router.push('/discover')}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            See your matched gatherings <ArrowRight size={20} />
          </button>
          <p className="text-xs text-stone-400 mt-4">
            No account, no email, no tracking. Your preferences stay on your device.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav minimal />

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress bar */}
        {step !== 'welcome' && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span>Setting up your Velour</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-velour-500 rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* WELCOME */}
        {step === 'welcome' && (
          <div className="text-center py-12">
            <div className="text-7xl mb-6">🤝</div>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 font-bold mb-4">
              Let's find your people
            </h1>
            <p className="text-stone-500 text-lg mb-3 max-w-sm mx-auto leading-relaxed">
              Takes about 2 minutes. No email, no account, no data sold. Just a few questions so we can show you what matters.
            </p>
            <div className="flex flex-col gap-2 text-sm text-stone-400 mb-12 items-center">
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-sage-500" /> No account required</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-sage-500" /> No email address needed</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-sage-500" /> Preferences stored locally only</span>
            </div>
          </div>
        )}

        {/* LOCATION */}
        {step === 'location' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-stone-900 font-bold mb-2">
                Where are you?
              </h2>
              <p className="text-stone-500">
                We only use this to show you nearby gatherings. We never share or sell your location.
              </p>
            </div>

            <div className="relative">
              <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-velour-400" />
              <input
                type="text"
                placeholder="City or neighborhood..."
                value={city}
                onChange={e => setCity(e.target.value)}
                className="input-field pl-11"
                autoFocus
              />
            </div>

            <div>
              <div className="section-label mb-3">Popular cities</div>
              <div className="flex flex-wrap gap-2">
                {CITY_SUGGESTIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={clsx(
                      'text-sm px-3 py-1.5 rounded-xl border transition-all',
                      city === c
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-cream-200 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INTERESTS */}
        {step === 'interests' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-stone-900 font-bold mb-2">
                What do you love doing?
              </h2>
              <p className="text-stone-500">
                Pick at least 2. These are things you'd actually enjoy doing with other people.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest.id)
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={clsx(
                      'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all',
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-cream-200 text-stone-700 hover:border-stone-300'
                    )}
                  >
                    <span className="text-2xl">{interest.emoji}</span>
                    <span className="text-sm font-medium leading-tight">{interest.label}</span>
                    {isSelected && (
                      <CheckCircle2 size={14} className="ml-auto shrink-0 text-velour-300" />
                    )}
                  </button>
                )
              })}
            </div>

            <p className="text-sm text-stone-400 text-center">
              {selectedInterests.length} selected {selectedInterests.length < 2 && '— pick at least 2'}
            </p>
          </div>
        )}

        {/* SIZE PREFERENCE */}
        {step === 'size' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-stone-900 font-bold mb-2">
                How big a group do you prefer?
              </h2>
              <p className="text-stone-500">
                Research shows smaller groups build deeper connections. But some people love the energy of bigger gatherings.
              </p>
            </div>

            <div className="space-y-3">
              {SIZE_PREFS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSizePref(option.value)}
                  className={clsx(
                    'w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all',
                    sizePref === option.value
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white border-cream-200 text-stone-700 hover:border-stone-300'
                  )}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className={clsx('text-sm', sizePref === option.value ? 'text-stone-300' : 'text-stone-500')}>
                      {option.desc}
                    </div>
                  </div>
                  {sizePref === option.value && (
                    <CheckCircle2 size={20} className="ml-auto shrink-0 text-velour-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FREQUENCY */}
        {step === 'frequency' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-stone-900 font-bold mb-2">
                How often do you want to gather?
              </h2>
              <p className="text-stone-500">
                Honest answer — no pressure. You can always change this.
              </p>
            </div>

            <div className="space-y-3">
              {FREQUENCY_PREFS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFrequency(option.value)}
                  className={clsx(
                    'w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all',
                    frequency === option.value
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white border-cream-200 text-stone-700 hover:border-stone-300'
                  )}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className={clsx('text-sm', frequency === option.value ? 'text-stone-300' : 'text-stone-500')}>
                      {option.desc}
                    </div>
                  </div>
                  {frequency === option.value && (
                    <CheckCircle2 size={20} className="ml-auto shrink-0 text-velour-300" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-velour-50 border border-velour-100 rounded-2xl p-4 flex gap-3">
              <Sparkles size={15} className="text-velour-500 shrink-0 mt-0.5" />
              <p className="text-sm text-velour-700">
                Studies show that meeting someone just 3 times is enough to start forming a real friendship.
                Even monthly makes a difference.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={clsx('flex gap-3 mt-10', step === 'welcome' ? 'justify-center' : '')}>
          {step !== 'welcome' && (
            <button
              onClick={() => setStep(steps[currentIndex - 1])}
              className="btn-secondary flex items-center gap-1.5"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <button
            onClick={advance}
            disabled={!canContinue()}
            className={clsx(
              'flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all text-lg active:scale-95',
              step === 'welcome' ? 'px-12' : 'flex-1',
              canContinue()
                ? 'btn-primary'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            )}
          >
            {step === 'welcome' ? (
              <>Let's go <ArrowRight size={18} /></>
            ) : step === 'frequency' ? (
              <>Show me my gatherings <ArrowRight size={18} /></>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </div>

        {step === 'welcome' && (
          <div className="text-center mt-4">
            <button onClick={() => router.push('/discover')} className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
              Skip and browse everything →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
