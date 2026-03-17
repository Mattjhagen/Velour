'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  mode: 'add' | 'remove'
  id?: string
  email?: string
}

export default function BanActions({ mode, id, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [reason, setReason] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function ban() {
    if (!newEmail) return
    setLoading(true)
    await supabase.from('banned_emails').insert({ email: newEmail.toLowerCase().trim(), reason })
    setShowForm(false)
    setNewEmail('')
    setReason('')
    router.refresh()
    setLoading(false)
  }

  async function unban() {
    if (!confirm(`Unban ${email}?`)) return
    setLoading(true)
    await supabase.from('banned_emails').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  if (mode === 'remove') {
    return (
      <button onClick={unban} disabled={loading} className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1">
        <Trash2 size={14} />
      </button>
    )
  }

  return (
    <div>
      {showForm ? (
        <div className="flex flex-col gap-2 bg-stone-800 rounded-xl p-3 min-w-64">
          <input
            type="email"
            placeholder="email@example.com"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className="bg-stone-700 border border-stone-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-velour-500"
          />
          <input
            type="text"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="bg-stone-700 border border-stone-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-velour-500"
          />
          <div className="flex gap-2">
            <button onClick={ban} disabled={loading} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors disabled:opacity-50">
              Ban
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs font-medium py-1.5 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} /> Ban email
        </button>
      )}
    </div>
  )
}
