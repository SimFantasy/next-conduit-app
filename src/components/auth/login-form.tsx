'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormItem, FormControl, FormField, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { loginSchema } from '@/lib/schemas'

export const LoginForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams.get('email')

	const [errors, setErrors] = useState<string[]>([])
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: email ? email : '',
			password: ''
		}
	})

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		// console.log('values', values)
		setErrors([])
		startTransition(() =>
			signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false
			})
				.then(res => {
					if (res?.error) {
						setErrors([res.error])
						return
					}

					setErrors([])
					toast.success('Login successful')
					router.push('/')
				})
				.catch(error => {
					setErrors(error.errors)
				})
		)
	}

	return (
		<AuthWrapper
			title='Sign In'
			description='Sign in to your account'
			footerText="Don't have an account?"
			footerLink='/register'
			errors={errors}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
						{isPending ? 'Signing...' : 'Sign In'}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
