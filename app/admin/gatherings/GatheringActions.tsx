'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Check, X, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GatheringActions({ id, status }: { id: string; status: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function updateStatus(newStatus: string) {
    setLoading(true)
    await supabase.from('gatherings').update({ status: newStatus }).eq('id', id)
    router.refresh()
    setLoading(false)
  }

  async function deleteGathering() {
    if (!confirm('Delete this gathering? This cannot be undone.')) return
    setLoading(true)
    await supabase.from('gatherings').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {status !== 'approved' && (
        <button
          onClick={() => updateStatus('approved')}
          disabled={loading}
          className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Check size={13} /> Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button
          onClick={() => updateStatus('rejected')}
          disabled={loading}
          className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <X size={13} /> Reject
        </button>
      )}
      <button
        onClick={deleteGathering}
        disabled={loading}
        className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <Trash2 size={13} /> Delete
      </button>
    </div>
  )
}
