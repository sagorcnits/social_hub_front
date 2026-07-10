import { Show, createSignal } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { LogOut } from 'lucide-solid'
import Avatar from '~/components/shared/Avatar'
import { currentUser, logout, updateProfile } from '~/features/auth/store'

export default function SettingsPage() {
  const navigate = useNavigate()
  const me = () => currentUser()

  const [firstName, setFirstName] = createSignal(me()?.profile.firstName ?? '')
  const [lastName, setLastName] = createSignal(me()?.profile.lastName ?? '')
  const [username, setUsername] = createSignal(me()?.profile.username ?? '')
  const [bio, setBio] = createSignal(me()?.profile.bio ?? '')
  const [saved, setSaved] = createSignal(false)

  function save(e: Event) {
    e.preventDefault()
    updateProfile({
      firstName: firstName().trim(),
      lastName: lastName().trim(),
      username: username().trim(),
      bio: bio().trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function onLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div class="flex flex-col gap-4">
      <h1 class="demo-title" style={{ 'font-size': '1.5rem' }}>
        Account settings
      </h1>

      <form class="demo-panel flex flex-col gap-4" onSubmit={save}>
        <div class="flex items-center gap-3">
          <Avatar
            name={firstName() || 'You'}
            src={me()?.profile.avatar}
            size={64}
          />
          <div>
            <p class="font-semibold">{firstName()} {lastName()}</p>
            <p class="demo-muted text-sm">@{username()}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <label class="min-w-32 flex-1 text-sm font-semibold">
            First name
            <input
              class="demo-input mt-1.5"
              value={firstName()}
              onInput={(e) => setFirstName(e.currentTarget.value)}
            />
          </label>
          <label class="min-w-32 flex-1 text-sm font-semibold">
            Last name
            <input
              class="demo-input mt-1.5"
              value={lastName()}
              onInput={(e) => setLastName(e.currentTarget.value)}
            />
          </label>
        </div>

        <label class="text-sm font-semibold">
          Username
          <input
            class="demo-input mt-1.5"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
        </label>

        <label class="text-sm font-semibold">
          Bio
          <textarea
            class="demo-textarea mt-1.5"
            value={bio()}
            onInput={(e) => setBio(e.currentTarget.value)}
          />
        </label>

        <div class="flex items-center gap-3">
          <button type="submit" class="demo-button">
            Save changes
          </button>
          <Show when={saved()}>
            <span class="text-sm font-semibold" style={{ color: 'var(--lagoon-deep)' }}>
              Saved ✓
            </span>
          </Show>
        </div>
      </form>

      <div class="demo-panel flex items-center justify-between">
        <div>
          <p class="font-semibold">Log out</p>
          <p class="demo-muted text-sm">End your session on this device.</p>
        </div>
        <button
          type="button"
          class="demo-button demo-button-danger"
          onClick={onLogout}
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  )
}
