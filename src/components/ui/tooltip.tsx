import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import * as TooltipPrimitive from '@kobalte/core/tooltip'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { cn } from '~/lib/utils'

export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps<T extends ValidComponent = 'div'> =
  TooltipPrimitive.TooltipContentProps<T> & { class?: string | undefined }

export function TooltipContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TooltipContentProps<T>>,
) {
  const [local, rest] = splitProps(props as TooltipContentProps, ['class'])
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class={cn(
          'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95',
          local.class,
        )}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  )
}
