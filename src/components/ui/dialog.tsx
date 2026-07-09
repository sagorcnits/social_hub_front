import { splitProps } from 'solid-js'
import type { ComponentProps, ParentProps, ValidComponent } from 'solid-js'
import * as DialogPrimitive from '@kobalte/core/dialog'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { X } from 'lucide-solid'
import { cn } from '~/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

type DialogContentProps<T extends ValidComponent = 'div'> = ParentProps<
  DialogPrimitive.DialogContentProps<T> & { class?: string | undefined }
>

export function DialogContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) {
  const [local, rest] = splitProps(props as DialogContentProps, [
    'class',
    'children',
  ])
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay class="fixed inset-0 z-50 bg-black/80 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0" />
      <DialogPrimitive.Content
        class={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 sm:rounded-lg',
          local.class,
        )}
        {...rest}
      >
        {local.children}
        <DialogPrimitive.CloseButton class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X class="size-4" />
          <span class="sr-only">Close</span>
        </DialogPrimitive.CloseButton>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        local.class,
      )}
      {...rest}
    />
  )
}

export function DialogFooter(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        local.class,
      )}
      {...rest}
    />
  )
}

type DialogTitleProps<T extends ValidComponent = 'h2'> =
  DialogPrimitive.DialogTitleProps<T> & { class?: string | undefined }

export function DialogTitle<T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) {
  const [local, rest] = splitProps(props as DialogTitleProps, ['class'])
  return (
    <DialogPrimitive.Title
      class={cn(
        'text-lg font-semibold leading-none tracking-tight',
        local.class,
      )}
      {...rest}
    />
  )
}

type DialogDescriptionProps<T extends ValidComponent = 'p'> =
  DialogPrimitive.DialogDescriptionProps<T> & { class?: string | undefined }

export function DialogDescription<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) {
  const [local, rest] = splitProps(props as DialogDescriptionProps, ['class'])
  return (
    <DialogPrimitive.Description
      class={cn('text-sm text-muted-foreground', local.class)}
      {...rest}
    />
  )
}
