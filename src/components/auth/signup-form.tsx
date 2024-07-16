'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { AuthButton } from '@/components/auth/auth-button'

import { formInitialState } from '@/lib/types'
import { signupAction } from '@/actions/user'

export const SignupForm = () => {
	const router = useRouter()

	const initialState: formInitialState = {
		success: false,
		error: false,
		message: ''
	}
	const [state, formAction] = useActionState(signupAction, initialState)

	useEffect(() => {
		if (state.success) {
			toast.success(state.message)
			router.push(`/login?email=${state.user?.email}`)
		}
	}, [router, state.success, state.message, state.user])

	return (
		<AuthWrapper
			title='Create an Account'
			description='Sign up with your email and password'
			footerText='Already have an account?'
			footerLink='/login'
			errors={state.error ? [state.message] : []}
		>
			<form action={formData => formAction({ formData })} className='form-container'>
				<div className='form-item'>
					<div className='form-control'>
						<Input type='text' name='username' placeholder='Username' />
					</div>
				</div>

				<div className='form-item'>
					<div className='form-control'>
						<Input type='text' name='email' placeholder='Email' />
					</div>
				</div>

				<div className='form-item'>
					<div className='form-control'>
						<Input type='password' name='password' placeholder='Password' />
					</div>
				</div>

				<div className='form-item'>
					<AuthButton text='Sign Up' loadingText='Signing Up...' />
				</div>
			</form>
		</AuthWrapper>
	)
}
