import { createFileRoute } from '@tanstack/solid-router'
import AboutPage from '~/features/about/about'

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
})
