'use client'

import Nav from '../components/Nav'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ManifestoPage() {
  const rules = [
    'Groups max out at 12 people. Connection requires intimacy.',
    'No algorithm, ever. Chronological, local, honest.',
    'No follower counts, no like buttons, no vanity metrics.',
    'Exact addresses are private until you join. Safety first.',
    'No advertising. We are a Public Benefit Corporation.',
    'We will never sell your data. There is not much to sell anyway.',
  ]

  const promises = [
    'No ads, ever',
    'No algorithm sorting your feed',
    'No selling your data',
    'No gamification or engagement hooks',
    'No follower counts or like buttons',
    'No infinite scroll',
    'Exact address private until confirmed',
    'Cancel any gathering, any time, no guilt',
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <Nav />

      <article className="max-w-2xl mx-auto px-4 py-20">
        <div className="section-label text-stone-500 mb-6">Why Velour exists</div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-12">
          We are the loneliest we have ever been.
        </h1>

        <div className="space-y-8 text-stone-300 leading-relaxed text-lg font-light">
          <p>
            In 2023, the United States Surgeon General declared loneliness an epidemic.
            Not a trend. Not a soft social concern. An epidemic, with health consequences
            equivalent to smoking 15 cigarettes a day.
          </p>

          <p>
            The irony is almost too heavy to carry: we have more ways to connect than any
            humans in history. More platforms. More followers. More notifications. And we are lonelier.
          </p>

          <blockquote className="border-l-4 border-velour-500 pl-6 my-10 text-velour-200 font-display text-2xl italic">
            &ldquo;The most common thing people say when they finally show up is: I cannot believe
            I waited so long to do this.&rdquo;
          </blockquote>

          <p>
            Social media was not designed to fight loneliness. It was designed to hold your
            attention. And attention passive and scrolled turns out to be the
            enemy of connection. You can have 847 connections and feel completely unseen.
          </p>

          <p>
            Research is clear on what actually works: shared activity, physical proximity,
            repeated contact over time. Not broadcasting. Not curated self-presentation.
            Not likes. <em>Doing things together</em>, in real life, more than once.
          </p>

          <h2 className="font-display text-3xl text-white mt-14 mb-4">
            So we built something boring.
          </h2>

          <p>
            Velour is intentionally unsexy. There is no feed to scroll. No followers to grow.
            No algorithm deciding what is interesting. No metric to optimize.
          </p>

          <p>
            There is just a list of things happening near you, posted by real people in your
            community. A hike on Sunday. Ramen from scratch on Friday. A book club reading Camus.
          </p>

          <p>
            You show up. You meet people. Some of them become friends. That is it.
          </p>

          <h2 className="font-display text-3xl text-white mt-14 mb-4">
            Our rules.
          </h2>

          <ul className="space-y-3 text-stone-300">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="text-velour-500 mt-1 shrink-0">&#8594;</span>
                {rule}
              </li>
            ))}
          </ul>

          <h2 className="font-display text-3xl text-white mt-14 mb-4">
            A note on the world.
          </h2>

          <p>
            We built this because the world feels fractured. Politically, socially, culturally,
            the forces that pull people apart are loud and well-funded. The forces that bring
            people together usually are not.
          </p>

          <p>
            We have noticed something: when people do things together in person, hiking,
            cooking, fixing things, playing games, the labels drop. The categories matter
            less. People discover they have more in common than the internet told them they did.
          </p>

          <p>
            We are not naive enough to think an app fixes tribalism. But a hiking group at 8am
            on a Sunday is a pretty good start.
          </p>

          <p className="text-white font-medium text-xl mt-10">
            Show up. See what happens.
          </p>
        </div>

        <div className="mt-16 flex gap-4 flex-wrap">
          <Link href="/onboarding" className="btn-primary flex items-center gap-2">
            Find your people <ArrowRight size={16} />
          </Link>
          <Link href="/discover" className="bg-stone-800 text-stone-200 font-semibold px-6 py-3 rounded-2xl hover:bg-stone-700 transition-colors">
            Browse gatherings
          </Link>
        </div>
      </article>
    </div>
  )
}
