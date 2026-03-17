import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WaitlistEntry = {
  email: string
  city?: string
  interests?: string[]
  referrer?: string
}

export type RSVPEntry = {
  activity_id: string
  first_name: string
  email: string
}

export async function joinWaitlist(entry: WaitlistEntry) {
  const { error } = await supabase.from('waitlist').insert(entry)
  if (error) {
    if (error.code === '23505') return { success: true, alreadyJoined: true }
    throw error
  }
  return { success: true, alreadyJoined: false }
}

export async function submitRSVP(entry: RSVPEntry) {
  const { error } = await supabase.from('rsvps').insert(entry)
  if (error) {
    if (error.code === '23505') return { success: true, alreadyJoined: true }
    throw error
  }
  return { success: true, alreadyJoined: false }
}

export async function getRSVPCount(activityId: string) {
  const { count } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('activity_id', activityId)
  return count ?? 0
}

export async function requestCity(city: string, email?: string) {
  const { error } = await supabase.from('city_requests').insert({ city, email })
  if (error && error.code !== '23505') throw error
  return { success: true }
}
