'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { joinWaitlist } from '../../lib/supabase'
import { useToast } from './Toast'
import clsx from 'clsx'

type Variant = 'hero' | 'inline' | 'dark'

export default function WaitlistForm({
  variant = 'inline',
  placeholder = 'Enter your email',
  ctaText = 'Get early access',
  city,
}: {
  variant?: Variant
  placeholder?: string
  ctaText?: string
  city?: string
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading || done) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast('Please enter a valid email address', { type: 'error' })
      return
    }

    setLoading(true)
    try {
      const result = await joinWaitlist({
        email,
        city,
        referrer: typeof window !== 'undefined' ? document.referrer || 'direct' : 'direct',
      })

      if (result.alreadyJoined) {
        toast("You're already on the list!", { description: "We'll be in touch soon." })
      } else {
        toast('You\'re on the list!', {
          description: 'We\'ll let you know when Gather comes to your city.',
        })
      }
      setDone(true)
    } catch {
      toast('Something went wrong. Please try again.', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className={clsx(
        'flex items-center gap-3 py-3 px-5 rounded-2xl font-medium text-sm',
        variant === 'dark' ? 'bg-stone-800 text-sage-300' : 'bg-sage-50 text-sage-700 border border-sage-200'
      )}>
        <CheckCircle2 size={18} className="text-sage-500 shrink-0" />
        <span>You&apos;re on the list &mdash; we&apos;ll be in touch!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('flex gap-2', variant === 'hero' && 'flex-col sm:flex-row')}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className={clsx(
          'flex-1 rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all',
          variant === 'dark'
            ? 'bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:border-gather-500'
            : 'bg-white border border-cream-200 text-stone-800 placeholder-stone-400 focus:border-gather-400 focus:ring-2 focus:ring-gather-100',
          variant === 'hero' && 'text-base py-4 px-5'
        )}
      />
      <button
        type="submit"
        disabled={loading}
        className={clsx(
          'flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all active:scale-95 whitespace-nowrap',
          variant === 'hero' ? 'btn-primary text-base px-8 py-4' : 'btn-primary text-sm py-3 px-5',
          loading && 'opacity-70 cursor-not-allowed'
        )}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            {ctaText}
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  )
}
