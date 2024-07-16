'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { signOut } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { userMapper, hashPassword } from '@/lib/utils'
import { registerSchema, userSchema } from '@/lib/schemas'
import { IUserResponse, formInitialState } from '@/lib/types'

export const getCurrentUser = async () => {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) return null

	const user = await db.user.findUnique({
		where: { email: session.user.email }
	})

	if (!user) return null

	return userMapper(user)
}

export const updateUser = async (values: z.infer<typeof userSchema>) => {
	const filteredValues = Object.fromEntries(
		Object.entries(values).filter(([_, value]) => value !== '')
	)

	const validatedValues = userSchema.safeParse(filteredValues)
	if (!validatedValues.success) {
		console.log('Invalid user data:', validatedValues.error.flatten().fieldErrors)
		throw new Error('Invalid user data')
	}

	const currentUser = await getCurrentUser()
	if (!currentUser) {
		throw new Error('Not authorized')
	}

	if (validatedValues.data.password && validatedValues.data.password !== '') {
		validatedValues.data.password = hashPassword(validatedValues.data.password)
	}
	try {
		await db.user.update({
			where: { id: currentUser.id },
			data: validatedValues.data
		})

		return { success: true }
	} catch (error) {
		console.log('Error updating user:', error)
		throw new Error('Something went wrong, Error updating user')
	}
}

export const getUserProfile = async (username: string): Promise<IUserResponse | null> => {
	const currentUser = await getCurrentUser()
	try {
		const user = await db.user.findUnique({
			where: { username },
			include: {
				articles: true,
				followers: true,
				following: {
					where: { followerId: currentUser?.id }
				}
			}
		})

		if (!user) return null

		const followed = user?.followers.some(follower => follower.followerId === currentUser?.id)

		return {
			id: user.id,
			username: user.username,
			email: user.email,
			bio: user.bio || '',
			image: user.image || '/images/default-avatar.png',
			createdAt: user.createdAt.toISOString(),
			followed,
			following: user.following.length,
			followers: user.followers.length,
			articles: user.articles.length
		}
	} catch (error) {
		console.log('Error getting user by username:', error)
		throw new Error('Something went wrong, Error getting user by username')
	}
}

export const Logout = async () => {
	return signOut()
}

export const signupAction = async (
	prevState: formInitialState,
	payload: { formData: FormData }
) => {
	const values = Object.fromEntries(payload.formData)
	const validatedValues = registerSchema.safeParse(values)
	if (!validatedValues.success) {
		return { success: false, error: true, message: 'Invalid user data' }
	}

	const { email, username, password } = validatedValues.data

	const existingUserEmail = await db.user.findUnique({
		where: { email }
	})
	if (existingUserEmail) {
		return { success: false, error: true, message: 'Email already exists' }
	}

	const existingUserUsername = await db.user.findUnique({
		where: { username }
	})
	if (existingUserUsername) {
		return { success: false, error: true, message: 'Username already exists' }
	}

	const hashedPassword = hashPassword(password!)

	try {
		const user = await db.user.create({
			data: {
				email,
				username,
				password: hashedPassword
			}
		})

		return {
			success: true,
			error: false,
			message: 'User created successfully',
			user: userMapper(user)
		}
	} catch (error) {
		console.log('Error creating user:', error)
		return { success: false, error: true, message: 'Something went wrong, Error creating user' }
	}
}
