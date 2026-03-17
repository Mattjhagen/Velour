import { MetadataRoute } from 'next'
import { ACTIVITIES } from './data/activities'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600 // regenerate every hour

const BASE_URL = 'https://velour.com'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dbGatherings = await getApprovedGatherings()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/discover`,            lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE_URL}/onboarding`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/create`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/how-it-works`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/manifesto`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const mockRoutes: MetadataRoute.Sitemap = ACTIVITIES.map(a => ({
    url: `${BASE_URL}/activity/${a.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const dbRoutes: MetadataRoute.Sitemap = dbGatherings.map(g => ({
    url: `${BASE_URL}/activity/${g.id}`,
    lastModified: new Date(g.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...dbRoutes, ...mockRoutes]
}
