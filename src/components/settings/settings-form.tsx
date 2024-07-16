'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { ImageUpload } from '@/components/common/image-upload'

import { IUserProfileResponse } from '@/lib/types'
import { userSchema } from '@/lib/schemas'
import { updateUser } from '@/actions/user'

interface SettingsFormProps {
	user: IUserProfileResponse
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState('')

	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			image: user.image,
			username: user.username || '',
			email: user.email || '',
			password: '',
			bio: user.bio || ''
		}
	})

	const onSubmit = (values: z.infer<typeof userSchema>) => {
		// console.log('values', values)
		setError('')
		startTransition(() =>
			updateUser(values)
				.then(res => {
					if (res.success) {
						toast.success('Profile updated successfully')
						router.refresh()
					}
				})
				.catch(err => {
					setError(err.message)
				})
		)
	}
	return (
		<div className='p-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Avatar</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										onChange={url => field.onChange(url)}
										onRemove={() => field.onChange('')}
										disabled={isPending}
										single
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder='Username' {...field} disabled={isPending} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Email' {...field} disabled={isPending} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type='password' placeholder='Password' {...field} disabled={isPending} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name='bio'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea placeholder='Bio' {...field} rows={4} disabled={isPending}></Textarea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-between items-center gap-x-4'>
						<div className='text-red-500'>{error}</div>

						<div className='flex justify-end items-center gap-x-4'>
							<Button type='button' variant='outline' onClick={() => router.back()}>
								Cancel
							</Button>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Updating...' : 'Update Settings'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}
