import { NextRequest, NextResponse } from 'next/server'

const INDEX_NOW_KEY = 'velour-indexnow-7f3b2a1c'
const BASE_URL = 'https://velour.com'

export async function POST(req: NextRequest) {
  const { urls }: { urls: string[] } = await req.json()
  if (!urls?.length) return NextResponse.json({ error: 'No URLs provided' }, { status: 400 })

  const body = {
    host: 'velour.com',
    key: INDEX_NOW_KEY,
    keyLocation: `${BASE_URL}/${INDEX_NOW_KEY}.txt`,
    urlList: urls,
  }

  // Ping Bing + Google simultaneously
  const [bing, google] = await Promise.allSettled([
    fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    }),
    fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    }),
  ])

  return NextResponse.json({
    bing: bing.status === 'fulfilled' ? bing.value.status : 'failed',
    google: google.status === 'fulfilled' ? google.value.status : 'failed',
    urls,
  })
}
