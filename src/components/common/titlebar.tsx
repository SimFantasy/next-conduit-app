import { cn } from '@/lib/utils'
import { Divide } from 'lucide-react'
import React from 'react'

interface TitlebarProps {
	title: string
	more?: React.ReactNode
	className?: string
}

export const Titlebar = ({ title, more, className }: TitlebarProps) => {
	return (
		<div className={cn('flex justify-between items-center gap-x-4', className)}>
			<h1 className='text-xl font-semibold'>{title}</h1>
			{more && <span>{more}</span>}
		</div>
	)
}
