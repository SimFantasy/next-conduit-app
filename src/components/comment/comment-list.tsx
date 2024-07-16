'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { CommentItem } from '@/components/comment/comment-item'
import { EmptyContent } from '@/components/common/empty-content'
import { UserAvatar } from '@/components/common/user-avatar'

import { useAuth } from '@/hooks/use-auth'
import { ICommentResponse } from '@/lib/types'
import { createCommentAction, deleteCommentAction } from '@/actions/comment'

interface CommentListProps {
	comments: ICommentResponse[]
	slug: string
}

export const CommentList = ({ comments, slug }: CommentListProps) => {
	const author = useAuth(state => state.authUser)
	const [commentBody, setCommentBody] = useState('')
	const [error, setError] = useState('')
	const [commentsData, setCommentsData] = useState(comments)
	const [isPending, startTransition] = useTransition()

	const [optimisticComments, setOptimisticComments] = useOptimistic(
		commentsData,
		(state, value: { type: 'add'; comment: ICommentResponse } | { type: 'delete'; id: string }) =>
			value.type === 'add'
				? [value.comment, ...state]
				: state.filter(comment => comment.id !== value.id)
	)

	const handleAddComment = async () => {
		// console.log('values', values)
		if (commentBody.trim() === '') {
			setError('Comment body cannot be empty')
			return
		}

		if (author === null) {
			setError('You must be logged in to comment')
			return
		}

		startTransition(() => {
			setError('')
			// setOptimisticComments({
			// 	id: Math.random().toString(),
			// 	createdAt: new Date().toISOString(),
			// 	updatedAt: new Date().toISOString(),
			// 	body: commentBody,
			// 	authorId: author.id,
			// 	author: {
			// 		username: author.username,
			// 		image: author.image,
			// 		email: author.email,
			// 		id: author.id,
			// 		bio: author.bio,
			// 		following: author.following || false
			// 	}
			// })
			setOptimisticComments({
				type: 'add',
				comment: {
					id: Math.random().toString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					body: commentBody,
					authorId: author.id,
					author: {
						username: author.username,
						image: author.image,
						email: author.email,
						id: author.id,
						bio: author.bio,
						following: author.following || false
					}
				}
			})
			createCommentAction(slug, { body: commentBody })
				.then(res => {
					setCommentsData(prev => [res.comment, ...prev])
					toast.success('Comment created successfully')
					setCommentBody('')
				})
				.catch(error => {
					setError(error.message)
					console.log('Comment creation failed', error)
				})
		})
	}

	const handleDeleteComment = async (formData: FormData) => {
		const id = formData.get('id') as string
		if (author === null) {
			setError('You must be logged in to comment')
			return
		}

		startTransition(() => {
			setOptimisticComments({ type: 'delete', id })
		})

		deleteCommentAction(slug, id)
			.then(() => {
				setCommentsData(prev => prev.filter(comment => comment.id !== id))
				toast.success('Comment deleted successfully')
			})
			.catch(error => {
				console.log('Comment delete failed', error)
			})
	}

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<div className='flex justify-between gap-x-4 w-full pb-6 border-b border-neutral-300'>
				<UserAvatar user={author} />

				<form action={handleAddComment} className='flex-1 flex flex-col gap-y-4'>
					<Textarea
						placeholder='Write a comment...'
						rows={4}
						value={commentBody}
						onChange={e => setCommentBody(e.target.value)}
						disabled={isPending}
					></Textarea>
					<div className='flex justify-between items-center gap-x-4'>
						<span className='text-sm text-red-500'>{error || ''}</span>
						<Button
							type='submit'
							className='bg-emerald-500 hover:bg-emerald-600'
							disabled={isPending}
						>
							{isPending ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				</form>
			</div>

			{/* Comment List */}
			<div className='flex flex-col gap-y-4'>
				{optimisticComments.length === 0 ? (
					<EmptyContent text='No comments yet.' />
				) : (
					optimisticComments.map(comment => (
						<CommentItem key={comment.id} comment={comment} onRemove={handleDeleteComment} />
					))
				)}
			</div>
		</div>
	)
}
