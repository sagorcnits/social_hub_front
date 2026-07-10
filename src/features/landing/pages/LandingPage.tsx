import { For } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { MessageCircle, Bell, Heart } from 'lucide-solid'

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Threaded conversations',
    body: 'Reply to replies without limit. Every thread stays readable, however deep it goes.',
  },
  {
    icon: Heart,
    title: 'Posts & reactions',
    body: 'Share text and media, like what you love. Counters update instantly, no refresh.',
  },
  {
    icon: Bell,
    title: 'Realtime notifications',
    body: 'Know the moment someone replies or reacts — live, over a persistent connection.',
  },
]

export default function LandingPage() {
  return (
    <main class="demo-page">
      <section class="rise-in flex flex-col items-center py-10 text-center sm:py-16">
        <p class="island-kicker mb-3">Social Hub</p>
        <h1 class="demo-title display-title max-w-2xl">
          A calmer place to share and talk.
        </h1>
        <p class="demo-muted mt-4 max-w-xl text-base">
          Posts, unlimited nested comments, likes, and realtime notifications —
          all in one airy, ocean-lit space.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" class="demo-button">
            Get started
          </Link>
          <Link to="/login" class="demo-button demo-button-secondary">
            Log in
          </Link>
        </div>
      </section>

      <section class="mt-6 grid gap-4 sm:grid-cols-3">
        <For each={FEATURES}>
          {(f) => (
            <article class="demo-card">
              <span
                class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    'color-mix(in oklab, var(--lagoon) 22%, var(--surface-strong))',
                  color: 'var(--sea-ink)',
                }}
              >
                <f.icon size={20} />
              </span>
              <h2 class="demo-section-title mb-1">{f.title}</h2>
              <p class="demo-muted text-sm">{f.body}</p>
            </article>
          )}
        </For>
      </section>
    </main>
  )
}
