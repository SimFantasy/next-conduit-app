import { CommentList } from '@/components/comment/comment-list'

import { getCommentsAction } from '@/actions/comment'

export const ArticleDetailComments = async ({ slug }: { slug: string }) => {
	const comments = await getCommentsAction(slug)
	if (!comments) return null
	return (
		<div className='flex flex-col items-center mx-auto w-full md:max-w-md lg:max-w-xl xl:max-w-3xl pb-10'>
			<h1 id='comments'></h1>
			<CommentList slug={slug} comments={comments} />
		</div>
	)
}
