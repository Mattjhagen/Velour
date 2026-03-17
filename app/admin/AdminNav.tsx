'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { LayoutDashboard, Calendar, Users, Ban, Flag, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gatherings', label: 'Gatherings', icon: Calendar },
  { href: '/admin/waitlist', label: 'Waitlist', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/banned', label: 'Banned', icon: Ban },
]

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b border-stone-800 bg-stone-900">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 bg-velour-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-stone-700 text-white'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-500 text-xs hidden sm:block">{userEmail}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-sm px-2 py-1.5 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
