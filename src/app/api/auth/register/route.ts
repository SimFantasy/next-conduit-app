import { NextRequest } from 'next/server'
import { ApiResponse } from '@/lib/response'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/schemas'
import { hashPassword, userMapper } from '@/lib/utils'

export const POST = async (req: NextRequest) => {
	const userData = await req.json()
	const validataedFields = registerSchema.safeParse(userData)
	if (!validataedFields.success) {
		return ApiResponse.badRequest('Register Invalid fields')
	}

	const { email, username, password } = validataedFields.data
	try {
		const existingEmail = await db.user.findFirst({ where: { email } })
		if (existingEmail) {
			return ApiResponse.badRequest('Email already exists')
		}

		const exisitingUsername = await db.user.findFirst({ where: { username } })
		if (exisitingUsername) {
			return ApiResponse.badRequest('Username already exists')
		}

		const hashedPassword = hashPassword(password)
		const user = await db.user.create({
			data: {
				email,
				username,
				password: hashedPassword
			}
		})

		return ApiResponse.ok({ user: userMapper(user) })
	} catch (error) {
		console.log('Error while registering user', error)
		return ApiResponse.badRequest('Something went wrong while registering user')
	}
}
