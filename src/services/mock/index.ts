// Helpers for serving seeded data through the same envelope shape the real API
// uses, so feature code is identical whether USE_MOCKS is on or off.

import type { Envelope } from '~/services/api/client'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Wrap a payload in a success envelope after a small, realistic latency. */
export async function mockOk<T>(
  data: T,
  meta?: Envelope<T>['meta'],
): Promise<Envelope<T>> {
  await delay(120 + Math.random() * 180)
  return { success: true, message: 'OK (mock)', data, meta }
}

export * as db from './db'
