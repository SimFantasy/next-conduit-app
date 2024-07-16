'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface AuthButtonProps {
	text: 'Sign Up' | 'Log In'
	loadingText: 'Signing Up...' | 'Logging In...'
}

export const AuthButton = ({ text, loadingText }: AuthButtonProps) => {
	const { pending } = useFormStatus()
	return (
		<Button type='submit' className='w-full' disabled={pending}>
			{pending ? loadingText : text}
		</Button>
	)
}
