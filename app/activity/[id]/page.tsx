'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Clock, Users, Repeat2, CheckCircle2,
  Share2, Heart, ExternalLink, AlertCircle, Info
} from 'lucide-react'
import Nav from '../../components/Nav'
import ActivityCard from '../../components/ActivityCard'
import { ACTIVITIES, CATEGORY_META } from '../../data/activities'
import clsx from 'clsx'

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const activity = ACTIVITIES.find(a => a.id === params.id)
  const [joined, setJoined] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!activity) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-display text-2xl text-stone-700 mb-2">Gathering not found</h1>
          <Link href="/discover" className="btn-primary mt-4 inline-flex">Browse gatherings</Link>
        </div>
      </div>
    )
  }

  const cat = CATEGORY_META[activity.category]
  const filled = activity.spotsTotal - activity.spotsLeft
  const pct = (filled / activity.spotsTotal) * 100
  const isAlmostFull = activity.spotsLeft <= 2
  const related = ACTIVITIES.filter(a => a.category === activity.category && a.id !== activity.id).slice(0, 3)

  const handleJoin = () => {
    if (joined) return
    setShowConfirm(true)
    setTimeout(() => {
      setJoined(true)
      setShowConfirm(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="card p-7">
              {/* Category + tags */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className={clsx('tag', cat.bg, cat.color)}>
                  {cat.emoji} {cat.label}
                </span>
                {activity.isNew && (
                  <span className="tag bg-gather-100 text-gather-700">New</span>
                )}
                {activity.recurring && (
                  <span className="tag bg-sage-100 text-sage-700 flex items-center gap-1">
                    <Repeat2 size={10} /> Recurring
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-3xl text-stone-900 font-bold mb-4 leading-snug">
                {activity.emoji} {activity.title}
              </h1>

              <p className="text-stone-600 leading-relaxed text-[15px] mb-6">
                {activity.description}
              </p>

              {/* Details grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-cream-50 rounded-2xl p-4">
                  <Clock size={18} className="text-gather-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-0.5">When</div>
                    <div className="font-semibold text-stone-800">{activity.dateLabel}</div>
                    <div className="text-sm text-stone-600">{activity.time}</div>
                    {activity.recurring && (
                      <div className="text-xs text-sage-600 mt-1 flex items-center gap-1">
                        <Repeat2 size={11} /> {activity.recurring}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-cream-50 rounded-2xl p-4">
                  <MapPin size={18} className="text-gather-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-0.5">Where</div>
                    {activity.location.venueName && (
                      <div className="font-semibold text-stone-800">{activity.location.venueName}</div>
                    )}
                    <div className="text-sm text-stone-600">
                      {activity.location.neighborhood}, {activity.location.city}
                    </div>
                    <div className="text-xs text-gather-600 mt-1 flex items-center gap-1">
                      <ExternalLink size={11} /> Exact address sent on joining
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Host card */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg text-stone-800 mb-4">Your host</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-300 to-sage-600 flex items-center justify-center text-lg font-bold text-white shadow-sm">
                  {activity.host.avatar}
                </div>
                <div>
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    {activity.host.name}
                    {activity.host.verified && (
                      <span className="text-xs bg-gather-100 text-gather-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-500 mt-0.5">
                    Member since 2024 · 12 gatherings hosted
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-cream-50 rounded-2xl border border-cream-100">
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <Info size={15} className="text-stone-400 mt-0.5 shrink-0" />
                  <span>
                    Hosts on Gather are real people in your community. We verify identities and read every review. Your safety matters.
                  </span>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg text-stone-800 mb-4">What to expect</h2>
              <ul className="space-y-3">
                {[
                  'You\'ll receive the exact address 24h before the event via email',
                  'The host will be there 10 minutes early to welcome you',
                  'No need to know anyone — that\'s kind of the point',
                  'Photos only with everyone\'s consent. No posting without permission.',
                  'If you can\'t make it, please cancel at least 2h before so others can join',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                    <CheckCircle2 size={16} className="text-sage-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {activity.tags.map(tag => (
                <span key={tag} className="bg-white border border-cream-200 text-stone-600 text-sm px-4 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Join card */}
            <div className="card p-6 sticky top-24">
              {/* Spots */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                    <Users size={14} /> {filled} / {activity.spotsTotal} spots filled
                  </span>
                  <span className={clsx(
                    'text-sm font-bold',
                    isAlmostFull ? 'text-gather-600' : 'text-sage-600'
                  )}>
                    {activity.spotsLeft} left
                  </span>
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all duration-700', isAlmostFull ? 'bg-gather-500' : 'bg-sage-400')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isAlmostFull && !joined && (
                  <p className="text-xs text-gather-600 mt-2 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> Almost full — {activity.spotsLeft} spot{activity.spotsLeft !== 1 ? 's' : ''} left
                  </p>
                )}
              </div>

              {/* Attendees */}
              <div className="flex -space-x-2 mb-5">
                {activity.attendees.slice(0, 6).map((a, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-gather-300 to-gather-500 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                  >
                    {a}
                  </div>
                ))}
                {joined && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    You
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {showConfirm ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-sage-600 font-semibold animate-pulse-soft">
                    <CheckCircle2 size={20} />
                    Saving your spot...
                  </div>
                ) : joined ? (
                  <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sage-700 font-semibold mb-1">
                      <CheckCircle2 size={18} />
                      You're in!
                    </div>
                    <p className="text-xs text-sage-600">
                      We'll email the exact address 24h before. See you there!
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={activity.spotsLeft === 0}
                    className={clsx(
                      'w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95',
                      activity.spotsLeft === 0
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'btn-primary'
                    )}
                  >
                    {activity.spotsLeft === 0 ? 'Fully booked — join waitlist' : 'Join this gathering'}
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-medium border transition-all',
                      saved ? 'bg-gather-50 border-gather-200 text-gather-700' : 'border-cream-300 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <Heart size={14} className={saved ? 'fill-gather-500 text-gather-500' : ''} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-medium border border-cream-300 text-stone-600 hover:border-stone-300 transition-all">
                    <Share2 size={14} />
                    Share
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-400 text-center mt-4">
                Free to join. Cancel anytime. No account required.
              </p>
            </div>

            {/* Safety note */}
            <div className="bg-sage-50 border border-sage-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-sage-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-sage-800 mb-1">Community trust</div>
                  <p className="text-xs text-sage-700 leading-relaxed">
                    All hosts are identity-verified. Gatherings at private homes include a verified address check. 24/7 support available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-stone-900 mb-5">
              More {cat.label.toLowerCase()} gatherings
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map(a => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Shield({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
