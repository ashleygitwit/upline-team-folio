"use client"

/**
 * Upline mode: slate 700 with white type, as the drawer's toast is, so every
 * passing message is the same dark strip, square, with no shadow, ring or
 * arrow. It fades and scales in over 100ms, and the site's reduced-motion rule
 * flattens that to an instant show. Until 2026-10-02 it was the popover
 * surface, white, with the navigation menu viewport's hairline ring.
 *
 * Portaled, because the band it opens over is overflow-clip.
 *
 * Radix opens a tooltip on hover and on keyboard focus, and a touch screen has
 * neither, so nothing a tooltip says may be the only place that information
 * appears.
 */

import * as React from "react"
import { cn } from "cn"
import { Tooltip as TooltipPrimitive } from "radix-ui"

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * The open state Radix sets here is `delayed-open` or `instant-open` rather
 * than `open`, which the kit's `data-open:` variant does not match, so the
 * entrance runs unconditionally on mount. `data-closed:` matches as usual.
 */
function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit max-w-[min(90vw,28rem)] origin-(--radix-tooltip-content-transform-origin) rounded-none bg-dark-bg px-3 py-2 text-sm text-dark-fg duration-100 animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
