import { splitProps } from 'solid-js'
import type { ComponentProps } from 'solid-js'
import { cn } from '~/lib/utils'

export function Input(props: ComponentProps<'input'>) {
  const [local, rest] = splitProps(props, ['class', 'type'])
  return (
    <input
      type={local.type}
      class={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        local.class,
      )}
      {...rest}
    />
  )
}
