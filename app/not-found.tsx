import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">🗺️</div>
      <h1 className="font-display text-5xl text-stone-900 font-bold mb-3">
        Lost in the neighborhood?
      </h1>
      <p className="text-stone-500 text-lg max-w-md mb-10 leading-relaxed">
        This page doesn&apos;t exist &mdash; but a gathering near you probably does.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/discover" className="btn-primary flex items-center gap-2">
          <Search size={16} /> Browse gatherings
        </Link>
        <Link href="/" className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> Go home
        </Link>
      </div>
    </div>
  )
}
