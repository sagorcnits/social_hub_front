import { For, Show, createSignal } from 'solid-js'
import { ImagePlus, X } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import { currentUser } from '~/features/auth/store'
import { createPost } from '../api'
import type { Post } from '../types'

const MAX_FILES = 10

export default function PostComposer(props: { onCreated?: (post: Post) => void }) {
  const [content, setContent] = createSignal('')
  const [files, setFiles] = createSignal<Array<File>>([])
  const [submitting, setSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  let inputRef: HTMLInputElement | undefined

  const previews = () =>
    files().map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))

  const canPost = () =>
    (content().trim().length > 0 || files().length > 0) && !submitting()

  function addFiles(list: FileList | null) {
    if (!list) return
    const next = [...files(), ...Array.from(list)].slice(0, MAX_FILES)
    if (files().length + list.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} files.`)
    }
    setFiles(next)
  }

  function removeFile(i: number) {
    setFiles(files().filter((_, idx) => idx !== i))
  }

  async function submit() {
    if (!canPost()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await createPost(content().trim(), files())
      setContent('')
      setFiles([])
      props.onCreated?.(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish post.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div class="demo-card">
      <div class="flex gap-3">
        <Avatar
          name={currentUser()?.profile.firstName ?? 'You'}
          src={currentUser()?.profile.avatar}
          size={44}
        />
        <textarea
          class="demo-textarea flex-1"
          style={{ 'min-height': '3.5rem' }}
          placeholder="What's on your mind?"
          value={content()}
          onInput={(e) => setContent(e.currentTarget.value)}
        />
      </div>

      <Show when={previews().length > 0}>
        <div class="mt-3 flex flex-wrap gap-2">
          <For each={previews()}>
            {(p, i) => (
              <div class="relative h-20 w-20 overflow-hidden rounded-lg">
                <img src={p.url} alt={p.name} class="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i())}
                  class="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={error()}>
        <p class="mt-2 text-xs" style={{ color: '#9f3030' }}>
          {error()}
        </p>
      </Show>

      <div
        class="mt-3 flex items-center justify-between pt-3"
        style={{ 'border-top': '1px solid var(--line)' }}
      >
        <button
          type="button"
          onClick={() => inputRef?.click()}
          class="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold"
          style={{ color: 'var(--sea-ink-soft)' }}
        >
          <ImagePlus size={18} style={{ color: 'var(--lagoon-deep)' }} />
          Photo/Video
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          class="hidden"
          onChange={(e) => {
            addFiles(e.currentTarget.files)
            e.currentTarget.value = ''
          }}
        />
        <button
          type="button"
          class="demo-button"
          disabled={!canPost()}
          onClick={submit}
        >
          {submitting() ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  )
}
