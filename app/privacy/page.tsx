'use client'

import Nav from '../components/Nav'
import Link from 'next/link'

const LAST_UPDATED = 'March 16, 2026'

export default function PrivacyPage() {
  const sections = [
    {
      title: 'The short version',
      content: `We collect as little as possible. We don't sell your data. We don't run ads. We don't track you across the web. We are a Public Benefit Corporation — our mission is to reduce loneliness, not to monetize you.`,
    },
    {
      title: 'What we collect',
      content: `When you join the waitlist: your email address and optionally your city. When you join a gathering: your first name and email (used only to send you the address confirmation). When you host a gathering: your name, the event details, and optionally your email for notifications. We do not collect: your full name, phone number, date of birth, photos, GPS location, or any financial information.`,
    },
    {
      title: 'What we never do',
      content: `We never sell your data to third parties. We never share your information with advertisers. We never build a behavioral profile for ad targeting. We never use your data to train AI models. We never send marketing emails without explicit opt-in.`,
    },
    {
      title: 'How we use your information',
      content: `Your email is used for one purpose: sending you the gathering address 24 hours before the event, and/or notifying you when Velour launches in your city (waitlist only). That's it. We don't send newsletters unless you ask for them.`,
    },
    {
      title: 'Data storage',
      content: `Your data is stored in Supabase (PostgreSQL database hosted in the United States). We use industry-standard encryption in transit (TLS) and at rest. We retain data only as long as necessary. You can request deletion at any time by emailing privacy@velour.com.`,
    },
    {
      title: 'Cookies',
      content: `We use only functional cookies necessary for the app to work (session state, preferences). We do not use tracking cookies, advertising cookies, or third-party analytics cookies. We do not use Google Analytics.`,
    },
    {
      title: 'Third parties',
      content: `We use Supabase for database hosting. We use Vercel for web hosting. We use Google Fonts for typography (fonts are loaded from Google's servers). These are our only third-party data processors. None of them receive personally identifiable information beyond what's necessary for the service.`,
    },
    {
      title: 'Your rights',
      content: `You can request a copy of your data, correction of inaccurate data, or deletion of your data at any time. Email privacy@velour.com. We'll respond within 30 days. If you're in the EU or UK, you have additional rights under GDPR/UK GDPR including the right to data portability and the right to lodge a complaint with your supervisory authority.`,
    },
    {
      title: 'Children',
      content: `Velour is not directed at children under 13. We do not knowingly collect data from children. If you believe we have inadvertently collected information from a child, please contact privacy@velour.com and we will delete it promptly.`,
    },
    {
      title: 'Changes to this policy',
      content: `If we make material changes to this privacy policy, we'll post a notice on the website at least 30 days before the changes take effect. We'll never retroactively change how we use data you've already provided.`,
    },
    {
      title: 'Contact',
      content: `Privacy questions: privacy@velour.com\nGeneral questions: hello@velour.com\nVelour PBC, Omaha, NE`,
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-10">
          <p className="section-label mb-3">Legal</p>
          <h1 className="font-display text-4xl text-stone-900 font-bold mb-3">Privacy Policy</h1>
          <p className="text-stone-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="bg-velour-50 border border-velour-100 rounded-2xl p-5 mb-10">
          <p className="text-velour-800 font-medium leading-relaxed">
            <strong>TL;DR:</strong> We collect your email when you sign up. We never sell it. We never advertise to you. We use it only to tell you about gatherings near you. You can delete it anytime.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-semibold text-stone-900 mb-3">{s.title}</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-cream-200">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
            &larr; Back to Velour
          </Link>
        </div>
      </div>
    </div>
  )
}
