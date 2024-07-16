'use client'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export const AuthErrors = ({ errors }: { errors: string[] }) => {
	if (errors.length === 0) return null

	if (errors[0] === 'CredentialsSignin') {
		errors = ['Invalid email or password.']
	}
	return (
		<Alert variant='destructive' className='bg-red-100'>
			<AlertCircle className='h-4 w-4' />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription className='flex flex-col gap-y-1'>
				{errors.map(error => (
					<div key={error} className='list-inside list-disc'>
						{error}
					</div>
				))}
			</AlertDescription>
		</Alert>
	)
}
