'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReportActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function update(status: string) {
    setLoading(true)
    await supabase.from('reports').update({ status }).eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => update('resolved')}
        disabled={loading}
        className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <Check size={13} /> Resolve
      </button>
      <button
        onClick={() => update('dismissed')}
        disabled={loading}
        className="flex items-center gap-1 bg-stone-700 hover:bg-stone-600 text-stone-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <X size={13} /> Dismiss
      </button>
    </div>
  )
}
