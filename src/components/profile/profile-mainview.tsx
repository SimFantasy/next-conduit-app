import { TopTabs } from '@/components/home/top-tabs'
import { ArticleList } from '@/components/article/article-list'
import { getArticlesAction } from '@/actions/article'

const profileTabs = [
	{ label: 'My Articles', value: 'my' },
	{ label: 'Favorited Articles', value: 'favorited' }
]

interface ProfileMainViewProps {
	page: number
	tab: 'my' | 'favorited'
	username: string
}
export const ProfileMainView = async ({ page, tab, username }: ProfileMainViewProps) => {
	const query = tab === 'my' ? { author: username } : { favorited: username }
	const data = await getArticlesAction({ ...query, page })
	return (
		<div className='page-container flex flex-col gap-y-4 mb-6'>
			<TopTabs tabs={profileTabs} tabkey='tab' />

			<ArticleList data={data} page={page} />
		</div>
	)
}
