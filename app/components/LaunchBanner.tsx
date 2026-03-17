'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

export default function LaunchBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative bg-stone-950 text-white z-40">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="text-yellow-400 font-bold text-base leading-none">
          🚀
        </span>
        <span className="text-stone-300">
          We&apos;re live on{' '}
          <a
            href="https://www.producthunt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold underline underline-offset-2 hover:text-gather-300 transition-colors inline-flex items-center gap-1"
          >
            Product Hunt
            <ExternalLink size={11} />
          </a>
          {' '}today &mdash; if Gather means something to you, an upvote helps enormously.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
          aria-label="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
