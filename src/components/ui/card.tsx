import { splitProps } from 'solid-js'
import type { ComponentProps } from 'solid-js'
import { cn } from '~/lib/utils'

export function Card(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'rounded-xl border bg-card text-card-foreground shadow',
        local.class,
      )}
      {...rest}
    />
  )
}

export function CardHeader(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div class={cn('flex flex-col space-y-1.5 p-6', local.class)} {...rest} />
  )
}

export function CardTitle(props: ComponentProps<'h3'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <h3
      class={cn('font-semibold leading-none tracking-tight', local.class)}
      {...rest}
    />
  )
}

export function CardDescription(props: ComponentProps<'p'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <p class={cn('text-sm text-muted-foreground', local.class)} {...rest} />
  )
}

export function CardContent(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('p-6 pt-0', local.class)} {...rest} />
}

export function CardFooter(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return <div class={cn('flex items-center p-6 pt-0', local.class)} {...rest} />
}
