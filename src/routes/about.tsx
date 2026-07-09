import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main class="page-wrap px-4 py-12">
      <h1>somthine</h1>
    </main>
  )
}
