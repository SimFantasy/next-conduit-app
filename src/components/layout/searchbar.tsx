'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Searchbar = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const q = searchParams.get('q')

	const [searchQuery, setSearchQuery] = useState('')
	const handleSearch = () => {
		router.push(`/search?q=${searchQuery}`)
	}
	return (
		<div className='group/searchbar hidden md:flex items-center gap-x-2 p-1 pl-2 w-full max-w-md h-10 border hover:border-emerald-500 rounded-lg'>
			<input
				type='text'
				placeholder='Search...'
				className=' bg-transparent outline-none w-full h-full'
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
				onKeyDown={e => e.key === 'Enter' && handleSearch()}
			/>
			<Button variant='ghost' size='icon' className='free-btn' onClick={handleSearch}>
				<SearchIcon size={16} className='text-neutral-500 group-hover/searchbar:text-emerald-500' />
			</Button>
		</div>
	)
}
