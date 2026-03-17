'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WaitlistActions({ id, email }: { id: string; email: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function remove() {
    if (!confirm(`Remove ${email} from waitlist?`)) return
    setLoading(true)
    await supabase.from('waitlist').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={remove} disabled={loading} className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1">
      <Trash2 size={14} />
    </button>
  )
}
