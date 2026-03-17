import { createSupabaseAdminClient } from '../../../lib/supabase-server'
import ReportActions from './ReportActions'

export default async function AdminReports() {
  const supabase = createSupabaseAdminClient()
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    resolved: 'bg-green-500/20 text-green-400',
    dismissed: 'bg-stone-700 text-stone-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Reports</h1>
        <p className="text-stone-400 text-sm">{reports?.filter((r: any) => r.status === 'pending').length ?? 0} pending</p>
      </div>

      <div className="space-y-3">
        {!reports?.length && <p className="text-stone-500 text-sm">No reports yet.</p>}
        {reports?.map((r: any) => (
          <div key={r.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span>
                  <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">{r.type}</span>
                  <span className="text-stone-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-stone-200 text-sm font-medium">{r.reason}</p>
                {r.target_id && <p className="text-stone-500 text-xs mt-1">Target ID: {r.target_id}</p>}
                {r.reporter_email && <p className="text-stone-500 text-xs">Reporter: {r.reporter_email}</p>}
                {r.notes && <p className="text-stone-400 text-xs mt-2 italic">Notes: {r.notes}</p>}
              </div>
              {r.status === 'pending' && <ReportActions id={r.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
