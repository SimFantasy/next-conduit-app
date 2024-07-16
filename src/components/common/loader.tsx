import { cn } from '@/lib/utils'
import { LoaderIcon } from 'lucide-react'

interface LoaderProps {
	text?: string
	className?: string
}

export const Loader = ({ text, className }: LoaderProps) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center w-6 h-6',
				{ 'w-fit gap-x-2': text },
				className
			)}
		>
			<LoaderIcon size={16} className='text-emerald-500 animate-spin' />
			{text && <span className='text-emerald-700 text-sm'>{text}</span>}
		</div>
	)
}
