import { User } from '@prisma/client'

export interface IUserProfileResponse {
	id: string
	username: string
	email: string
	bio: string | null
	image: string
	following: boolean
}

export interface IArticleResponse {
	authorId: string
	author: IUserProfileResponse
	title: string
	slug: string
	description: string
	body: string
	tagList: string[]
	media: string[]
	favorited: boolean
	favoritesCount: number
	commentsCount: number
	createdAt: string
	updatedAt: string
}

export interface ICommentResponse {
	id: string
	authorId: string
	author: IUserProfileResponse
	body: string
	createdAt: string
	updatedAt: string
}

export interface IUserResponse {
	id: string
	username: string
	email: string
	bio: string
	image: string
	createdAt: string
	followed: boolean
	following: number
	followers: number
	articles: number
}

export interface formInitialState {
	success: boolean
	error: boolean
	message: string
	user?: IUserProfileResponse
}
