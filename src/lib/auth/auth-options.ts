import { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { db } from '@/lib/db'
import { loginSchema } from '@/lib/schemas'
import { comparePassword } from '@/lib/utils'

export const authOptions: AuthOptions = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				const validatedFields = loginSchema.safeParse(credentials)
				if (!validatedFields.success) return null
				const { email, password } = validatedFields.data

				try {
					const user = await db.user.findUnique({
						where: { email }
					})
					if (!user) return null

					const isMatch = comparePassword(password, user.password)
					if (!isMatch) return null

					return { id: user.id, name: user.username, email: user.email, image: user.image }
				} catch (error) {
					console.log('Error while logging in', error)
					return null
				}
			}
		})
	],
	pages: {
		signIn: '/login'
	},
	session: { strategy: 'jwt' },
	secret: process.env.NEXTAUTH_SECRET!,
	jwt: { secret: process.env.NEXTAUTH_JWT_SECRET! },
	callbacks: {
		async jwt({ token, user }: { token: any; user: any }) {
			if (user) {
				token.id = user.id
				token.name = user.name
				token.email = user.email
				token.image = user.image
			}

			// console.log('jwt token', token)
			// console.log('jwt user', user)

			return token
		},
		async session({ session, token }: { session: any; token: any }) {
			if (token && session.user) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.image
			}

			// console.log('session session', session)
			// console.log('session token', token)

			return session
		}
	}
}
