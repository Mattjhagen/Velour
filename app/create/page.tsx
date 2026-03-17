'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, CheckCircle2, MapPin, Clock, Users,
  Info, Sparkles, Calendar
} from 'lucide-react'
import Nav from '../components/Nav'
import { CATEGORY_META, Category } from '../data/activities'
import { supabase } from '../../lib/supabase'
import clsx from 'clsx'

type Step = 'what' | 'details' | 'rules' | 'preview' | 'done'

const STEPS: { key: Step; label: string }[] = [
  { key: 'what', label: 'What' },
  { key: 'details', label: 'Details' },
  { key: 'rules', label: 'Expectations' },
  { key: 'preview', label: 'Preview' },
]

const MAX_SPOTS_OPTIONS = [4, 6, 8, 10, 12, 15, 20, 25, 30]

const PROMPT_STARTERS = [
  "I want to share something I love doing...",
  "I've been meaning to try something new and want company...",
  "I do this every week and there's always room for more people...",
  "I recently learned how to do this and want to teach others...",
]

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('what')
  const [category, setCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [venueName, setVenueName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [recurring, setRecurring] = useState('')
  const [maxSpots, setMaxSpots] = useState(8)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [hostName, setHostName] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const steps: Step[] = ['what', 'details', 'rules', 'preview']
  const currentIndex = steps.indexOf(step)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await supabase.from('gatherings').insert({
        title,
        description,
        category,
        location,
        venue_name: venueName,
        date,
        time,
        recurring: recurring || null,
        max_spots: maxSpots,
        tags,
        host_name: hostName,
        host_email: hostEmail,
        status: 'pending',
      })
    } catch (err) {
      console.error('Failed to save gathering', err)
    }
    setSubmitted(true)
    setSubmitting(false)
    setStep('done')
  }

  const canAdvance = () => {
    if (step === 'what') return category && title.length >= 10 && description.length >= 30
    if (step === 'details') return location && date && time
    if (step === 'rules') return hostName.length >= 2 && hostEmail.includes('@')
    if (step === 'preview') return true
    return false
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-cream-50">
        <Nav minimal />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-display text-4xl text-stone-900 font-bold mb-4">
            Your gathering is live!
          </h1>
          <p className="text-stone-600 text-lg mb-2">
            People nearby will see it on the discover page.
          </p>
          <p className="text-stone-500 mb-10">
            We'll notify you when someone joins. You'll get their first name and a short intro — nothing else.
          </p>
          <div className="bg-velour-50 border border-velour-200 rounded-3xl p-6 mb-8 text-left space-y-3">
            <div className="font-display font-semibold text-stone-800 text-lg">{title}</div>
            <div className="text-sm text-stone-600 flex items-center gap-2">
              <Calendar size={14} className="text-velour-500" /> {date} · {time}
            </div>
            <div className="text-sm text-stone-600 flex items-center gap-2">
              <MapPin size={14} className="text-velour-500" /> {location}
            </div>
            <div className="text-sm text-stone-600 flex items-center gap-2">
              <Users size={14} className="text-velour-500" /> Up to {maxSpots} people
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/discover')}
              className="btn-primary w-full"
            >
              See your gathering live
            </button>
            <button
              onClick={() => {
                setStep('what')
                setCategory(null)
                setTitle('')
                setDescription('')
                setLocation('')
                setDate('')
                setTime('')
                setMaxSpots(8)
                setTags([])
                setHostName('')
                setHostEmail('')
                setSubmitted(false)
              }}
              className="btn-secondary w-full"
            >
              Host another gathering
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav minimal />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => currentIndex === 0 ? router.back() : setStep(steps[currentIndex - 1])}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">{currentIndex === 0 ? 'Back' : 'Previous step'}</span>
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className={clsx(
                'flex items-center gap-1.5 text-xs font-semibold transition-all',
                i < currentIndex ? 'text-sage-600' : i === currentIndex ? 'text-velour-600' : 'text-stone-300'
              )}>
                <div className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                  i < currentIndex ? 'bg-sage-500 text-white' : i === currentIndex ? 'bg-velour-500 text-white' : 'bg-stone-200 text-stone-400'
                )}>
                  {i < currentIndex ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('flex-1 h-0.5 rounded-full transition-all', i < currentIndex ? 'bg-sage-400' : 'bg-stone-200')} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: What */}
        {step === 'what' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-stone-900 font-bold mb-2">
                What are you gathering for?
              </h1>
              <p className="text-stone-500">
                Tell people what you're doing. Be specific — the right people will find you.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="section-label block mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={clsx(
                      'py-3 px-3 rounded-2xl border text-sm font-semibold transition-all flex flex-col items-center gap-1',
                      category === key
                        ? `${meta.bg} ${meta.color} border-transparent ring-2 ring-offset-1 ring-current`
                        : 'bg-white border-cream-200 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-[11px]">{meta.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="section-label block mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. Sunday morning trail walk — Cedar Ridge"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={80}
                className="input-field"
              />
              <p className="text-xs text-stone-400 mt-1 text-right">{title.length}/80</p>
            </div>

            {/* Description */}
            <div>
              <label className="section-label block mb-2">Description</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {PROMPT_STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setDescription(s + ' ')}
                    className="text-xs bg-cream-100 text-stone-600 px-3 py-1.5 rounded-full hover:bg-cream-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea
                rows={5}
                placeholder="Tell people what this gathering is like. Be honest, be warm, be specific. What will you actually do? What's the vibe?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={500}
                className="input-field resize-none"
              />
              <p className="text-xs text-stone-400 mt-1 text-right">{description.length}/500</p>
            </div>

            <div className="bg-velour-50 border border-velour-100 rounded-2xl p-4 flex gap-3">
              <Sparkles size={16} className="text-velour-500 shrink-0 mt-0.5" />
              <p className="text-sm text-velour-700">
                <strong>Pro tip:</strong> The best gathering descriptions tell people exactly what to expect,
                who it's for, and what makes it worth showing up. Honesty beats polish every time.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-stone-900 font-bold mb-2">
                When and where?
              </h1>
              <p className="text-stone-500">
                The exact address is only shared with confirmed attendees, 24h before the event.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="section-label block mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">Recurring? (optional)</label>
              <select
                value={recurring}
                onChange={e => setRecurring(e.target.value)}
                className="input-field"
              >
                <option value="">One-time only</option>
                <option value="Every week">Every week</option>
                <option value="Every 2 weeks">Every 2 weeks</option>
                <option value="Monthly">Monthly</option>
                <option value="Mon, Wed, Fri">Mon, Wed, Fri</option>
                <option value="Every Saturday">Every Saturday</option>
                <option value="Every Sunday">Every Sunday</option>
              </select>
            </div>

            <div>
              <label className="section-label block mb-2">Venue name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Café Noir, Cedar Ridge Trailhead, my apartment"
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="section-label block mb-2">Neighborhood / area</label>
              <input
                type="text"
                placeholder="e.g. Hawthorne, Pearl District, SE Omaha"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="input-field"
              />
              <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1">
                <Info size={11} /> Only the neighborhood is shown publicly. Exact address shared privately with attendees.
              </p>
            </div>

            <div>
              <label className="section-label block mb-3">Max group size</label>
              <div className="flex flex-wrap gap-2">
                {MAX_SPOTS_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => setMaxSpots(n)}
                    className={clsx(
                      'w-12 h-10 rounded-xl border text-sm font-semibold transition-all',
                      maxSpots === n
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-cream-200 text-stone-600 hover:border-stone-400'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-2">
                We recommend 6–10 for the best connection quality. Smaller = deeper conversations.
              </p>
            </div>

            <div>
              <label className="section-label block mb-2">Tags (up to 5)</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="bg-stone-900 text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-stone-700 transition-colors"
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. free, all-levels, bring snacks"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="input-field flex-1"
                  disabled={tags.length >= 5}
                />
                <button onClick={addTag} disabled={tags.length >= 5} className="btn-secondary px-4 py-2 text-sm">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Expectations */}
        {step === 'rules' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-stone-900 font-bold mb-2">
                A few things about being a host
              </h1>
              <p className="text-stone-500">
                Velour works because hosts take it seriously. We need you to agree to our community norms.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '👋', title: 'Show up', desc: 'If you cancel less than 4h before, you risk losing your ability to host. People are counting on you.' },
                { icon: '🛡️', title: 'Keep it safe', desc: 'Verify the space is safe and accessible. If something feels wrong, cancel and contact us.' },
                { icon: '🚫', title: 'No solicitation', desc: 'gatherings are for connection, not promotion. No selling, recruiting, or pitching.' },
                { icon: '📵', title: 'Be present', desc: 'Encourage people to actually be there — less phone, more face.' },
                { icon: '🤝', title: 'Welcome everyone', desc: 'gatherings are inclusive. Discriminatory behavior will result in immediate removal.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 bg-white rounded-2xl border border-cream-200">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-stone-800 text-sm">{item.title}</div>
                    <div className="text-sm text-stone-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 space-y-4">
              <div>
                <label className="section-label block mb-2">Your first name (shown to attendees)</label>
                <input
                  type="text"
                  placeholder="What should attendees call you?"
                  value={hostName}
                  onChange={e => setHostName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="section-label block mb-2">Your email (private — never shown publicly)</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={hostEmail}
                  onChange={e => setHostEmail(e.target.value)}
                  className="input-field"
                />
                <p className="text-xs text-stone-400 mt-1.5">Used to notify you of RSVPs and to send you a magic link to edit or cancel this gathering.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Preview */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-stone-900 font-bold mb-2">
                Here's your gathering
              </h1>
              <p className="text-stone-500">
                This is exactly what people will see. Happy with it?
              </p>
            </div>

            <div className="card p-6 space-y-5">
              {category && (
                <span className={clsx('tag', CATEGORY_META[category].bg, CATEGORY_META[category].color)}>
                  {CATEGORY_META[category].emoji} {CATEGORY_META[category].label}
                </span>
              )}

              <h2 className="font-display text-2xl font-bold text-stone-900">{title || '(untitled)'}</h2>

              <p className="text-stone-600 leading-relaxed">{description || '(no description)'}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-cream-50 rounded-2xl p-3">
                  <div className="text-xs text-stone-400 mb-1">When</div>
                  <div className="text-sm font-semibold text-stone-800">{date || 'TBD'}</div>
                  <div className="text-sm text-stone-600">{time || 'TBD'}</div>
                  {recurring && <div className="text-xs text-sage-600 mt-1">{recurring}</div>}
                </div>
                <div className="bg-cream-50 rounded-2xl p-3">
                  <div className="text-xs text-stone-400 mb-1">Where</div>
                  <div className="text-sm font-semibold text-stone-800">{venueName || 'TBD'}</div>
                  <div className="text-sm text-stone-600">{location || 'TBD'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Users size={14} className="text-velour-500" />
                Up to {maxSpots} people
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-sage-600 flex items-center justify-center text-xs font-bold text-white">
                  {hostName ? hostName[0].toUpperCase() : '?'}
                </div>
                <span className="text-sm text-stone-600">Hosted by <strong>{hostName || 'you'}</strong></span>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="text-xs bg-cream-100 text-stone-600 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex gap-3">
              <Info size={16} className="text-stone-400 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-600">
                Once published, people in your area will see this. You'll be notified when someone joins.
                You can edit or cancel at any time from your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-cream-200">
          {currentIndex > 0 && (
            <button
              onClick={() => setStep(steps[currentIndex - 1])}
              className="btn-secondary flex items-center gap-1.5"
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === 'preview') handleSubmit()
              else setStep(steps[currentIndex + 1])
            }}
            disabled={!canAdvance()}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold transition-all',
              canAdvance()
                ? 'btn-primary'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            )}
          >
            {step === 'preview' ? (
              <>{submitting ? 'Publishing…' : 'Publish gathering'} <Sparkles size={16} /></>
            ) : (
              <>Continue <ArrowRight size={15} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
