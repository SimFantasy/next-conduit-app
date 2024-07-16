import { ArticleItem } from '@/components/article/article-item'
import { Pagination } from '@/components/article/pagination'
import { EmptyContent } from '@/components/common/empty-content'
import { IArticleResponse } from '@/lib/types'

interface ArticleListProps {
	data: {
		articles: IArticleResponse[]
		articlesCount: number
	}
	page: number
}

export const ArticleList = async ({ data, page }: ArticleListProps) => {
	return (
		<>
			{data.articles.length === 0 ? (
				<EmptyContent text='No articles found' />
			) : (
				<>
					{data.articles.map((article: IArticleResponse) => (
						<ArticleItem key={article.slug} article={article} />
					))}

					<div className='flex justify-center items-center'>
						<Pagination count={data.articlesCount} page={page} />
					</div>
				</>
			)}
		</>
	)
}
