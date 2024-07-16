'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { LogOut, Mail, SquareUserRound, UserCircle } from 'lucide-react'

import { useCurrentUser } from '@/hooks/use-current-user'

export const UserButton = () => {
	const user = useCurrentUser()
	if (!user) return null
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='w-8 h-8 cursor-pointer'>
					<AvatarImage src={user.image || '/images/default-avatar.png'} alt={user.name!} />
					<AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>
					<div className='flex flex-col gap-y-2 font-normal'>
						<div className='user-button-item'>
							<UserCircle size={16} />
							{user.name}
						</div>
						<div className='user-button-item'>
							<Mail size={16} />
							{user.email}
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Link href={`/profile/${user.name}`} className='user-button-item w-full'>
						<SquareUserRound size={16} />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<button className='user-button-item w-full' onClick={() => signOut()}>
						<LogOut size={16} />
						<span>Log out</span>
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
