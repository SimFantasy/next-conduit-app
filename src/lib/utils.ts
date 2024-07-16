import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import bcryptjs from 'bcryptjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import slugify from 'slugify'

import { User } from '@prisma/client'

import { CLICK_SCORE, FAVORITE_SCORE, COMMENT_SCORE } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function hashPassword(password: string) {
	return bcryptjs.hashSync(password, 10)
}

export function comparePassword(password: string, hashedPassword: string) {
	return bcryptjs.compareSync(password, hashedPassword)
}

dayjs.extend(relativeTime)
export const formatDate = (date: string, format: string = 'YYYY-MM-DD') =>
	dayjs(date).format(format)
export const formatRelativeDate = (date: string) => dayjs().to(dayjs(date))

export const formatSlug = (title: string) => {
	let processedTitle = slugify(title, { lower: true, replacement: '-', remove: /[^\w\s-]/g })

	processedTitle = processedTitle.replace(/[-]+/g, '-')
	processedTitle = processedTitle.replace(/([a-zA-Z])([0-9])/g, '$1-$2')
	processedTitle = processedTitle.replace(/([0-9])([a-zA-Z])/g, '$1-$2')
	processedTitle = processedTitle.replace(/^-+|-+$/g, '')

	return processedTitle
}

export const userMapper = (user: User, following: boolean = false) => {
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		bio: user.bio,
		image: user.image || '/images/default-avatar.png',
		following
	}
}

export const calculateScore = (clicks: number, favorites: number, comments: number) => {
	return clicks * CLICK_SCORE + favorites * FAVORITE_SCORE + comments * COMMENT_SCORE
}
