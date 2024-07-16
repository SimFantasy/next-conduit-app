'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useSession } from 'next-auth/react'
import { Loader } from '@/components/common/loader'
import { IUserProfileResponse } from '@/lib/types'

interface AuthUserProviderProps {
	children: React.ReactNode
	currentUser: IUserProfileResponse | null
}

export const AuthUserProvider = ({ children, currentUser }: AuthUserProviderProps) => {
	const [loading, setLoading] = useState(true)

	const { data: session, status } = useSession()
	const setAuthUser = useAuth(state => state.setAuthUser)

	useEffect(() => {
		if (status === 'loading') {
			setLoading(true)
		} else {
			if (session) {
				setAuthUser(session.user)
			} else {
				setAuthUser(null)
			}
			setLoading(false)
		}
	}, [session, status, setAuthUser])

	if (loading) {
		return (
			<div className='flex items-center gap-x-2 p-2'>
				<Loader text='Conduit Loading...' />
			</div>
		)
	}
	return <>{children}</>
}
