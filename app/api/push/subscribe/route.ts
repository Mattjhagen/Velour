import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { subscription, city } = await req.json()
    const { endpoint, keys } = subscription

    const { error } = await supabase.from('push_subscriptions').upsert(
      { endpoint, p256dh: keys.p256dh, auth: keys.auth, city: city || null },
      { onConflict: 'endpoint' }
    )

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('push subscribe error', err)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json()
    await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('push unsubscribe error', err)
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
  }
}
