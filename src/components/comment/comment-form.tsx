'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { useAuth } from '@/hooks/use-auth'
import { commentSchema } from '@/lib/schemas'
import { createCommentAction } from '@/actions/comment'

interface CommentFormProps {
	slug: string
}

export const CommentForm = ({ slug }: CommentFormProps) => {
	const router = useRouter()
	const author = useAuth(state => state.authUser)
	const [error, setError] = useState('')
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			body: ''
		}
	})

	const onSubmit = async (values: z.infer<typeof commentSchema>) => {
		// console.log('values', values)
		setError('')
		startTransition(() => {
			createCommentAction(slug, values)
				.then(res => {
					router.refresh()
				})
				.catch(error => {
					setError(error.message)
					console.log('Comment creation failed', error)
				})
		})
	}

	if (!author) return null
	return (
		<div className='flex justify-between gap-x-4 w-full pb-6 border-b border-neutral-300'>
			<Avatar className='w-10 h-10'>
				<AvatarImage src={author.image} alt={author.username} />
				<AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
			</Avatar>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 flex flex-col gap-y-4'>
					<FormField
						control={form.control}
						name='body'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										placeholder='Write a comment...'
										rows={4}
										{...field}
										disabled={isPending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<Button
							type='submit'
							className='bg-emerald-500 hover:bg-emerald-600'
							disabled={isPending}
						>
							{isPending ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
