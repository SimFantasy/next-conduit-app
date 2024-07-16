import { getArticlesAction } from '@/actions/article'
import { ArticleList } from '@/components/article/article-list'

interface SearchPageProps {
	searchParams: {
		page: number
		q?: string
		tag?: string
	}
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
	const keyword = searchParams.q?.toLowerCase()
	const page = searchParams.page || 1
	const tag = searchParams.tag

	const data = await getArticlesAction({ page, keyword, tag })

	return (
		<div className='page-container my-6'>
			<div className='page-card flex flex-col p-0'>
				<h1 className='p-4 text-xl font-semibold border-b border-neutral-200'>
					Search <span className='text-emerald-500'>{keyword}</span> results
				</h1>

				<div className='flex flex-col gap-y-6 p-6'>
					<ArticleList data={data} page={page} />
				</div>
			</div>
		</div>
	)
}

export default SearchPage
