'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormItem, FormControl, FormField, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { registerSchema } from '@/lib/schemas'
import { fetcher } from '@/lib/fetcher'

export const RegisterForm = () => {
	const router = useRouter()
	const [errors, setErrors] = useState<string[]>([])
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			email: '',
			password: ''
		}
	})

	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		// console.log('values', values)
		setErrors([])
		startTransition(() =>
			fetcher('/api/auth/register', 'POST', values)
				.then(res => {
					setErrors([])
					toast.success('Account created successfully !')
					router.push(`/login?email=${values.email}`)
				})
				.catch(error => {
					setErrors(error.errors)
				})
		)
	}

	console.log('errors', errors)
	return (
		<AuthWrapper
			title='Create an Account'
			description='Sign up with your email and password'
			footerText='Already have an account?'
			footerLink='/login'
			errors={errors}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder='Username' {...field} disabled={isPending} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
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
								<FormControl>
									<Input type='password' placeholder='Password' {...field} disabled={isPending} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' className='w-full' disabled={isPending}>
						{isPending ? 'Creating...' : 'Create Account'}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
