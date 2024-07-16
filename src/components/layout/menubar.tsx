'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { menus } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { MobileMenubar } from './mobile-menubar'

export const Menubar = () => {
	const pathname = usePathname()
	const { data: session } = useSession()

	const isAuth = !!session

	return (
		<>
			<div className='hidden lg:flex justify-end items-center gap-x-4'>
				{menus.map(menu => {
					const isActive = pathname === menu.route
					const MenuIcon = menu.icon

					if (menu.label === 'Home' || (menu.hasAuth && isAuth) || (!menu.hasAuth && !isAuth)) {
						return (
							<Link
								key={menu.label}
								href={menu.route}
								className={cn('flex items-center gap-x-2 text-gray-400 hover:text-emerald-700', {
									'text-emerald-700 font-semibold': isActive
								})}
							>
								<MenuIcon size={16} />
								<span>{menu.label}</span>
							</Link>
						)
					}
					return null
				})}
			</div>

			<MobileMenubar menus={menus} pathname={pathname} isAuth={isAuth} />
		</>
	)
}
