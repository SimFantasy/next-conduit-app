import { z } from 'zod'

export const registerSchema = z.object({
	username: z.string().min(3).max(64),
	email: z.string().email(),
	password: z.string().min(6).max(24)
})

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(24)
})

export const userSchema = z.object({
	// id: z.string(),
	username: z.string().min(3).max(64),
	email: z.string().email(),
	password: z.string().optional(),
	bio: z.string().max(255).optional(),
	image: z.string()
})

export const articleSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1).max(255),
	body: z.string().min(1).max(10000),
	tagList: z.array(z.string()),
	media: z.array(z.string())
})

export const commentSchema = z.object({
	body: z.string().min(1, 'Comment body is required').max(10000, 'Comment body to long')
})
