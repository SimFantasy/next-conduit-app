'use client'

import { AuthErrors } from '@/components/auth/auth-errors'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthWrapperProps {
	children: React.ReactNode
	title: string
	description: string
	footerText: string
	footerLink: string
	errors?: string[]
}

export const AuthWrapper = ({
	children,
	title,
	description,
	footerText,
	footerLink,
	errors
}: AuthWrapperProps) => {
	return (
		<div className='flex flex-col gap-y-6 mx-auto w-full max-w-md'>
			<div className='flex flex-col items-center gap-y-4'>
				<h1 className='text-2xl font-semibold'>{title}</h1>
				<div className='text-sm text-gray-500'>{description}</div>
			</div>

			{errors && <AuthErrors errors={errors} />}

			{children}

			<Button variant='link' asChild className='w-full'>
				<Link href={footerLink}>{footerText}</Link>
			</Button>
		</div>
	)
}
