import { createSupabaseAdminClient } from '../../../lib/supabase-server'
import GatheringActions from './GatheringActions'

export default async function AdminGatherings() {
  const supabase = createSupabaseAdminClient()
  const { data: gatherings } = await supabase
    .from('gatherings')
    .select('*')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Gatherings</h1>
        <p className="text-stone-400 text-sm">{gatherings?.length ?? 0} total</p>
      </div>

      <div className="space-y-3">
        {!gatherings?.length && (
          <p className="text-stone-500 text-sm">No gatherings yet.</p>
        )}
        {gatherings?.map((g: any) => (
          <div key={g.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[g.status] ?? statusColor.pending}`}>
                    {g.status}
                  </span>
                  <span className="text-stone-500 text-xs">{new Date(g.created_at).toLocaleDateString()}</span>
                  {g.category && <span className="text-stone-500 text-xs">{g.category}</span>}
                </div>
                <h3 className="text-white font-semibold text-lg truncate">{g.title}</h3>
                <p className="text-stone-400 text-sm mt-1 line-clamp-2">{g.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-stone-500">
                  {g.location && <span>📍 {g.location}</span>}
                  {g.host_name && <span>👤 {g.host_name}</span>}
                  {g.host_email && <span>✉️ {g.host_email}</span>}
                  {g.max_spots && <span>👥 {g.max_spots} spots</span>}
                </div>
              </div>
              <GatheringActions id={g.id} status={g.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
