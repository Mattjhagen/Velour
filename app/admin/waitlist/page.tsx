import { createSupabaseAdminClient } from '../../../lib/supabase-server'
import WaitlistActions from './WaitlistActions'

export default async function AdminWaitlist() {
  const supabase = createSupabaseAdminClient()
  const { data: entries } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Waitlist</h1>
        <p className="text-stone-400 text-sm">{entries?.length ?? 0} signups</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800">
              <th className="text-left px-4 py-3 text-stone-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-stone-400 font-medium hidden sm:table-cell">City</th>
              <th className="text-left px-4 py-3 text-stone-400 font-medium hidden md:table-cell">Signed up</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!entries?.length && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-500">No signups yet.</td></tr>
            )}
            {entries?.map((e: any) => (
              <tr key={e.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors">
                <td className="px-4 py-3 text-stone-200">{e.email}</td>
                <td className="px-4 py-3 text-stone-400 hidden sm:table-cell">{e.city || '—'}</td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{new Date(e.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <WaitlistActions id={e.id} email={e.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
