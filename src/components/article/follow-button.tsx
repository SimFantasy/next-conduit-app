'use client'

import { useState, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { HeartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { switchFollowAction } from '@/actions/article'

interface FollowButtonProps {
	username: string
	following: boolean
	className?: string
}

export const FollowButton = ({ username, following, className }: FollowButtonProps) => {
	const router = useRouter()
	const [followState, setFollowState] = useState({ following })

	const [optimisticFollow, setOptimisticFollow] = useOptimistic(followState, state => ({
		following: !state.following
	}))

	const handleFollowAction = async () => {
		setOptimisticFollow('')
		try {
			await switchFollowAction(username)
			setFollowState(prev => ({ following: !prev.following }))
			router.refresh()
		} catch (error) {
			console.log('Error while following user', error)
		}
	}

	return (
		<form action={handleFollowAction}>
			<button
				className={cn('article-meta-button', optimisticFollow.following && 'active', className)}
			>
				<HeartIcon size={16} />
				<span>{optimisticFollow.following ? 'Unfollow' : 'Follow'}</span>
			</button>
		</form>
	)
}
