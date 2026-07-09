import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import * as DropdownMenuPrimitive from '@kobalte/core/dropdown-menu'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { Check, ChevronRight } from 'lucide-solid'
import { cn } from '~/lib/utils'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

type DropdownMenuContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuContentProps<T> & {
    class?: string | undefined
  }

export function DropdownMenuContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuContentProps, ['class'])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        class={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95',
          local.class,
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

type DropdownMenuItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuItemProps<T> & {
    class?: string | undefined
    inset?: boolean
  }

export function DropdownMenuItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuItemProps, [
    'class',
    'inset',
  ])
  return (
    <DropdownMenuPrimitive.Item
      class={cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        local.inset && 'pl-8',
        local.class,
      )}
      {...rest}
    />
  )
}

type DropdownMenuCheckboxItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuCheckboxItemProps<T> & {
    class?: string | undefined
    children?: import('solid-js').JSX.Element
  }

export function DropdownMenuCheckboxItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuCheckboxItemProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuCheckboxItemProps, [
    'class',
    'children',
  ])
  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        local.class,
      )}
      {...rest}
    >
      <span class="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check class="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

type DropdownMenuLabelProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T> & {
    class?: string | undefined
    inset?: boolean
  }

export function DropdownMenuLabel<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuLabelProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuLabelProps, [
    'class',
    'inset',
  ])
  return (
    <DropdownMenuPrimitive.GroupLabel
      class={cn(
        'px-2 py-1.5 text-sm font-semibold',
        local.inset && 'pl-8',
        local.class,
      )}
      {...rest}
    />
  )
}

type DropdownMenuSeparatorProps<T extends ValidComponent = 'hr'> =
  DropdownMenuPrimitive.DropdownMenuSeparatorProps<T> & {
    class?: string | undefined
  }

export function DropdownMenuSeparator<T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuSeparatorProps, [
    'class',
  ])
  return (
    <DropdownMenuPrimitive.Separator
      class={cn('-mx-1 my-1 h-px bg-muted', local.class)}
      {...rest}
    />
  )
}

type DropdownMenuSubTriggerProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuSubTriggerProps<T> & {
    class?: string | undefined
    children?: import('solid-js').JSX.Element
  }

export function DropdownMenuSubTrigger<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubTriggerProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuSubTriggerProps, [
    'class',
    'children',
  ])
  return (
    <DropdownMenuPrimitive.SubTrigger
      class={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[expanded]:bg-accent',
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <ChevronRight class="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

type DropdownMenuSubContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuSubContentProps<T> & {
    class?: string | undefined
  }

export function DropdownMenuSubContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>,
) {
  const [local, rest] = splitProps(props as DropdownMenuSubContentProps, [
    'class',
  ])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        class={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0',
          local.class,
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}
