import React from 'react'
import { Logo } from '@/components/common/logo'
import { Navbar } from '@/components/layout/navbar'
import { Searchbar } from '@/components/layout/searchbar'

export const Header = () => {
	return (
		<div className='w-full h-14 bg-white'>
			<div className='page-container flex justify-between items-center gap-x-4 h-full'>
				<Logo />
				<Searchbar />
				<Navbar />
			</div>
		</div>
	)
}
