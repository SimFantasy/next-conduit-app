import Link from 'next/link'
import { Lobster } from 'next/font/google'
import { Snail } from 'lucide-react'

import { cn } from '@/lib/utils'

export const font = Lobster({
	subsets: ['latin'],
	weight: ['400']
})

interface LogoProps {
	className?: string
	size?: 'sm' | 'lg'
	light?: boolean
}

export const Logo = ({ className, size, light }: LogoProps) => {
	return (
		<Link href='/' className={cn('flex items-center gap-x-2', className)}>
			<Snail
				className={cn('w-6 h-6 text-emerald-500', {
					'w-4 h-4': size === 'sm',
					'w-8 h-8': size === 'lg',
					'text-white': light
				})}
			/>
			<span
				className={cn(
					'font-semibold text-2xl text-emerald-700',
					{
						'text-sm': size === 'sm',
						'text-3xl': size === 'lg',
						'text-white': light
					},
					font.className
				)}
			>
				Conduit
			</span>
		</Link>
	)
}
