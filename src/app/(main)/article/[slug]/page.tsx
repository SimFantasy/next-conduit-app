import { redirect } from 'next/navigation'
import { getArticleAction } from '@/actions/article'

import { ArticleDetailBanner } from '@/components/article/article-detail-banner'
import { ContentPreview } from '@/components/common/content-preview'
import { ArticleDetailMeta } from '@/components/article/article-detail-meta'
import { Separator } from '@/components/ui/separator'
import { QueryLink } from '@/components/common/query-link'
import { ArticleDetailComments } from '@/components/article/article-detail-comments'

const ArticlePage = async ({ params }: { params: { slug: string } }) => {
	const article = await getArticleAction(params.slug)
	if (!article) return redirect('/')
	return (
		<div className='flex flex-col gap-y-6'>
			<ArticleDetailBanner title={article.title} media={article.media}>
				<ArticleDetailMeta article={article} />
			</ArticleDetailBanner>

			<div className='page-container flex flex-col gap-y-8'>
				<div className='page-card flex flex-col gap-y-6 p-4 pb-0 md:p-8 md:pb-4 lg:p-12 lg:pb-4 xl:p-16 xl:pb-4'>
					<ContentPreview content={article.body} />

					<div className='flex items-center gap-x-2'>
						<span className='text-gray-500 text-sm font-semibold'>Tags: </span>
						{article.tagList.map((tag, index) => (
							<QueryLink key={index} reserved query={{ tag }} className='tag-link'>
								{tag}
							</QueryLink>
						))}
					</div>

					<Separator />

					<div className='flex justify-center items-center py-4'>
						<ArticleDetailMeta article={article} className='dark' />
					</div>
				</div>

				<ArticleDetailComments slug={article.slug} />
			</div>
		</div>
	)
}

export default ArticlePage
