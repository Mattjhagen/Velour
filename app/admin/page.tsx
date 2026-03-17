import { createSupabaseAdminClient } from '../../lib/supabase-server'
import { Users, Calendar, Flag, Ban, Clock } from 'lucide-react'

async function getStats() {
  const supabase = createSupabaseAdminClient()
  const [waitlist, rsvps, gatherings, reports, banned] = await Promise.all([
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase.from('rsvps').select('*', { count: 'exact', head: true }),
    supabase.from('gatherings').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('banned_emails').select('*', { count: 'exact', head: true }),
  ])
  return {
    waitlist: waitlist.count ?? 0,
    rsvps: rsvps.count ?? 0,
    gatherings: gatherings.count ?? 0,
    pendingReports: reports.count ?? 0,
    banned: banned.count ?? 0,
  }
}

async function getRecentReports() {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, reports] = await Promise.all([getStats(), getRecentReports()])

  const statCards = [
    { label: 'Waitlist', value: stats.waitlist, icon: Users, color: 'text-blue-400' },
    { label: 'RSVPs', value: stats.rsvps, icon: Calendar, color: 'text-green-400' },
    { label: 'Gatherings', value: stats.gatherings, icon: Clock, color: 'text-velour-400' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: Flag, color: 'text-amber-400', alert: stats.pendingReports > 0 },
    { label: 'Banned Emails', value: stats.banned, icon: Ban, color: 'text-red-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-stone-400 text-sm">Velour admin panel</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, alert }) => (
          <div key={label} className={`bg-stone-900 rounded-2xl p-4 border ${alert ? 'border-amber-500/50' : 'border-stone-800'}`}>
            <Icon size={18} className={`${color} mb-3`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-stone-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {reports.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Flag size={16} className="text-amber-400" />
            Pending reports
          </h2>
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">{r.type}</span>
                    <span className="text-stone-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-stone-200 text-sm">{r.reason}</p>
                  {r.reporter_email && <p className="text-stone-500 text-xs mt-1">From: {r.reporter_email}</p>}
                </div>
                <a href="/admin/reports" className="text-velour-400 text-xs hover:underline shrink-0">Review →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
