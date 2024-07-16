'use client'

import Image from 'next/image'
import Link from 'next/link'

import { UserRoundPenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/common/user-avatar'
import { FollowButton } from '@/components/article/follow-button'

import { IUserResponse } from '@/lib/types'
import { useAuth } from '@/hooks/use-auth'

interface IProfileBannerProps {
	profile: IUserResponse
}

export const ProfileBanner = ({ profile }: IProfileBannerProps) => {
	const authUser = useAuth(state => state.authUser)
	const isProfileOwner = authUser?.name === profile.username

	return (
		<div className='w-full h-80 border-b border-neutral-200 bg-white'>
			<div className='relative flex justify-between items-center h-60 bg-center bg-cover'>
				<Image
					src='/images/default-cover-2.jpg'
					alt='profile cover'
					fill
					sizes='(min-width: 1024px) 50vw, 100vw'
					priority
					className='object-cover'
				/>
				<div className='absolute bottom-10 md:-bottom-20 left-0 z-10 page-container flex flex-col md:flex-row items-center gap-x-6 w-full h-40'>
					<UserAvatar
						size={40}
						user={{ username: profile.username, image: profile.image }}
						className='border-4 border-white rounded-full w-[128px] h-[128px]'
					/>

					<div className='flex-1 flex flex-col md:flex-row justify-between items-center gap-x-6 mt-2 md:mt-20 h-20'>
						<div className='flex flex-col md:flex-row items-center gap-x-6'>
							<div className='flex flex-col justify-center items-center md:items-start md:w-full h-full'>
								<h1 className='text-2xl font-bold text-white md:text-neutral-800'>
									{profile.username}
								</h1>
								<span className='text-white md:text-neutral-500 text-sm line-clamp-1'>
									{profile.bio}
								</span>
							</div>
						</div>

						<div className='flex justify-center md:justify-end items-end md:items-center gap-x-6 mt-7 md:mt-0 h-full text-neutral-500'>
							{isProfileOwner ? (
								<Button variant='outline' size='sm' asChild>
									<Link href='/settings' className='flex items-center gap-x-2 text-neutral-500'>
										<UserRoundPenIcon size={16} />
										<span>Edit Profile</span>
									</Link>
								</Button>
							) : (
								<FollowButton
									following={profile.followed}
									username={profile.username}
									className='dark'
								/>
							)}
							<div className='flex justify-end items-center gap-x-4'>
								<div className='flex flex-col items-center'>
									<h1 className='text-lg font-semibold text-neutral-800'>{profile.followers}</h1>
									<span className='text-sm'>Follower</span>
								</div>
								<div className='flex flex-col items-center'>
									<h1 className='text-lg font-semibold text-neutral-800'>{profile.following}</h1>
									<span className='text-sm'>Following</span>
								</div>
								<div className='flex flex-col items-center'>
									<h1 className='text-lg font-semibold text-neutral-800'>{profile.articles}</h1>
									<span className='text-sm'>Articles</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
