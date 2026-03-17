'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Menu, X, Plus, Bell } from 'lucide-react'

export default function Nav({ minimal = false }: { minimal?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-cream-200/60 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-velour-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">V</span>
          </div>
          <span className="font-display font-semibold text-lg text-stone-900 hidden sm:block">Velour</span>
        </Link>

        {!minimal && (
          <>
            {/* Location pill */}
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-stone-600 bg-cream-100 px-3 py-1.5 rounded-full hover:bg-cream-200 transition-colors">
              <MapPin size={13} className="text-velour-500" />
              <span className="font-medium">Portland, OR</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/discover" className="btn-ghost text-sm">Discover</Link>
              <Link href="/how-it-works" className="btn-ghost text-sm">How it works</Link>
              <Link href="/manifesto" className="btn-ghost text-sm">Why we exist</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button className="relative p-2 rounded-xl hover:bg-cream-100 transition-colors text-stone-500 hover:text-stone-700">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-velour-500 rounded-full" />
              </button>
              <Link
                href="/create"
                className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">Host a gathering</span>
                <span className="sm:hidden">Host</span>
              </Link>
              <button
                className="sm:hidden p-2 rounded-xl hover:bg-cream-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {!minimal && mobileOpen && (
        <div className="sm:hidden border-t border-cream-200 bg-white/95 backdrop-blur px-4 py-4 flex flex-col gap-1">
          <Link href="/discover" className="btn-ghost text-sm justify-start" onClick={() => setMobileOpen(false)}>Discover</Link>
          <Link href="/how-it-works" className="btn-ghost text-sm justify-start" onClick={() => setMobileOpen(false)}>How it works</Link>
          <Link href="/manifesto" className="btn-ghost text-sm justify-start" onClick={() => setMobileOpen(false)}>Why we exist</Link>
          <div className="mt-2 pt-2 border-t border-cream-100 flex items-center gap-1.5 text-sm text-stone-600">
            <MapPin size={13} className="text-velour-500" />
            <span>Portland, OR — change</span>
          </div>
        </div>
      )}
    </nav>
  )
}
