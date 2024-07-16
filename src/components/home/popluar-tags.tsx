import { getTagsAction } from '@/actions/tag'
import { QueryLink } from '../common/query-link'

export const PopluarTags = async () => {
	const tags = await getTagsAction()
	// console.log('tags', tags)
	return (
		<div className='page-card p-0'>
			<div className='card-header'>PopluarTags Articles</div>
			<div className='flex flex-wrap gap-2 p-4'>
				{tags.map(tag => (
					<QueryLink
						key={tag.id}
						reserved
						query={{ tag: tag.name }}
						className='tag-link px-1.5 py-0.5'
					>
						{tag.name}
					</QueryLink>
				))}
			</div>
		</div>
	)
}
