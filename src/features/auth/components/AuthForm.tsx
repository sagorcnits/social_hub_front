import { Link, useNavigate } from '@tanstack/solid-router'
import { For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { login, register } from '../store'
import type { LoginInput, RegisterInput } from '../types'

type Mode = 'login' | 'register'

type FieldName = 'firstName' | 'lastName' | 'username' | 'email' | 'password'

type Field = {
  name: FieldName
  label: string
  type: string
  autocomplete: string
  required: boolean
  half?: boolean
}

const LOGIN_FIELDS: Array<Field> = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autocomplete: 'current-password',
    required: true,
  },
]

const REGISTER_FIELDS: Array<Field> = [
  {
    name: 'firstName',
    label: 'First name',
    type: 'text',
    autocomplete: 'given-name',
    required: true,
    half: true,
  },
  {
    name: 'lastName',
    label: 'Last name',
    type: 'text',
    autocomplete: 'family-name',
    required: false,
    half: true,
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    autocomplete: 'username',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autocomplete: 'new-password',
    required: true,
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(mode: Mode, values: Record<FieldName, string>) {
  const errors: Partial<Record<FieldName, string>> = {}
  if (!EMAIL_RE.test(values.email))
    errors.email = 'Enter a valid email address.'
  if (values.password.length < 8)
    errors.password = 'Password must be at least 8 characters.'
  if (mode === 'register') {
    if (!values.firstName.trim()) errors.firstName = 'First name is required.'
    if (!values.username.trim()) errors.username = 'Username is required.'
    else if (!/^[a-zA-Z0-9_]{3,}$/.test(values.username))
      errors.username = 'Use 3+ letters, numbers, or underscores.'
  }
  return errors
}

export default function AuthForm(props: { mode: Mode }) {
  const navigate = useNavigate()
  const fields = () => (props.mode === 'login' ? LOGIN_FIELDS : REGISTER_FIELDS)

  const [values, setValues] = createStore<Record<FieldName, string>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = createStore<Partial<Record<FieldName, string>>>(
    {},
  )
  const [formError, setFormError] = createSignal<string | null>(null)
  const [submitting, setSubmitting] = createSignal(false)

  const heading = () =>
    props.mode === 'login' ? 'Welcome back' : 'Create account'
  const cta = () => (props.mode === 'login' ? 'Log in' : 'Sign up')

  async function onSubmit(e: Event) {
    e.preventDefault()
    setFormError(null)
    const found = validate(props.mode, values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      if (props.mode === 'login') {
        await login({
          email: values.email,
          password: values.password,
        } satisfies LoginInput)
      } else {
        await register({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim() || undefined,
          username: values.username.trim(),
          email: values.email,
          password: values.password,
        } satisfies RegisterInput)
      }
      navigate({ to: '/dashboard' })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section class="demo-center">
      <div class="demo-panel rise-in w-full max-w-md">
        <p class="island-kicker mb-2">Social Hub</p>
        <h1 class="display-title mb-1 text-2xl font-bold">{heading()}</h1>
        <p class="demo-muted mb-6 text-sm">
          {props.mode === 'login'
            ? 'Log in to pick up where you left off.'
            : 'Join the conversation — it only takes a minute.'}
        </p>

        <Show when={formError()}>
          <div class="demo-alert demo-alert-danger mb-4 text-sm" role="alert">
            {formError()}
          </div>
        </Show>

        <form onSubmit={onSubmit} novalidate class="flex flex-col gap-4">
          <div class="flex flex-wrap gap-4">
            <For each={fields()}>
              {(field) => (
                <div class={field.half ? 'min-w-32 flex-1' : 'w-full'}>
                  <label
                    for={`auth-${field.name}`}
                    class="mb-1.5 block text-sm font-semibold"
                  >
                    {field.label}
                    <Show when={!field.required}>
                      <span class="demo-muted font-normal"> (optional)</span>
                    </Show>
                  </label>
                  <input
                    id={`auth-${field.name}`}
                    class="demo-input"
                    type={field.type}
                    autocomplete={field.autocomplete}
                    value={values[field.name]}
                    aria-invalid={!!errors[field.name]}
                    onInput={(e) => {
                      setValues(field.name, e.currentTarget.value)
                      if (errors[field.name]) setErrors(field.name, undefined)
                    }}
                  />
                  <Show when={errors[field.name]}>
                    <p class="mt-1 text-xs" style={{ color: '#9f3030' }}>
                      {errors[field.name]}
                    </p>
                  </Show>
                </div>
              )}
            </For>
          </div>

          <button
            type="submit"
            class="demo-button mt-1"
            disabled={submitting()}
          >
            {submitting() ? 'Please wait…' : cta()}
          </button>
        </form>

        <p class="demo-muted mt-6 text-center text-sm">
          <Show
            when={props.mode === 'login'}
            fallback={
              <>
                Already have an account? <Link to="/login">Log in</Link>
              </>
            }
          >
            New here? <Link to="/register">Create an account</Link>
          </Show>
        </p>
      </div>
    </section>
  )
}
