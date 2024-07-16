import { AuthProvider } from '@/components/providers/auth-provider'
import { AuthUserProvider } from '@/components/providers/auth-user-provider'

import { getCurrentUser } from '@/actions/user'

export const Provider = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentUser()
	return (
		<AuthProvider>
			<AuthUserProvider currentUser={currentUser}>{children}</AuthUserProvider>
		</AuthProvider>
	)
}
