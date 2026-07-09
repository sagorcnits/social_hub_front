import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import * as TabsPrimitive from '@kobalte/core/tabs'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { cn } from '~/lib/utils'

export const Tabs = TabsPrimitive.Root

type TabsListProps<T extends ValidComponent = 'div'> =
  TabsPrimitive.TabsListProps<T> & { class?: string | undefined }

export function TabsList<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TabsListProps<T>>,
) {
  const [local, rest] = splitProps(props as TabsListProps, ['class'])
  return (
    <TabsPrimitive.List
      class={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        local.class,
      )}
      {...rest}
    />
  )
}

type TabsTriggerProps<T extends ValidComponent = 'button'> =
  TabsPrimitive.TabsTriggerProps<T> & { class?: string | undefined }

export function TabsTrigger<T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, TabsTriggerProps<T>>,
) {
  const [local, rest] = splitProps(props as TabsTriggerProps, ['class'])
  return (
    <TabsPrimitive.Trigger
      class={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow',
        local.class,
      )}
      {...rest}
    />
  )
}

type TabsContentProps<T extends ValidComponent = 'div'> =
  TabsPrimitive.TabsContentProps<T> & { class?: string | undefined }

export function TabsContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TabsContentProps<T>>,
) {
  const [local, rest] = splitProps(props as TabsContentProps, ['class'])
  return (
    <TabsPrimitive.Content
      class={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        local.class,
      )}
      {...rest}
    />
  )
}
