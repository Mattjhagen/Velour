'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export default function PushNotifications() {
  const [showBanner, setShowBanner] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    navigator.serviceWorker.register('/sw.js').catch(console.error)

    const permission = Notification.permission
    if (permission === 'granted') {
      setSubscribed(true)
      return
    }
    if (permission === 'denied') return

    const dismissed = localStorage.getItem('push-banner-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setShowBanner(true), 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  async function subscribe() {
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) { setSubscribed(true); setShowBanner(false); return }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })

      setSubscribed(true)
      setShowBanner(false)
    } catch (err) {
      console.error('push subscribe failed', err)
    }
  }

  function dismiss() {
    setShowBanner(false)
    localStorage.setItem('push-banner-dismissed', '1')
  }

  if (!showBanner || subscribed) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-stone-900 rounded-2xl shadow-2xl p-4 flex gap-3 items-start animate-fade-up">
      <div className="w-9 h-9 rounded-full bg-velour-500 flex items-center justify-center shrink-0 mt-0.5">
        <Bell size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold mb-1">Get notified of gatherings nearby</p>
        <p className="text-stone-400 text-xs leading-relaxed mb-3">We only notify you when something new pops up in your area. No spam.</p>
        <div className="flex gap-2">
          <button
            onClick={subscribe}
            className="bg-velour-500 hover:bg-velour-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Turn on
          </button>
          <button
            onClick={dismiss}
            className="text-stone-400 hover:text-stone-200 text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
      <button onClick={dismiss} className="text-stone-500 hover:text-stone-300 shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}
