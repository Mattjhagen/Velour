'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Clock, Users, Repeat2, CheckCircle2,
  Share2, Heart, ExternalLink, AlertCircle, Info, Loader2, Shield,
  Video, CalendarPlus
} from 'lucide-react'
import Nav from '../../components/Nav'
import ActivityCard from '../../components/ActivityCard'
import { ACTIVITIES, CATEGORY_META, Activity } from '../../data/activities'
import { supabase, submitRSVP } from '../../../lib/supabase'
import { useToast } from '../../components/Toast'
import clsx from 'clsx'

function dbToActivity(g: any): Activity {
  const cat = (g.category ?? 'community') as Activity['category']
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    category: cat,
    emoji: g.is_online ? '💻' : (CATEGORY_META[cat]?.emoji ?? '🤝'),
    host: { name: g.host_name ?? 'Host', avatar: (g.host_name ?? 'H')[0].toUpperCase(), verified: false },
    location: {
      neighborhood: g.is_online ? 'Online' : (g.location ?? 'Omaha'),
      city: g.is_online ? 'Online' : 'Omaha',
      venueName: g.is_online ? undefined : (g.venue_name ?? undefined),
    },
    dateLabel: g.date ?? '',
    time: g.time ?? '',
    spotsTotal: g.max_spots ?? 10,
    spotsLeft: g.max_spots ?? 10,
    attendees: [],
    recurring: g.recurring ?? undefined,
    tags: g.tags ?? [],
    isNew: true,
    hostEmail: g.host_email,
    isOnline: g.is_online,
    meetingUrl: g.meeting_url,
  }
}

function buildGoogleCalendarUrl(activity: Activity): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const title = encodeURIComponent(activity.title)
  const loc = activity.isOnline
    ? encodeURIComponent(activity.meetingUrl ?? 'Online')
    : encodeURIComponent(`${activity.location.venueName ?? ''} ${activity.location.neighborhood}, ${activity.location.city}`.trim())
  const details = encodeURIComponent(activity.description + (activity.isOnline && activity.meetingUrl ? `\n\nJoin online: ${activity.meetingUrl}` : ''))
  return `${base}&text=${title}&location=${loc}&details=${details}`
}

function downloadICS(activity: Activity) {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  const location = activity.isOnline
    ? (activity.meetingUrl ?? 'Online')
    : `${activity.location.venueName ?? ''} ${activity.location.neighborhood}, ${activity.location.city}`.trim()
  const description = activity.description + (activity.isOnline && activity.meetingUrl ? `\\nJoin online: ${activity.meetingUrl}` : '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VelourConnect//EN',
    'BEGIN:VEVENT',
    `UID:${activity.id}@velourconnect.com`,
    `DTSTAMP:${now}`,
    `SUMMARY:${activity.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${now}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${activity.title.replace(/[^a-z0-9]/gi, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [activity, setActivity] = useState<Activity | null | undefined>(
    ACTIVITIES.find(a => a.id === params.id)
  )
  const [loadingActivity, setLoadingActivity] = useState(!ACTIVITIES.find(a => a.id === params.id))

  const [joined, setJoined] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showRSVPForm, setShowRSVPForm] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [showCalendarMenu, setShowCalendarMenu] = useState(false)

  useEffect(() => {
    if (activity) return
    supabase
      .from('gatherings')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => {
        setActivity(data ? dbToActivity(data) : null)
        setLoadingActivity(false)
      })
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingActivity) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-velour-400" />
      </div>
    )
  }

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

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName.trim() || !rsvpEmail.trim()) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(rsvpEmail)) {
      toast('Please enter a valid email address.', { type: 'error' })
      return
    }
    setRsvpLoading(true)
    try {
      const result = await submitRSVP({ activity_id: activity.id, first_name: rsvpName.trim(), email: rsvpEmail.trim() })
      if (result.alreadyJoined) {
        toast("You're already signed up!", { description: "We'll send you the address 24h before." })
      } else {
        toast("You're in! 🎉", { description: "Check your email for confirmation." })
        fetch('/api/email/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attendeeName: rsvpName.trim(),
            attendeeEmail: rsvpEmail.trim(),
            hostName: activity.host.name,
            hostEmail: activity.hostEmail ?? null,
            gatheringTitle: activity.title,
            gatheringDate: activity.dateLabel,
            gatheringTime: activity.time,
            gatheringLocation: activity.isOnline ? 'Online' : `${activity.location.neighborhood}, ${activity.location.city}`,
          }),
        }).catch(console.error)
      }
      setJoined(true)
      setShowRSVPForm(false)
    } catch {
      toast('Something went wrong. Please try again.', { type: 'error' })
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: activity.title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <div className="card p-7">
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className={clsx('tag', cat.bg, cat.color)}>{cat.emoji} {cat.label}</span>
                {activity.isOnline && (
                  <span className="tag bg-blue-100 text-blue-700 flex items-center gap-1">
                    <Video size={10} /> Online
                  </span>
                )}
                {activity.isNew && <span className="tag bg-velour-100 text-velour-700">New</span>}
                {activity.recurring && (
                  <span className="tag bg-sage-100 text-sage-700 flex items-center gap-1">
                    <Repeat2 size={10} /> Recurring
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-stone-900 font-bold mb-4 leading-snug">
                {activity.emoji} {activity.title}
              </h1>
              <p className="text-stone-600 leading-relaxed text-[15px] mb-6">{activity.description}</p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-cream-50 rounded-2xl p-4">
                  <Clock size={18} className="text-velour-500 mt-0.5 shrink-0" />
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

                {activity.isOnline ? (
                  <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4">
                    <Video size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-0.5">Where</div>
                      <div className="font-semibold text-stone-800">Online Event</div>
                      {joined && activity.meetingUrl ? (
                        <a
                          href={activity.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <ExternalLink size={11} /> Join meeting
                        </a>
                      ) : (
                        <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <Info size={11} /> Link shared after joining
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 bg-cream-50 rounded-2xl p-4">
                    <MapPin size={18} className="text-velour-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-0.5">Where</div>
                      {activity.location.venueName && <div className="font-semibold text-stone-800">{activity.location.venueName}</div>}
                      <div className="text-sm text-stone-600">{activity.location.neighborhood}, {activity.location.city}</div>
                      <div className="text-xs text-velour-600 mt-1 flex items-center gap-1">
                        <ExternalLink size={11} /> Exact address sent on joining
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Host */}
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
                      <span className="text-xs bg-velour-100 text-velour-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-500 mt-0.5">Member since 2024 &middot; 12 gatherings hosted</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-cream-50 rounded-2xl border border-cream-100">
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <Info size={15} className="text-stone-400 mt-0.5 shrink-0" />
                  Hosts on Velour are real people in your community. We verify identities and read every review.
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg text-stone-800 mb-4">What to expect</h2>
              <ul className="space-y-3">
                {[
                  activity.isOnline
                    ? "You'll receive the meeting link 24h before the event via email"
                    : "You'll receive the exact address 24h before the event via email",
                  "The host will be there 10 minutes early to welcome you",
                  "No need to know anyone — that's kind of the point",
                  "Photos only with everyone's consent. No posting without permission.",
                  "If you can't make it, please cancel at least 2h before so others can join",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                    <CheckCircle2 size={16} className="text-sage-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {activity.tags.map(tag => (
                <span key={tag} className="bg-white border border-cream-200 text-stone-600 text-sm px-4 py-1.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              {/* Spots */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                    <Users size={14} /> {filled} / {activity.spotsTotal} spots filled
                  </span>
                  <span className={clsx('text-sm font-bold', isAlmostFull ? 'text-velour-600' : 'text-sage-600')}>
                    {activity.spotsLeft} left
                  </span>
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all duration-700', isAlmostFull ? 'bg-velour-500' : 'bg-sage-400')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isAlmostFull && !joined && (
                  <p className="text-xs text-velour-600 mt-2 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> Almost full &mdash; {activity.spotsLeft} spot{activity.spotsLeft !== 1 ? 's' : ''} left
                  </p>
                )}
              </div>

              {/* Attendees */}
              <div className="flex -space-x-2 mb-5">
                {activity.attendees.slice(0, 6).map((a, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-velour-300 to-velour-500 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    {a}
                  </div>
                ))}
                {joined && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    You
                  </div>
                )}
              </div>

              {/* RSVP flow */}
              {joined ? (
                <div className="space-y-3">
                  <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sage-700 font-semibold mb-1">
                      <CheckCircle2 size={18} /> You&apos;re in!
                    </div>
                    <p className="text-xs text-sage-600">
                      {activity.isOnline
                        ? "We'll email the meeting link 24h before. See you online!"
                        : "We'll email the exact address 24h before. See you there!"}
                    </p>
                  </div>

                  {/* Add to Calendar */}
                  <div className="relative">
                    <button
                      onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium border border-velour-200 text-velour-700 bg-velour-50 hover:bg-velour-100 transition-all"
                    >
                      <CalendarPlus size={14} /> Add to Calendar
                    </button>
                    {showCalendarMenu && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden z-10">
                        <a
                          href={buildGoogleCalendarUrl(activity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowCalendarMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-cream-50 transition-colors"
                        >
                          <span className="text-base">📅</span> Google Calendar
                        </a>
                        <button
                          onClick={() => { downloadICS(activity); setShowCalendarMenu(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-cream-50 transition-colors border-t border-cream-100"
                        >
                          <span className="text-base">📆</span> Download .ics (Apple / Outlook)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : showRSVPForm ? (
                <form onSubmit={handleRSVP} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={rsvpName}
                    onChange={e => setRsvpName(e.target.value)}
                    required
                    className="input-field text-sm"
                    autoFocus
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={rsvpEmail}
                    onChange={e => setRsvpEmail(e.target.value)}
                    required
                    className="input-field text-sm"
                  />
                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                  >
                    {rsvpLoading ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={15} /> Confirm my spot</>}
                  </button>
                  <button type="button" onClick={() => setShowRSVPForm(false)} className="w-full text-xs text-stone-400 hover:text-stone-600 py-1">
                    Cancel
                  </button>
                  <p className="text-[11px] text-stone-400 text-center">
                    {activity.isOnline
                      ? "We'll email the meeting link 24h before. No spam."
                      : "We'll email the address 24h before. That's it. No spam."}
                  </p>
                </form>
              ) : (
                <button
                  onClick={() => setShowRSVPForm(true)}
                  disabled={activity.spotsLeft === 0}
                  className={clsx(
                    'w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95',
                    activity.spotsLeft === 0 ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'btn-primary'
                  )}
                >
                  {activity.spotsLeft === 0 ? 'Fully booked — join waitlist' : 'Join this gathering'}
                </button>
              )}

              {!showRSVPForm && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-medium border transition-all',
                      saved ? 'bg-velour-50 border-velour-200 text-velour-700' : 'border-cream-300 text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <Heart size={14} className={saved ? 'fill-velour-500 text-velour-500' : ''} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-medium border border-cream-300 text-stone-600 hover:border-stone-300 transition-all"
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              )}

              <p className="text-xs text-stone-400 text-center mt-4">Free to join. Cancel anytime.</p>
            </div>

            {/* Safety */}
            <div className="bg-sage-50 border border-sage-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-sage-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-sage-800 mb-1">Community trust</div>
                  <p className="text-xs text-sage-700 leading-relaxed">
                    All hosts are identity-verified. Exact addresses shared only with confirmed attendees. 24/7 support at safety@velour.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-stone-900 mb-5">More {cat.label.toLowerCase()} gatherings</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map(a => <ActivityCard key={a.id} activity={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
