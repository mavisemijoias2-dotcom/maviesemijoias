import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' && 'bg-[#C4966A] text-white',
        variant === 'secondary' && 'bg-gray-100 text-gray-800',
        variant === 'outline' && 'border border-[#C4966A] text-[#C4966A]',
        className
      )}
      {...props}
    />
  )
}

export { Badge }
