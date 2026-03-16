'use client'

import { useState, useMemo } from 'react'
import { MapPin, SlidersHorizontal, Search, X, Calendar, Users } from 'lucide-react'
import Nav from '../components/Nav'
import ActivityCard from '../components/ActivityCard'
import { ACTIVITIES, CATEGORY_META, Category } from '../data/activities'
import clsx from 'clsx'

const WHEN_FILTERS = ['Any time', 'Today', 'This week', 'This weekend', 'Next week']
const SIZE_FILTERS = ['Any size', 'Small (≤6)', 'Medium (7–12)', 'Large (13+)']

export default function DiscoverPage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<Category | 'all'>('all')
  const [whenFilter, setWhenFilter] = useState('Any time')
  const [sizeFilter, setSizeFilter] = useState('Any size')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return ACTIVITIES.filter(a => {
      if (selectedCat !== 'all' && a.category !== selectedCat) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !a.title.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q) &&
          !a.location.neighborhood.toLowerCase().includes(q) &&
          !a.tags.some(t => t.includes(q))
        ) return false
      }
      if (sizeFilter === 'Small (≤6)' && a.spotsTotal > 6) return false
      if (sizeFilter === 'Medium (7–12)' && (a.spotsTotal < 7 || a.spotsTotal > 12)) return false
      if (sizeFilter === 'Large (13+)' && a.spotsTotal < 13) return false
      return true
    })
  }, [search, selectedCat, whenFilter, sizeFilter])

  const clearFilters = () => {
    setSearch('')
    setSelectedCat('all')
    setWhenFilter('Any time')
    setSizeFilter('Any size')
  }

  const hasFilters = search || selectedCat !== 'all' || whenFilter !== 'Any time' || sizeFilter !== 'Any size'

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />

      {/* Header */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-stone-900 font-bold">
                Gatherings in Portland
              </h1>
              <p className="text-stone-500 mt-1 flex items-center gap-1.5">
                <MapPin size={14} className="text-gather-500" />
                {ACTIVITIES.length} happening this month · curated, not algorithmic
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all',
                  showFilters
                    ? 'bg-gather-500 text-white border-gather-500'
                    : 'bg-white border-cream-300 text-stone-600 hover:border-gather-300'
                )}
              >
                <SlidersHorizontal size={15} />
                Filters {hasFilters && <span className="w-2 h-2 bg-gather-300 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search activities, neighborhoods, keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-cream-50 rounded-2xl border border-cream-200 flex flex-wrap gap-4">
              <div>
                <div className="section-label mb-2">When</div>
                <div className="flex flex-wrap gap-2">
                  {WHEN_FILTERS.map(w => (
                    <button
                      key={w}
                      onClick={() => setWhenFilter(w)}
                      className={clsx(
                        'text-sm px-3 py-1.5 rounded-xl border transition-all',
                        whenFilter === w
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-cream-300 text-stone-600 hover:border-stone-300'
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="section-label mb-2">Group size</div>
                <div className="flex flex-wrap gap-2">
                  {SIZE_FILTERS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSizeFilter(s)}
                      className={clsx(
                        'text-sm px-3 py-1.5 rounded-xl border transition-all',
                        sizeFilter === s
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-cream-300 text-stone-600 hover:border-stone-300'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="self-end text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1">
                  <X size={13} /> Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-0">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={clsx(
                'shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                selectedCat === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white border-cream-200 text-stone-600 hover:border-stone-300'
              )}
            >
              All
            </button>
            {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedCat(key)}
                className={clsx(
                  'shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5',
                  selectedCat === key
                    ? `${meta.bg} ${meta.color} border-transparent`
                    : 'bg-white border-cream-200 text-stone-600 hover:border-stone-300'
                )}
              >
                {meta.emoji} {meta.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="font-display text-2xl text-stone-700 mb-2">Nothing here yet</h3>
            <p className="text-stone-500 mb-6">Try different filters, or be the first to host this kind of gathering.</p>
            <a href="/create" className="btn-primary inline-flex">Host a gathering</a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-stone-500">
                {filtered.length} gathering{filtered.length !== 1 ? 's' : ''} found
                {hasFilters && ' · filtered'}
              </p>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Calendar size={13} />
                Sorted by date
              </div>
            </div>

            {/* Featured row */}
            {!hasFilters && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="section-label">Featured this week</span>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {filtered.filter(a => a.isFeatured).map(a => (
                    <ActivityCard key={a.id} activity={a} featured />
                  ))}
                  {filtered.filter(a => a.isNew && !a.isFeatured).slice(0, 2).map(a => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              </div>
            )}

            {/* All results */}
            <div>
              {!hasFilters && (
                <div className="section-label mb-4">All gatherings</div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(hasFilters ? filtered : filtered.filter(a => !a.isFeatured)).map(a => (
                  <ActivityCard key={a.id} activity={a} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state CTA */}
        <div className="mt-16 bg-stone-900 rounded-3xl p-8 text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-display text-2xl text-white mb-2">Don't see what you're looking for?</h3>
          <p className="text-stone-400 mb-6 max-w-md mx-auto">
            Host your own gathering. It takes 5 minutes. You'd be surprised who shows up.
          </p>
          <a href="/create" className="btn-primary inline-flex items-center gap-2">
            Host a gathering
          </a>
        </div>
      </div>
    </div>
  )
}
