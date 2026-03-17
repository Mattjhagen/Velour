'use client'

import Nav from '../components/Nav'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HowItWorksPage() {
  const sections = [
    {
      step: '01',
      emoji: '📍',
      title: 'Start with where you are',
      paras: [
        'Velour is radically local. Everything you see is within reasonable distance of you — walking, cycling, or a short drive. No national events, no "virtual gatherings", no global communities.',
        'When you first open Velour, you tell us your neighborhood or city. That\'s all. We don\'t track your GPS. We don\'t sell your location. We use it to show you what\'s happening nearby.',
      ],
    },
    {
      step: '02',
      emoji: '🎯',
      title: 'Tell us what you actually like doing',
      paras: [
        'Velour is organized around activities, not identities. You\'re not a "professional", a "parent", or any other category. You\'re someone who likes hiking, or cooking, or board games.',
        'We show you gatherings based on what you want to do. When you show up to do something you enjoy, with others who enjoy it too, conversation happens naturally. That\'s the magic.',
      ],
    },
    {
      step: '03',
      emoji: '🙋',
      title: 'Join or host — it\'s both easy and deliberate',
      paras: [
        'Joining a gathering takes two clicks and your first name. That\'s it. No profile to fill out, no photo to upload, no bio to write. You get the exact address 24h before.',
        'Hosting takes about 5 minutes. You write what you\'re doing, where, when, and how many people. We ask you to agree to our community norms — be present, be honest, show up.',
      ],
    },
    {
      step: '04',
      emoji: '🤝',
      title: 'Meet people, actually',
      paras: [
        'We keep groups small. Maximum 12 people per gathering, usually 6–8. This is intentional. Research consistently shows that smaller groups produce more meaningful interactions.',
        'There\'s no feed to scroll after. No tagging photos, no posting recaps. If you want to connect with someone you met, you exchange details directly — the old-fashioned way.',
      ],
    },
    {
      step: '05',
      emoji: '🔄',
      title: 'Come back',
      paras: [
        'The first time you go to something new, it can feel awkward. That\'s normal. The second time is better. The third time, someone remembers your name.',
        'The best gatherings on Velour are recurring — the Sunday morning hike, the monthly board game night, the weekly book club. Repetition is how strangers become friends.',
      ],
    },
  ]

  const faqs = [
    {
      q: 'Is it free?',
      a: 'Yes. Velour is free for attendees, always. Hosts of large recurring events (20+ people, monthly+) pay a small platform fee to keep the lights on. We never run ads.',
    },
    {
      q: 'Do I need an account?',
      a: 'No. You can browse all gatherings without any account. To join one, you just need a first name and an email (for the address confirmation only). We don\'t verify the email — you do you.',
    },
    {
      q: 'Is it safe?',
      a: 'We verify all hosts who list events at their private homes. For public venues, the venue itself is the safety layer. Exact addresses are only sent 24h before, to confirmed attendees only. We have a 24/7 support line.',
    },
    {
      q: 'What if I\'m shy / introverted?',
      a: 'Many of our most active members describe themselves as introverted. Activity-based gatherings are specifically good for this — you always have something to do, which takes the pressure off conversation. Try a Repair Café or a life drawing session first.',
    },
    {
      q: 'What cities are you in?',
      a: 'We\'re starting in Omaha, NE. If you don\'t see your city yet, you can sign up to host the first gathering there — and we\'ll support you in building the community.',
    },
    {
      q: 'Why no social features?',
      a: 'By design. Adding likes, followers, or a public feed would change incentives — people would start performing for the feed rather than showing up for each other. We\'ve watched it happen to every other platform. Not here.',
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />

      {/* Hero */}
      <div className="bg-white border-b border-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">How Velour works</p>
          <h1 className="font-display text-5xl text-stone-900 font-bold mb-4">
            Five steps to an actual friend
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Velour isn't complicated. That's the point.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">
        {sections.map(section => (
          <div key={section.step} className="grid md:grid-cols-[120px_1fr] gap-6">
            <div className="flex flex-col items-center md:items-end gap-3 pt-1">
              <div className="text-5xl">{section.emoji}</div>
              <div className="font-mono text-stone-300 text-sm">{section.step}</div>
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-stone-900 font-bold mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.paras.map((p, i) => (
                  <p key={i} className="text-stone-600 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust signals */}
      <div className="bg-stone-900 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-white mb-8 text-center">
            What we promise you
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'No ads, ever',
              'No algorithm sorting your feed',
              'No selling your data',
              'No gamification or engagement hooks',
              'No follower counts or like buttons',
              'No infinite scroll',
              'Exact address private until confirmed',
              'Cancel any gathering, any time, no guilt',
            ].map(promise => (
              <div key={promise} className="flex items-center gap-3 text-stone-300">
                <CheckCircle2 size={18} className="text-velour-400 shrink-0" />
                <span>{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-stone-900 mb-8 text-center">
          Common questions
        </h2>
        <div className="space-y-5">
          {faqs.map(faq => (
            <details key={faq.q} className="group bg-white rounded-2xl border border-cream-200 px-6 py-5 cursor-pointer">
              <summary className="font-semibold text-stone-800 list-none flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-stone-400 group-open:rotate-180 transition-transform text-lg">↓</span>
              </summary>
              <p className="mt-3 text-stone-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-velour-500 py-20 px-4 text-center">
        <h2 className="font-display text-4xl text-white font-bold mb-4">
          Ready to try it?
        </h2>
        <p className="text-velour-100 mb-8">No account, no email, no catch.</p>
        <Link href="/discover" className="bg-white text-velour-700 font-bold px-8 py-4 rounded-2xl hover:bg-cream-50 transition-colors inline-flex items-center gap-2 shadow-lg">
          Browse gatherings <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
