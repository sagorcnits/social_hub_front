import { createSignal } from 'solid-js'
import Avatar from '~/components/shared/Avatar'
import { currentUser } from '~/features/auth/store'

export default function ReplyBox(props: {
  placeholder?: string
  autofocus?: boolean
  onSubmit: (content: string) => Promise<void>
}) {
  const [value, setValue] = createSignal('')
  const [busy, setBusy] = createSignal(false)

  async function send() {
    const text = value().trim()
    if (!text || busy()) return
    setBusy(true)
    try {
      await props.onSubmit(text)
      setValue('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div class="flex items-center gap-2">
      <Avatar
        name={currentUser()?.profile.firstName ?? 'You'}
        src={currentUser()?.profile.avatar}
        size={28}
      />
      <input
        class="demo-input"
        style={{ padding: '0.45rem 0.75rem' }}
        placeholder={props.placeholder ?? 'Write a reply…'}
        value={value()}
        autofocus={props.autofocus}
        onInput={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void send()
          }
        }}
      />
      <button
        type="button"
        class="demo-button"
        style={{ padding: '0.45rem 0.8rem' }}
        disabled={!value().trim() || busy()}
        onClick={send}
      >
        {busy() ? '…' : 'Reply'}
      </button>
    </div>
  )
}
