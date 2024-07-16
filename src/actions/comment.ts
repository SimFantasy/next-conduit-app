'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/actions/user'
import { commentSchema } from '@/lib/schemas'
import { calculateScore, userMapper } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const getCommentsAction = async (slug: string) => {
	try {
		const comments = await db.comment.findMany({
			where: {
				article: { slug }
			},
			include: {
				author: true
			},
			orderBy: { createdAt: 'desc' }
		})

		return comments.map(comment => ({
			...comment,
			createdAt: comment.createdAt.toISOString(),
			updatedAt: comment.updatedAt.toISOString(),
			author: userMapper(comment.author)
		}))
	} catch (error) {
		console.log('Error getting comments: ', error)
		throw new Error('Something went wrong getting comments')
	}
}

export const createCommentAction = async (slug: string, values: z.infer<typeof commentSchema>) => {
	const currentUser = await getCurrentUser()
	if (!currentUser) {
		throw new Error('Not authorized')
	}

	const existingArticle = await db.article.findFirst({
		where: { slug },
		include: {
			author: true,
			comments: true
		}
	})
	if (!existingArticle) {
		throw new Error('Article not found')
	}

	const validatedFields = commentSchema.safeParse(values)
	if (!validatedFields.success) {
		throw new Error('Invalid input')
	}

	try {
		const data = await db.comment.create({
			data: {
				body: validatedFields.data.body,
				articleId: existingArticle.id,
				authorId: currentUser.id
			},
			include: {
				author: true
			}
		})

		const newScore = calculateScore(
			existingArticle.clicks,
			existingArticle.favoritesCount,
			existingArticle.comments.length + 1
		)

		await db.article.update({
			where: { id: existingArticle.id },
			data: {
				score: newScore
			}
		})

		return {
			comment: {
				...data,
				createdAt: data.createdAt.toISOString(),
				updatedAt: data.updatedAt.toISOString(),
				author: userMapper(data.author)
			}
		}
	} catch (error) {
		console.log('Error creating comment: ', error)
		throw new Error('Something went wrong creating comment')
	}
}

export const deleteCommentAction = async (slug: string, id: string) => {
	const currentUser = await getCurrentUser()
	if (!currentUser) {
		throw new Error('Not authorized')
	}

	try {
		await db.comment.delete({
			where: {
				id,
				article: { slug },
				author: { id: currentUser.id }
			}
		})

		revalidatePath('/(main)/article/[slug]', 'page')

		return { success: true }
	} catch (error) {
		console.log('Error deleting comment: ', error)
		throw new Error('Something went wrong deleting comment')
	}
}
