'use client'

import Nav from '../components/Nav'
import Link from 'next/link'

export default function TermsPage() {
  const sections = [
    {
      title: 'Who we are',
      content: `Velour PBC is a Public Benefit Corporation incorporated in Oregon. Our primary purpose is to reduce loneliness and strengthen community connections. We are not a traditional social media company. We don't run ads and we don't make money from your attention or your data.`,
    },
    {
      title: 'Using Velour',
      content: `Velour is free to use. You don't need an account to browse gatherings. To join or host a gathering, you provide a first name and email address. You must be 13 or older to use Velour. By using Velour, you agree to treat other members with respect, honesty, and care.`,
    },
    {
      title: 'Community standards',
      content: `gatherings must be legal, safe, and inclusive. Discrimination based on race, gender, sexual orientation, disability, religion, national origin, or any other protected characteristic is not permitted and will result in immediate removal.\n\ngatherings may not be used for commercial solicitation, multi-level marketing, religious conversion, or political campaigning. Velour is for connection, not promotion.\n\nHosts must show up. If you host a gathering and cancel with less than 4 hours notice without good cause, you may lose hosting privileges.`,
    },
    {
      title: 'Host responsibilities',
      content: `As a host, you are responsible for the safety and inclusivity of your gathering. You must ensure the venue is accessible, legal to use, and reasonably safe. You must not engage in discriminatory screening of attendees. You must provide accurate information about the gathering (location type, activity, group size).`,
    },
    {
      title: 'Safety',
      content: `Velour facilitates connections between people but cannot guarantee the safety of every interaction. We verify host identities for private-home gatherings and we read every report we receive. If you ever feel unsafe, leave the gathering and contact us at safety@velour.com or call local emergency services if needed.\n\nDo not share personal information (home address, phone number, workplace) beyond what's needed to attend or host a gathering.`,
    },
    {
      title: 'Content',
      content: `gathering descriptions, titles, and tags must be accurate and in good faith. Misleading descriptions, spam, or fake gatherings are not permitted. We reserve the right to remove any gathering that violates these terms.`,
    },
    {
      title: 'Intellectual property',
      content: `Velour and its logo are trademarks of Velour PBC. The content you submit (gathering descriptions, etc.) remains yours. By submitting content, you grant us a license to display it on the platform. We don't claim ownership of your content.`,
    },
    {
      title: 'Limitation of liability',
      content: `Velour is provided "as is." We do our best to keep it running and safe, but we cannot guarantee uninterrupted service or the behavior of other users. To the maximum extent permitted by law, Velour PBC's liability is limited to the amount you've paid us (which, for most users, is zero).`,
    },
    {
      title: 'Termination',
      content: `We may suspend or terminate accounts that violate these terms. You may stop using Velour at any time. If you want your data deleted, email privacy@velour.com.`,
    },
    {
      title: 'Governing law',
      content: `These terms are governed by the laws of the State of Oregon, USA. Disputes will be resolved in the courts of Multnomah County, Oregon.`,
    },
    {
      title: 'Changes',
      content: `We'll notify users of material changes to these terms at least 30 days before they take effect. Continued use of Velour after that constitutes acceptance of the new terms.`,
    },
    {
      title: 'Contact',
      content: `Legal questions: legal@velour.com\nSafety concerns: safety@velour.com\nVelour PBC, Omaha, NE`,
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-10">
          <p className="section-label mb-3">Legal</p>
          <h1 className="font-display text-4xl text-stone-900 font-bold mb-3">Terms of Service</h1>
          <p className="text-stone-500 text-sm">Last updated: March 16, 2026</p>
        </div>

        <div className="bg-sage-50 border border-sage-100 rounded-2xl p-5 mb-10">
          <p className="text-sage-800 font-medium leading-relaxed">
            <strong>TL;DR:</strong> Be kind, show up when you say you will, don&apos;t use Velour to sell things or discriminate against people. That&apos;s basically it.
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
