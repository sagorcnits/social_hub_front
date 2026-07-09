import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_public/')({ component: App })

function App() {
  return (
    <main class="page-wrap px-4 pb-8 pt-14">
      <h1>Home</h1>
    </main>
  )
}
