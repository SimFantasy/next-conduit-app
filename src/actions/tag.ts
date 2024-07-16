'use server'

import { db } from '@/lib/db'
import { POPULAR_TAGS_LIMIT } from '@/lib/constants'

export const getTagsAction = async () => {
	try {
		const tags = await db.tag.findMany({
			where: {
				articles: {
					some: { NOT: [] }
				}
			},
			select: {
				id: true,
				name: true
			},
			take: POPULAR_TAGS_LIMIT
		})

		return tags
	} catch (error) {
		console.log('Error getting tags', error)
		throw new Error('Something went wrong, Error getting tags')
	}
}
