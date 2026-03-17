'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Users, Shield, Zap, ChevronDown, Star, Heart } from 'lucide-react'
import Nav from './components/Nav'
import ActivityCard from './components/ActivityCard'
import WaitlistForm from './components/WaitlistForm'
import { ACTIVITIES, STATS } from './data/activities'

const MANIFESTO_LINES = [
  'You have 847 connections online.',
  'When did you last have dinner with a friend?',
  'We built apps to bring people together.',
  'We got lonelier.',
  'The Surgeon General called it an epidemic.',
  'Loneliness now kills as surely as smoking 15 cigarettes a day.',
  'We think that\'s worth fixing.',
  'Not with another social network.',
  'With a reason to show up.',
]

function ManifestoSection() {
  const [revealed, setRevealed] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    const el = document.getElementById('manifesto')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const id = setInterval(() => {
      setRevealed(r => {
        if (r >= MANIFESTO_LINES.length) { clearInterval(id); return r }
        return r + 1
      })
    }, 750)
    return () => clearInterval(id)
  }, [started])

  return (
    <section id="manifesto" className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-stone-950">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        {MANIFESTO_LINES.map((line, i) => {
          const isKey = i === 5 || i === 8
          return (
            <p
              key={i}
              className={`font-display transition-all duration-700 ${
                i < revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              } ${
                isKey ? 'text-2xl md:text-3xl text-velour-400 font-semibold'
                  : i < 3 ? 'text-xl text-stone-300'
                  : i === 3 ? 'text-2xl text-white font-semibold'
                  : 'text-lg text-stone-400'
              }`}
            >
              {line}
            </p>
          )
        })}
        {revealed >= MANIFESTO_LINES.length && (
          <div className="pt-8 animate-fade-up">
            <Link href="/discover" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
              Find your people <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', icon: '📍', title: 'Tell us where you are', desc: 'Your city or neighborhood. No GPS tracking, no data profiles.' },
    { number: '02', icon: '🎯', title: 'Pick what you love doing', desc: 'Hiking, cooking, board games, music, yoga — activities you\'d enjoy.' },
    { number: '03', icon: '🙋', title: 'Join or host a gathering', desc: 'Small groups (max 8–12). Real places. Scheduled times. You show up.' },
    { number: '04', icon: '🤝', title: 'Meet people, for real', desc: 'No DMs, no followers, no feeds. Just a table, a trail, a kitchen.' },
  ]
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">How Velour works</p>
          <h2 className="font-display text-4xl md:text-5xl text-stone-900">Four steps to an actual friendship</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-cream-50 rounded-3xl p-6 h-full border border-cream-200">
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="text-xs font-mono text-stone-300 mb-2">{step.number}</div>
              <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">{step.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Principles() {
  const principles = [
    { icon: <Users className="text-sage-500" size={22} />, title: 'Small by design', desc: 'Max 8–12 people per gathering. Big enough to meet someone new. Small enough to actually talk.', bg: 'bg-sage-50', border: 'border-sage-100' },
    { icon: <Shield className="text-velour-500" size={22} />, title: 'No algorithm, ever', desc: 'No feed, no engagement optimization. You see what\'s near you, that\'s it.', bg: 'bg-velour-50', border: 'border-velour-100' },
    { icon: <MapPin className="text-blue-500" size={22} />, title: 'Radically local', desc: 'Everything within walking or short driving distance. No global broadcasts. Your actual community.', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: <Zap className="text-amber-500" size={22} />, title: 'Activity-first', desc: 'Shared doing creates real bonds. Hiking, cooking, drawing, playing — not just hanging out.', bg: 'bg-amber-50', border: 'border-amber-100' },
  ]
  return (
    <section className="py-24 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Our principles</p>
          <h2 className="font-display text-4xl md:text-5xl text-stone-900">Built against the grain</h2>
          <p className="mt-4 text-lg text-stone-500 max-w-xl mx-auto">Every design decision we make is the opposite of what makes social media addictive. That&apos;s intentional.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {principles.map((p, i) => (
            <div key={i} className={`${p.bg} border ${p.border} rounded-3xl p-7`}>
              <div className="mb-4">{p.icon}</div>
              <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">{p.title}</h3>
              <p className="text-stone-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="py-20 px-4 bg-stone-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-velour-400 mb-1">{stat.value}</div>
              <div className="text-sm text-stone-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedActivities() {
  const featured = ACTIVITIES.slice(0, 3)
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="section-label mb-2">Happening near you</p>
            <h2 className="font-display text-4xl text-stone-900">This week in Omaha</h2>
          </div>
          <Link href="/discover" className="btn-secondary text-sm flex items-center gap-1.5">
            See all gatherings <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(act => (
            <ActivityCard key={act.id} activity={act} featured={act.isFeatured} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const quotes = [
    { quote: 'I moved to Omaha knowing no one. Six months of Velour later, I have a hiking crew, a board game night, and two people I\'d call if something went wrong.', author: 'Dani L.', detail: 'Joined 6 months ago · 23 gatherings attended', avatar: 'DL', stars: 5 },
    { quote: 'I was skeptical — I\'m 58 and tech isn\'t my thing. But my neighbor convinced me to try a Repair Café. I\'ve been back every month.', author: 'Robert K.', detail: 'Joined 14 months ago · 8 gatherings attended', avatar: 'RK', stars: 5 },
    { quote: 'After my divorce I felt invisible. The cooking group changed that. We\'re not just chopping vegetables — we\'re actually talking. Really talking.', author: 'Sarah M.', detail: 'Joined 4 months ago · 11 gatherings attended', avatar: 'SM', stars: 5 },
  ]
  return (
    <section className="py-24 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Real stories</p>
          <h2 className="font-display text-4xl text-stone-900">What showing up looks like</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="bg-white rounded-3xl p-7 border border-cream-200 shadow-sm flex flex-col gap-4">
              <div className="flex gap-0.5">
                {[...Array(q.stars)].map((_, s) => (
                  <Star key={s} size={14} className="fill-velour-400 text-velour-400" />
                ))}
              </div>
              <p className="font-display text-lg text-stone-800 leading-relaxed italic flex-1">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-cream-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-velour-300 to-velour-600 flex items-center justify-center text-xs font-bold text-white">
                  {q.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">{q.author}</div>
                  <div className="text-xs text-stone-400">{q.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WaitlistSection() {
  return (
    <section className="py-24 px-4 bg-stone-950">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-stone-800 text-velour-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
          <Heart size={14} className="fill-velour-400" />
          Join 4,200+ people on the waitlist
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-white font-bold mb-4">
          Get early access
        </h2>
        <p className="text-stone-400 text-lg mb-10 max-w-md mx-auto">
          We&apos;re rolling out city by city. Drop your email and we&apos;ll let you know the moment Velour is live near you.
        </p>
        <WaitlistForm variant="hero" placeholder="your@email.com" ctaText="Join the waitlist" />
        <p className="text-stone-600 text-xs mt-5">
          No spam. No newsletters. One email when we launch in your city.
        </p>

        {/* Social proof numbers */}
        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-stone-800 pt-10">
          {[
            { value: '47', label: 'cities launching 2026' },
            { value: '4,200+', label: 'on the waitlist' },
            { value: '0', label: 'ads, ever' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-2xl font-bold text-velour-400">{s.value}</div>
              <div className="text-xs text-stone-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PressBar() {
  const mentions = [
    { name: 'TechCrunch', quote: '"The anti-social social app."' },
    { name: 'Fast Company', quote: '"Finally, an app that wants you to put it down."' },
    { name: 'The Atlantic', quote: '"A serious attempt at the loneliness problem."' },
    { name: 'Wired', quote: '"Boring by design. That\'s the point."' },
  ]
  return (
    <section className="py-12 px-4 bg-white border-y border-cream-200 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="section-label text-center mb-8">As seen in</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mentions.map((m, i) => (
            <div key={i} className="text-center">
              <div className="font-bold text-stone-400 text-sm mb-1">{m.name}</div>
              <div className="text-xs text-stone-400 italic">{m.quote}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-28 px-4 bg-velour-500">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-6xl text-white font-bold leading-tight mb-6">
          You&apos;re one gathering away from a friend.
        </h2>
        <p className="text-velour-100 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          No app to install. No profile to optimize. Just show up.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/onboarding" className="bg-white text-velour-700 font-bold px-8 py-4 rounded-2xl hover:bg-cream-50 transition-colors shadow-lg hover:shadow-xl text-lg active:scale-95">
            Get started — it&apos;s free
          </Link>
          <Link href="/discover" className="bg-velour-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-velour-700 transition-colors text-lg active:scale-95">
            Browse gatherings first
          </Link>
        </div>
        <p className="mt-8 text-velour-200 text-sm">No ads. No engagement bait. No selling your data. Ever.</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-velour-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <span className="font-display font-semibold text-white text-lg">Velour</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Real connections. Real places. Real people. Built to fight the loneliness epidemic one gathering at a time.
          </p>
          <p className="mt-4 text-xs text-stone-600">A Public Benefit Corporation. We exist to create community, not shareholder value.</p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">Product</div>
          <ul className="space-y-2 text-sm">
            {[['Discover', '/discover'], ['Host a gathering', '/create'], ['How it works', '/how-it-works'], ['Why we exist', '/manifesto']].map(([label, href]) => (
              <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            {[['Privacy policy', '/privacy'], ['Terms of service', '/terms'], ['Safety', '/how-it-works']].map(([label, href]) => (
              <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
        <span>&copy; 2026 Velour PBC. Made with care in Omaha, NE.</span>
        <span>No cookies except functional ones.</span>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 to-white py-24 md:py-32 px-4">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-velour-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sage-100 rounded-full opacity-30 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-velour-100 text-velour-700 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-velour-500 rounded-full animate-pulse-soft" />
            47 gatherings happening in Omaha this week
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-stone-900 font-bold leading-[1.05] mb-6">
            Stop scrolling.
            <span className="text-velour-500 italic block">Start gathering.</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find real people doing real things near you &mdash; hiking, cooking, making art, playing games.
            No followers. No algorithm. No doom.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Link href="/onboarding" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              Find your people <ArrowRight size={20} />
            </Link>
            <Link href="/discover" className="btn-secondary text-lg px-8 py-4">
              Browse gatherings
            </Link>
          </div>
          <p className="text-sm text-stone-400 flex items-center justify-center gap-2">
            <MapPin size={14} className="text-velour-400" />
            Free forever. No account needed to browse.
          </p>

          {/* Activity pills */}
          <div className="mt-12 flex flex-wrap gap-2 justify-center">
            {['🥾 Hiking', '🍜 Cooking together', '🎲 Board games', '🎨 Life drawing', '🧘 Sunrise yoga', '🔧 Repair Café', '🎸 Acoustic sessions', '📖 Book clubs'].map(pill => (
              <span key={pill} className="text-sm bg-white border border-cream-200 text-stone-600 px-4 py-2 rounded-full shadow-sm">
                {pill}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-300 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      <PressBar />
      <ManifestoSection />
      <HowItWorks />
      <FeaturedActivities />
      <Principles />
      <Stats />
      <Testimonials />
      <WaitlistSection />
      <CTA />
      <Footer />
    </main>
  )
}
