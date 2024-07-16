import { TopTabs } from '@/components/home/top-tabs'
import { ArticleList } from '@/components/article/article-list'
import { getArticlesAction } from '@/actions/article'

interface MainViewProps {
	page: number
	tag?: string
	feed?: string
}

const homeTabs = [
	{ label: 'Global', value: 'global' },
	{ label: 'Feed', value: 'feed' }
]

export const MainView = async ({ page, tag, feed }: MainViewProps) => {
	const data = await getArticlesAction({ page, tag, feed })
	return (
		<div className='page-card flex flex-col gap-y-4 w-full'>
			<TopTabs tabs={homeTabs} />

			<ArticleList data={data} page={page} />
		</div>
	)
}
