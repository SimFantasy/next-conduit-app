'use client'

import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export const Banner = () => {
	const isAuth = useAuth(state => state.isAuth)
	return (
		<div className={cn('relative w-full h-60', isAuth && 'hidden')}>
			<Image
				src='/images/banner.jpg'
				alt=''
				fill
				sizes='(min-width: 768px) 700px, 100vw'
				priority
				className='object-cover'
			/>
			<div className='absolute top-0 left-0 flex justify-center items-center w-full h-full bg-emerald-700/60 text-white'>
				<div className='flex flex-col gap-y-2 items-center'>
					<h1 className='text-4xl font-semibold'>Welcome to Conduit</h1>
					<p className='text-lg font-medium'>A place to share your knowledge.</p>
				</div>
			</div>
		</div>
	)
}
