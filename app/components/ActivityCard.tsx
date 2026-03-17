'use client'

import Link from 'next/link'
import { MapPin, Clock, Users, Repeat2, Sparkles } from 'lucide-react'
import { Activity, CATEGORY_META } from '../data/activities'
import clsx from 'clsx'

function AvatarStack({ attendees, spotsLeft, spotsTotal }: {
  attendees: string[]
  spotsLeft: number
  spotsTotal: number
}) {
  const filled = spotsTotal - spotsLeft
  const pct = (filled / spotsTotal) * 100
  const isAlmostFull = spotsLeft <= 2

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {attendees.slice(0, 4).map((a, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-velour-300 to-velour-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
            >
              {a}
            </div>
          ))}
          {attendees.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-stone-600">
              +{attendees.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-stone-500">
          {filled} joined
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', isAlmostFull ? 'bg-velour-500' : 'bg-sage-400')}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={clsx('text-xs font-semibold', isAlmostFull ? 'text-velour-600' : 'text-stone-500')}>
          {spotsLeft} left
        </span>
      </div>
    </div>
  )
}

export default function ActivityCard({ activity, featured = false }: { activity: Activity; featured?: boolean }) {
  const cat = CATEGORY_META[activity.category]

  return (
    <Link href={`/activity/${activity.id}`} className="block group">
      <div className={clsx(
        'card p-5 flex flex-col gap-4 group-hover:-translate-y-0.5 transition-all duration-300',
        featured && 'ring-2 ring-velour-400 ring-offset-2'
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl leading-none mt-0.5">{activity.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 mb-1">
                <span className={clsx('tag text-[10px]', cat.bg, cat.color)}>
                  {cat.emoji} {cat.label}
                </span>
                {activity.isNew && (
                  <span className="tag text-[10px] bg-velour-100 text-velour-700">
                    <Sparkles size={9} /> New
                  </span>
                )}
                {activity.isFeatured && (
                  <span className="tag text-[10px] bg-amber-100 text-amber-700">
                    ✨ Featured
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-velour-700 transition-colors">
                {activity.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
          {activity.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-velour-400" />
            {activity.dateLabel} · {activity.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-velour-400" />
            {activity.location.venueName ?? activity.location.neighborhood}
          </span>
          {activity.recurring && (
            <span className="flex items-center gap-1">
              <Repeat2 size={12} className="text-sage-500" />
              {activity.recurring}
            </span>
          )}
        </div>

        {/* Host */}
        <div className="flex items-center gap-2 pt-1 border-t border-cream-100">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center text-[10px] font-bold text-white">
            {activity.host.avatar}
          </div>
          <span className="text-xs text-stone-500">
            Hosted by <span className="font-medium text-stone-700">{activity.host.name}</span>
            {activity.host.verified && (
              <span className="ml-1 text-velour-500" title="Verified host">✓</span>
            )}
          </span>
        </div>

        {/* Spots */}
        <AvatarStack
          attendees={activity.attendees}
          spotsLeft={activity.spotsLeft}
          spotsTotal={activity.spotsTotal}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {activity.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] bg-cream-100 text-stone-600 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
