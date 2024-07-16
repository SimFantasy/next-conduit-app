'use client'
import { useState } from 'react'
import Link from 'next/link'

import { MenuIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileMenubarProps {
	menus: { label: string; route: string; icon: any; hasAuth: boolean }[]
	pathname: string
	isAuth: boolean
}

export const MobileMenubar = ({ menus, pathname, isAuth }: MobileMenubarProps) => {
	const [open, setOpen] = useState(false)
	return (
		<div className='flex lg:hidden'>
			<Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
				<MenuIcon size={24} className='text-neutral-500' />
			</Button>

			{open && (
				<div className='fixed top-0 left-0 w-screen h-screen bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
					<Button
						variant='outline'
						size='icon'
						className='absolute top-6 right-6'
						onClick={() => setOpen(false)}
					>
						<X size={24} />
					</Button>

					<div className='flex flex-col gap-y-4 items-start justify-center'>
						{menus.map(menu => {
							const isActive = pathname === menu.route
							const MenuIcon = menu.icon

							if (menu.label === 'Home' || (menu.hasAuth && isAuth) || (!menu.hasAuth && !isAuth)) {
								return (
									<Link
										key={menu.label}
										href={menu.route}
										className={cn(
											'flex items-center gap-x-2 text-gray-400 hover:text-emerald-700',
											{
												'text-emerald-700 font-semibold': isActive
											}
										)}
										onClick={() => setOpen(false)}
									>
										<MenuIcon size={16} />
										<span>{menu.label}</span>
									</Link>
								)
							}
							return null
						})}
					</div>
				</div>
			)}
		</div>
	)
}
