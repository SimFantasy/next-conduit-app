'use client'

import { ICommentResponse } from '@/lib/types'
import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { UserAvatar } from '@/components/common/user-avatar'

import { formatRelativeDate } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

interface CommentItemProps {
	comment: ICommentResponse
	onRemove: (formData: FormData) => void
}

export const CommentItem = ({ comment, onRemove }: CommentItemProps) => {
	const authUser = useAuth(state => state.authUser)
	const isAuthor = authUser?.id === comment.author.id

	return (
		<div className='flex flex-col border border-neutral-200 rounded-lg bg-white'>
			<div className='flex justify-between items-center gap-x-4 p-4 border-b border-neutral-200'>
				<Link
					href={`/profile/${comment.author.username}`}
					className='group/avatar flex items-center gap-x-2'
				>
					<UserAvatar size={8} user={comment.author} />

					<div className='flex flex-col'>
						<div className='text-smfont-semibold text-neutral-700 group-hover/avatar:text-emerald-500'>
							{comment.author.username}
						</div>
						<div className='text-xs text-neutral-400'>{formatRelativeDate(comment.createdAt)}</div>
					</div>
				</Link>

				{/* Comment options */}
				{isAuthor && (
					<form action={onRemove}>
						<input type='hidden' value={comment.id} name='id' />
						<Button variant='ghost' size='icon'>
							<TrashIcon size={16} className='text-neutral-500' />
						</Button>
					</form>
				)}
			</div>
			{/* Comment Content */}
			<div className='text-sm text-neutral-500 p-4'>{comment.body}</div>
		</div>
	)
}
