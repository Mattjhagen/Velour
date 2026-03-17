import { NextResponse } from 'next/server'
import { ACTIVITIES } from '../data/activities'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://velour.com'

function url(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function getApprovedGatherings(): Promise<{ id: string; created_at: string }[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('gatherings')
      .select('id, created_at')
      .eq('status', 'approved')
    return data ?? []
  } catch {
    return []
  }
}

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  const dbGatherings = await getApprovedGatherings()

  const staticUrls = [
    url(BASE_URL,                          now, 'daily',   '1.0'),
    url(`${BASE_URL}/discover`,            now, 'hourly',  '0.9'),
    url(`${BASE_URL}/onboarding`,          now, 'weekly',  '0.8'),
    url(`${BASE_URL}/create`,              now, 'weekly',  '0.7'),
    url(`${BASE_URL}/how-it-works`,        now, 'monthly', '0.6'),
    url(`${BASE_URL}/manifesto`,           now, 'monthly', '0.5'),
    url(`${BASE_URL}/privacy`,             now, 'yearly',  '0.3'),
    url(`${BASE_URL}/terms`,               now, 'yearly',  '0.3'),
  ]

  const dbUrls = dbGatherings.map(g =>
    url(`${BASE_URL}/activity/${g.id}`, g.created_at.split('T')[0], 'weekly', '0.8')
  )

  const mockUrls = ACTIVITIES.map(a =>
    url(`${BASE_URL}/activity/${a.id}`, now, 'daily', '0.7')
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dbUrls, ...mockUrls].join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
