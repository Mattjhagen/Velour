import { createSupabaseAdminClient } from '../../../lib/supabase-server'
import BanActions from './BanActions'

export default async function AdminBanned() {
  const supabase = createSupabaseAdminClient()
  const { data: banned } = await supabase
    .from('banned_emails')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Banned Emails</h1>
          <p className="text-stone-400 text-sm">{banned?.length ?? 0} banned</p>
        </div>
        <BanActions mode="add" />
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800">
              <th className="text-left px-4 py-3 text-stone-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-stone-400 font-medium hidden sm:table-cell">Reason</th>
              <th className="text-left px-4 py-3 text-stone-400 font-medium hidden md:table-cell">Banned</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!banned?.length && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-500">No banned emails.</td></tr>
            )}
            {banned?.map((b: any) => (
              <tr key={b.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                <td className="px-4 py-3 text-stone-200 font-mono text-xs">{b.email}</td>
                <td className="px-4 py-3 text-stone-400 hidden sm:table-cell">{b.reason || '—'}</td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{new Date(b.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <BanActions mode="remove" id={b.id} email={b.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
