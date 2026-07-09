import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import * as SelectPrimitive from '@kobalte/core/select'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { Check, ChevronDown } from 'lucide-solid'
import { cn } from '~/lib/utils'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectHiddenSelect = SelectPrimitive.HiddenSelect

type SelectTriggerProps<T extends ValidComponent = 'button'> =
  SelectPrimitive.SelectTriggerProps<T> & {
    class?: string | undefined
    children?: import('solid-js').JSX.Element
  }

export function SelectTrigger<T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, SelectTriggerProps<T>>,
) {
  const [local, rest] = splitProps(props as SelectTriggerProps, [
    'class',
    'children',
  ])
  return (
    <SelectPrimitive.Trigger
      class={cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <SelectPrimitive.Icon>
        <ChevronDown class="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps<T extends ValidComponent = 'div'> =
  SelectPrimitive.SelectContentProps<T> & { class?: string | undefined }

export function SelectContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SelectContentProps<T>>,
) {
  const [local, rest] = splitProps(props as SelectContentProps, ['class'])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95',
          local.class,
        )}
        {...rest}
      >
        <SelectPrimitive.Listbox class="p-1" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectItemProps<T extends ValidComponent = 'li'> =
  SelectPrimitive.SelectItemProps<T> & {
    class?: string | undefined
    children?: import('solid-js').JSX.Element
  }

export function SelectItem<T extends ValidComponent = 'li'>(
  props: PolymorphicProps<T, SelectItemProps<T>>,
) {
  const [local, rest] = splitProps(props as SelectItemProps, [
    'class',
    'children',
  ])
  return (
    <SelectPrimitive.Item
      class={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        local.class,
      )}
      {...rest}
    >
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check class="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemLabel>{local.children}</SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  )
}
