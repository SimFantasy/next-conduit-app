'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/actions/user'
import { articleSchema } from '@/lib/schemas'
import { calculateScore, formatSlug, userMapper } from '@/lib/utils'
import { PAGE_SIZE, ACTIVE_ARTICLES_LIMIT } from '@/lib/constants'
import { connect } from 'http2'

export const createArticleAction = async (values: z.infer<typeof articleSchema>) => {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('User is not unauthenticated!')
	}

	const validatedFields = articleSchema.safeParse(values)
	if (!validatedFields.success) {
		throw new Error('Invalid article data')
	}

	const { title, description, body, tagList, media } = validatedFields.data

	let slug = formatSlug(title)

	const existingSlug = await db.article.findFirst({
		where: { slug }
	})
	if (existingSlug) {
		slug = `${slug}-${Date.now()}`
	}

	try {
		const article = await db.article.create({
			data: {
				title,
				slug,
				description,
				body,
				authorId: user.id,
				tagList: {
					create: tagList?.map(tag => ({
						tag: {
							connectOrCreate: {
								create: { name: tag },
								where: { name: tag }
							}
						}
					}))
				},
				media: {
					create: media?.map(url => ({ url }))
				}
			}
		})

		return article
	} catch (error) {
		console.log('Error while creating article: ', error)
		throw new Error('Something went wrong, Error while creating article')
	}
}

export const getArticleAction = async (slug: string) => {
	const loginUser = await getCurrentUser()

	try {
		const articleData = await db.article.findUnique({
			where: { slug },
			include: {
				author: {
					include: {
						followers: {
							where: { followerId: loginUser?.id }
						}
					}
				},
				favorites: {
					where: { userId: loginUser?.id }
				},
				_count: {
					select: { favorites: true, comments: true }
				},
				tagList: {
					select: {
						tag: {
							select: { name: true }
						}
					}
				},
				media: {
					select: { url: true }
				}
			}
		})

		if (!articleData) return null

		const following = articleData.author.followers.some(
			follow => follow.followerId === loginUser?.id
		)

		const favorited = articleData.favorites.some(favorite => favorite.userId === loginUser?.id)

		return {
			...articleData,
			createdAt: articleData.createdAt.toISOString(),
			updatedAt: articleData.updatedAt.toISOString(),
			author: {
				...userMapper(articleData.author),
				following
			},
			tagList: articleData.tagList.map(tag => tag.tag.name),
			media: articleData.media.map(media => media.url),
			favorited,
			favoritesCount: articleData._count.favorites,
			commentsCount: articleData._count.comments
		}
	} catch (error) {
		console.log('Error while fetching article: ', error)
		throw new Error('Something went wrong, Error while fetching article')
	}
}

export const getArticlesAction = async (params: {
	pageSize?: number
	page?: number
	tag?: string
	feed?: string
	author?: string
	favorited?: string
	keyword?: string
}) => {
	const { pageSize = PAGE_SIZE, page = 1 } = params
	const limit = pageSize
	const offset = (page - 1) * pageSize

	const loginUser = await getCurrentUser()

	let query: any = {}

	if (params.tag) {
		query = {
			tagList: {
				some: {
					tag: { name: params.tag }
				}
			}
		}
	}

	if (params.feed === 'feed') {
		query = {
			author: {
				followers: {
					some: {
						followerId: loginUser?.id
					}
				}
			}
		}
	}

	if (params.author) {
		query = {
			author: {
				username: params.author
			}
		}
	}

	if (params.favorited) {
		query = {
			favorites: {
				some: {
					user: {
						username: params.favorited
					}
				}
			}
		}
	}

	if (params.keyword) {
		query = {
			title: {
				contains: params.keyword
			}
		}
	}

	try {
		const articlesCount = await db.article.count({ where: query })

		const articlesData = await db.article.findMany({
			where: query,
			skip: offset,
			take: limit,
			include: {
				author: {
					include: {
						followers: {
							where: { followerId: loginUser?.id }
						}
					}
				},
				favorites: {
					where: { userId: loginUser?.id }
				},
				_count: {
					select: { favorites: true, comments: true }
				},
				tagList: {
					select: {
						tag: {
							select: { name: true }
						}
					}
				},
				media: {
					select: { url: true }
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		return {
			articles: articlesData.map(article => {
				const following = article.author.followers.some(
					follow => follow.followerId === loginUser?.id
				)
				const favorited = article.favorites.some(favorite => favorite.userId === loginUser?.id)

				return {
					...article,
					createdAt: article.createdAt.toISOString(),
					updatedAt: article.updatedAt.toISOString(),
					author: {
						...userMapper(article.author),
						following
					},
					tagList: article.tagList.map(tag => tag.tag.name),
					media: article.media.map(media => media.url),
					favorited,
					favoritesCount: article._count.favorites,
					commentsCount: article._count.comments
				}
			}),
			articlesCount
		}
	} catch (error) {
		console.log('Error while fetching articles: ', error)
		throw new Error('Something went wrong, Error while fetching articles')
	}
}

export const updateArticleAction = async (slug: string, values: z.infer<typeof articleSchema>) => {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('User is not unauthenticated!')
	}

	const existingArticle = await db.article.findUnique({
		where: { slug }
	})
	if (!existingArticle) {
		throw new Error('Article not found')
	}

	if (existingArticle.authorId !== user.id) {
		throw new Error('You are not authorized to edit this article')
	}

	const validatedFields = articleSchema.safeParse(values)
	if (!validatedFields.success) {
		throw new Error('Invalid article data')
	}

	const { title, description = '', body, tagList = [], media = [] } = validatedFields.data

	let newSlug = existingArticle.slug
	if (title !== existingArticle.title) {
		newSlug = formatSlug(title)
	}

	try {
		const newArticle = await db.article.update({
			where: { slug },
			data: {
				title,
				slug: newSlug,
				description,
				body,
				tagList: {
					deleteMany: { articleId: existingArticle.id },
					create: tagList.map(tag => ({
						tag: {
							connectOrCreate: {
								create: { name: tag },
								where: { name: tag }
							}
						}
					}))
				},
				media: {
					deleteMany: { articleId: existingArticle.id },
					create: media.map(url => ({ url }))
				}
			}
		})

		return newArticle
	} catch (error) {
		console.log('Error while updating article: ', error)
		throw new Error('Something went wrong, Error while updating article')
	}
}

export const deleteArticleAction = async (slug: string) => {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('User is not unauthenticated!')
	}

	const existingArticle = await db.article.findUnique({
		where: { slug }
	})
	if (!existingArticle) {
		throw new Error('Article not found')
	}

	if (existingArticle.authorId !== user.id) {
		throw new Error('You are not authorized to edit this article')
	}

	try {
		await db.article.delete({
			where: { slug }
		})

		return { success: true }
	} catch (error) {
		console.log('Error while deleting article: ', error)
		throw new Error('Something went wrong, Error while deleting article')
	}
}

export const swtichFavoriteAction = async (slug: string) => {
	const loginUser = await getCurrentUser()
	if (!loginUser) {
		throw new Error('User is not unauthenticated!')
	}

	const existingArticle = await db.article.findUnique({
		where: { slug },
		include: {
			comments: true
		}
	})
	if (!existingArticle) {
		throw new Error('Article not found')
	}

	try {
		const existingFavorite = await db.favorites.findFirst({
			where: {
				userId: loginUser.id,
				articleId: existingArticle.id
			}
		})

		if (existingFavorite) {
			await db.favorites.delete({
				where: {
					id: existingFavorite.id
				}
			})
		} else {
			await db.favorites.create({
				data: {
					userId: loginUser.id,
					articleId: existingArticle.id
				}
			})

			const newScore = calculateScore(
				existingArticle.clicks,
				existingArticle.favoritesCount + 1,
				existingArticle.comments.length
			)

			await db.article.update({
				where: { id: existingArticle.id },
				data: {
					favoritesCount: existingArticle.favoritesCount + 1,
					score: newScore
				}
			})
		}
	} catch (error) {
		console.log('Error while favoriting article: ', error)
		throw new Error('Something went wrong, Error while favoriting article')
	}
}

export const switchFollowAction = async (username: string) => {
	const loginUser = await getCurrentUser()
	if (!loginUser) {
		throw new Error('User is not unauthenticated!')
	}

	const existingUser = await db.user.findUnique({
		where: { username }
	})
	if (!existingUser) {
		throw new Error('User not found')
	}

	try {
		const existingFollow = await db.follows.findFirst({
			where: {
				followerId: loginUser.id,
				followingId: existingUser.id
			}
		})

		if (existingFollow) {
			await db.follows.delete({
				where: { id: existingFollow.id }
			})
		} else {
			await db.follows.create({
				data: {
					followerId: loginUser.id,
					followingId: existingUser.id
				}
			})
		}
	} catch (error) {
		console.log('Error while following user: ', error)
		throw new Error('Something went wrong, Error while following user')
	}
}

export const clickArticleAction = async (slug: string) => {
	try {
		const article = await db.article.update({
			where: { slug },
			data: {
				clicks: { increment: 1 }
			},
			include: {
				comments: true
			}
		})

		const newScore = calculateScore(
			article.clicks + 1,
			article.favoritesCount,
			article.comments.length
		)

		await db.article.update({
			where: { slug },
			data: {
				score: newScore
			}
		})
	} catch (error) {
		console.log('Error while clicking article: ', error)
		throw new Error('Something went wrong, Error while clicking article')
	}
}

export const activeArticlesAction = async () => {
	try {
		const articles = await db.article.findMany({
			orderBy: { score: 'desc' },
			take: ACTIVE_ARTICLES_LIMIT,
			include: {
				author: true,
				_count: {
					select: { favorites: true, comments: true }
				}
			}
		})

		return articles.map(article => ({
			...article,
			createdAt: article.createdAt.toISOString(),
			updatedAt: article.updatedAt.toISOString(),
			author: userMapper(article.author),
			favoritesCount: article._count.favorites,
			commentsCount: article._count.comments
		}))
	} catch (error) {
		console.log('Error while fetching active articles: ', error)
		throw new Error('Something went wrong, Error while fetching active articles')
	}
}
